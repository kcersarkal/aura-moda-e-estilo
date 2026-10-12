"""
Aura Moda - Publicador Automático de Pins no Pinterest (API v5)
Integrado com o Supabase e Catálogo de Afiliados
"""

import os
import json
import urllib.request
import urllib.error

# Configurações do Pinterest
PINTEREST_ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN", "SEU_ACCESS_TOKEN_AQUI")
PINTEREST_BOARD_ID = os.getenv("PINTEREST_BOARD_ID", "SEU_BOARD_ID_AQUI")
SITE_URL = os.getenv("SITE_URL", "https://seu-dominio.com")

# Configurações do Supabase (Mesmo banco de onde o site consome)
SUPABASE_URL = "https://edzagtvukayclklhvokk.supabase.co/rest/v1"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemFndHZ1a2F5Y2xrbGh2b2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNjgzNTQsImV4cCI6MjEwMDY0NDM1NH0.dAfwIDKyLB-KCFCxZkWIIO_fWibhOXa2Ax_RT3KFXjM"

def create_pin(title, description, link, image_url, board_id=None):
    """
    Cria um Pin na API v5 do Pinterest.
    """
    board_id = board_id or PINTEREST_BOARD_ID
    if board_id == "SEU_BOARD_ID_AQUI" or PINTEREST_ACCESS_TOKEN == "SEU_ACCESS_TOKEN_AQUI":
        print("[ERRO] Configure PINTEREST_ACCESS_TOKEN e PINTEREST_BOARD_ID nas variáveis de ambiente.")
        return None

    endpoint = "https://api.pinterest.com/v5/pins"
    
    headers = {
        "Authorization": f"Bearer {PINTEREST_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "board_id": board_id,
        "title": title[:100],
        "description": description[:500],
        "link": link,
        "media_source": {
            "source_type": "image_url",
            "url": image_url
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(endpoint, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            print(f"[SUCESSO] Pin criado! ID: {res_data.get('id')}")
            return res_data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[ERRO HTTP {e.code}] Falha ao criar Pin: {error_body}")
        return None
    except Exception as e:
        print(f"[ERRO] {str(e)}")
        return None

def fetch_latest_products_from_supabase(limit=20):
    """
    Puxa os produtos mais recentes diretamente do Supabase.
    """
    endpoint = f"{SUPABASE_URL}/produtos?select=id,name,image,affiliate_url,source,category&order=id.desc&limit={limit}"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }

    req = urllib.request.Request(endpoint, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"[ERRO] Não foi possível ler produtos do Supabase: {e}")
        return []

def publish_from_supabase(limit=10):
    """
    Publica os últimos produtos do Supabase no Pinterest.
    """
    products = fetch_latest_products_from_supabase(limit=limit)
    print(f"Puxados {len(products)} produtos recentes do Supabase.")

    for p in products:
        store = "Mercado Livre" if p.get("source") == "mercadolivre" else "Shopee"
        title = f"{p['name'][:75]} | Achadinho {store}"
        desc = (
            f"Achadinho feminino imperdível na {store}! Peça queridinha com cupom e frete facilitado. "
            f"Confira todos os detalhes e garanta a sua no link oficial."
        )
        link = p.get("affiliate_url") or SITE_URL
        img_url = p["image"]

        print(f"\nPublicando Pin: {title[:45]}...")
        create_pin(title, desc, link, img_url)

if __name__ == "__main__":
    print("=== AURA MODA - PUBLICADOR PINTEREST API v5 COM SUPABASE ===")
    publish_from_supabase(limit=5)
