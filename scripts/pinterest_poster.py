"""
Aura Moda - Publicador Automático de Pins no Pinterest (API v5)
Documentação oficial: https://developers.pinterest.com/docs/api/v5/
"""

import os
import json
import urllib.request
import urllib.error

# Configurações (Preencha via variáveis de ambiente ou edite aqui)
PINTEREST_ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN", "SEU_ACCESS_TOKEN_AQUI")
PINTEREST_BOARD_ID = os.getenv("PINTEREST_BOARD_ID", "SEU_BOARD_ID_AQUI")
SITE_URL = os.getenv("SITE_URL", "https://seu-dominio.com")

def create_pin(title, description, link, image_url, board_id=None):
    """
    Cria um Pin na API v5 do Pinterest.
    """
    board_id = board_id or PINTEREST_BOARD_ID
    if board_id == "SEU_BOARD_ID_AQUI" or PINTEREST_ACCESS_TOKEN == "SEU_ACCESS_TOKEN_AQUI":
        print("[ERRO] Configure PINTEREST_ACCESS_TOKEN e PINTEREST_BOARD_ID antes de rodar.")
        return None

    endpoint = "https://api.pinterest.com/v5/pins"
    
    headers = {
        "Authorization": f"Bearer {PINTEREST_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "board_id": board_id,
        "title": title[:100],  # limite do Pinterest
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
            print(f"[SUCESSO] Pin criado com sucesso! ID: {res_data.get('id')}")
            print(f"URL: https://www.pinterest.com/pin/{res_data.get('id')}/")
            return res_data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[ERRO HTTP {e.code}] Falha ao criar Pin: {error_body}")
        return None
    except Exception as e:
        print(f"[ERRO INESPERADO] {str(e)}")
        return None

def publish_all_new_products(products_json_path="products.json"):
    """
    Lê o arquivo products.json e publica os produtos no Pinterest.
    """
    if not os.path.exists(products_json_path):
        print(f"[AVISO] Arquivo {products_json_path} não encontrado.")
        return

    with open(products_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    products = data.get("products", [])
    print(f"Encontrados {len(products)} produtos no catálogo.")

    for p in products:
        title = f"{p['title']} | Achadinho {p['store']}"
        desc = (
            f"Achadinho de R$ {p['originalPrice']:.2f} por apenas R$ {p['currentPrice']:.2f} na {p['store']}! "
            f"Clique para ver o link oficial com cupom e frete grátis no nosso site. {p['description']}"
        )
        # Link para onde o usuário irá ao clicar no Pin (seu site ou link direto de afiliado)
        dest_link = p.get("affiliateUrl") or SITE_URL
        img_url = p["imageUrl"]

        print(f"\nPublicando: {title[:50]}...")
        create_pin(title, desc, dest_link, img_url)

if __name__ == "__main__":
    print("=== AURA MODA - PUBLICADOR PINTEREST API v5 ===")
    print("Para rodar:")
    print("1. Defina as variáveis de ambiente PINTEREST_ACCESS_TOKEN e PINTEREST_BOARD_ID")
    print("2. Execute: python scripts/pinterest_poster.py")
    publish_all_new_products()
