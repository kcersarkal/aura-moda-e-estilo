# Aura Moda & Tendências ✨

Site institucional e vitrine de achadinhos de **moda feminina com links de afiliados** (Shopee, Shein, Amazon, Renner e Mercado Livre), focado em atração de tráfego orgânico via **Google (SEO)** e automação com a **API do Pinterest**.

---

## 🌟 Funcionalidades do Projeto

- **Design Elegante & Moderno**: Paleta de cores em tons nude, off-white, dourado suave e preto contemporâneo com tipografia editorial refinada.
- **Vitrine Dinâmica com Filtros**:
  - Busca instantânea em tempo real (por nome, categoria, loja ou tags).
  - Filtro por categoria (Vestidos, Conjuntos, Alfaiataria, Calçados, Bolsas, Casual).
  - Filtro por loja parceira e ordenação (Mais Desejados, Menor Preço, Maior Desconto).
- **SEO & Rich Snippets Prontos**:
  - Meta tags completas (`Open Graph`, `Twitter Cards`, tags específicas de `Pinterest Rich Pins`).
  - Estrutura semântica para indexação orgânica no Google.
- **Pinterest Sharing Integrado**:
  - Botão de salvar no Pinterest em cada produto e em cada look da seção "Monte o Look".
- **Automação com a API do Pinterest (`scripts/pinterest_poster.py`)**:
  - Script pronto em Python para criar e publicar Pins automaticamente em seus painéis temáticos do Pinterest com seu link de afiliado ou link do seu site.
- **Preparado para Cloudflare Pages**:
  - Site estático de altíssima performance (carregamento instantâneo, SSL gratuito e CDN global da Cloudflare).

---

## 🚀 Como Hospedar no Cloudflare Pages com seu Domínio

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/) e vá em **Workers & Pages**.
2. Clique em **Create application** > **Pages** > **Connect to Git**.
3. Selecione o repositório `kcersarkal/moda-feminina-achadinhos` no GitHub.
4. Nas configurações de build:
   - **Framework preset**: `None`
   - **Build command**: *(deixe vazio)*
   - **Build output directory**: *(deixe `/` ou raiz)*
5. Clique em **Save and Deploy**.
6. Após o deploy, vá na aba **Custom domains** do seu projeto Pages e adicione o seu domínio registrado no Cloudflare com 1 clique (o SSL é ativado automaticamente!).

---

## 🛍️ Como Adicionar Novos Achadinhos e Links de Afiliados

Você pode simplesmente me mandar os links no chat e eu adiciono para você, ou você mesmo pode abrir o arquivo `products.json` e adicionar um novo item:

```json
{
  "id": "prod-9",
  "title": "Nome do Vestido ou Peça",
  "category": "Vestidos",
  "store": "Shopee",
  "originalPrice": 129.90,
  "currentPrice": 59.90,
  "discountPercentage": 54,
  "rating": 4.9,
  "reviewsCount": 1200,
  "imageUrl": "https://link-da-imagem.jpg",
  "affiliateUrl": "https://seu-link-de-afiliado-aqui.com",
  "freeShipping": true,
  "description": "Descrição envolvente com palavras-chave de SEO.",
  "features": ["Benefício 1", "Benefício 2", "Benefício 3"],
  "tags": ["vestidos", "shopee", "festa"]
}
```

---

## 📌 Como Usar a Automação do Pinterest (API v5)

1. Crie um arquivo `.env` na raiz (copie o modelo de `.env.example`):
   ```bash
   PINTEREST_ACCESS_TOKEN=seu_access_token
   PINTEREST_BOARD_ID=seu_board_id
   SITE_URL=https://seudominio.com
   ```
2. Execute o script:
   ```bash
   python scripts/pinterest_poster.py
   ```
O script lerá todos os produtos cadastrados e publicará os Pins diretamente no seu perfil do Pinterest com a imagem, título, preço com desconto e o link de afiliado/site!
