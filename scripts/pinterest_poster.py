"""
Aura Moda & Estilo - Publicador Automático de Artigos no Pinterest (API v5)
Foco em Tráfego Orgânico para o Blog Editorial
"""

import os
import json
import urllib.request
import urllib.error

# Configurações do Pinterest
PINTEREST_ACCESS_TOKEN = os.getenv("PINTEREST_ACCESS_TOKEN", "SEU_ACCESS_TOKEN_AQUI")
PINTEREST_BOARD_ID = os.getenv("PINTEREST_BOARD_ID", "SEU_BOARD_ID_AQUI")
SITE_URL = os.getenv("SITE_URL", "https://auramoda.prime.blog.br")

def create_pin(title, description, link, image_url, board_id=None):
    """
    Cria um Pin na API v5 do Pinterest apontando para um artigo do blog.
    """
    board_id = board_id or PINTEREST_BOARD_ID
    if board_id == "SEU_BOARD_ID_AQUI" or PINTEREST_ACCESS_TOKEN == "SEU_ACCESS_TOKEN_AQUI":
        print("[ERRO] Defina PINTEREST_ACCESS_TOKEN e PINTEREST_BOARD_ID antes de rodar.")
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
            print(f"[SUCESSO] Pin do artigo criado! ID: {res_data.get('id')}")
            return res_data
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[ERRO HTTP {e.code}] Falha ao criar Pin: {error_body}")
        return None
    except Exception as e:
        print(f"[ERRO] {str(e)}")
        return None

def publish_articles_to_pinterest(artigos_path="artigos.json"):
    """
    Publica os artigos do blog como Pins no Pinterest para atrair tráfego orgânico.
    """
    if not os.path.exists(artigos_path):
        print(f"[ERRO] Arquivo {artigos_path} não encontrado.")
        return

    with open(artigos_path, "r", encoding="utf-8") as f:
        artigos = json.load(f)

    print(f"Encontrados {len(artigos)} artigos editoriais no blog.")

    for art in artigos:
        title = f"{art['title'][:75]} | Dicas de Estilo"
        desc = (
            f"{art['excerpt']} Confira o guia completo de combinações e peças recomendadas no nosso blog! "
            f"Salve para não perder."
        )
        article_link = f"{SITE_URL}#{art['slug']}"
        cover_image = art["coverImage"]

        print(f"\nPublicando Pin do artigo: {art['title'][:50]}...")
        create_pin(title, desc, article_link, cover_image)

if __name__ == "__main__":
    print("=== AURA MODA - PUBLICADOR DE ARTIGOS DO BLOG NO PINTEREST ===")
    publish_articles_to_pinterest()
