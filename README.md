# Aura Moda & Estilo — Blog Editorial de Moda Feminina 📖✨

Um blog editorial de estilo, guias de combinações e análise de tecidos, focado em **atração de tráfego 100% orgânico no Google (SEO) e Pinterest**, monetizado com links de afiliados oficiais da **Shopee e Mercado Livre** (integrado ao Supabase).

---

## 💎 Por que este formato atrai muito mais público orgânico?

O Google e o Pinterest não ranqueiam catálogos frios de produtos de afiliados. O que realmente ranqueia e gera milhares de acessos diários são **respostas a dúvidas reais das mulheres**:
- *"Qual sapato usar com calça wide leg e pantalona?"*
- *"5 tecidos na Shopee que parecem de loja cara"*
- *"Como montar um guarda-roupa cápsula gastando pouco"*
- *"Vestidos midi para casamento e cultos"*

Dentro de cada guia aprofundado, inserimos as **Caixas Editoriais de Peças Recomendadas**, com a foto real da peça, o porquê de usar e o botão direto para a loja parceira com o seu **link de afiliado oficial (sem preço numérico)**!

---

## 🚀 Funcionalidades do Blog

- **Design Editorial Premium**: Tipografia com serifa clássica (*Playfair Display*) combinada com fonte limpa e moderna (*Plus Jakarta Sans*), paleta em tons nude, off-white, dourado suave e preto.
- **Leitor de Artigos Dinâmico**:
  - Navegação suave e sem recarregamento de página.
  - Links amigáveis com hash (`#slug-do-artigo`) para indexação e compartilhamento direto.
  - Botão oficial para salvar o artigo no **Pinterest** com 1 clique.
- **Caixas de Afiliados Contextuais no Texto**:
  - Cada artigo tem boxes recomendando peças reais (como calça alfaiataria, saia midi, tamanco bico folha, bolsas).
  - Botão de compra sem valor de preço fixo (instiga a visitante a clicar para conferir o preço na loja e ativa o seu cookie de comissão!).
- **Sidebar Conectada ao Supabase**:
  - Puxa automaticamente as peças mais recentes da sua tabela `produtos` do Supabase e as exibe na barra lateral do blog.
- **Automação com Pinterest (API v5)**:
  - Script pronto em `scripts/pinterest_poster.py` para criar Pins dos artigos automaticamente no Pinterest, direcionando milhares de visitantes para o seu blog todos os dias.

---

## 🛍️ Como Adicionar Novos Artigos e Links de Afiliados

Você só precisa me mandar aqui no chat o link da peça que quer divulgar ou o tema do artigo. Eu crio o artigo completo com otimização para SEO e incluo os seus links de afiliado dentro do texto!

Se preferir editar manualmente, basta abrir [artigos.json](artigos.json) e adicionar seu novo post:

```json
{
  "id": "post-5",
  "slug": "novo-guia-de-estilo",
  "title": "Título com Palavra-Chave do Google",
  "category": "Dicas de Estilo",
  "readTime": "5 min de leitura",
  "date": "Outubro 2026",
  "coverImage": "https://url-da-capa.jpg",
  "excerpt": "Resumo atraente do artigo...",
  "content": [
    { "type": "paragraph", "text": "Texto explicativo..." },
    {
      "type": "product_box",
      "title": "Peça Recomendada: Nome da Peça",
      "store": "Shopee",
      "affiliateUrl": "https://seu-link-de-afiliado.com",
      "imageUrl": "https://foto-da-peca.jpg",
      "reason": "Por que esta peça é indispensável no look."
    }
  ]
}
```

---

## 🌐 Como Publicar no Cloudflare Pages com seu Domínio

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com/) e vá em **Workers & Pages**.
2. Clique em **Create application** > **Pages** > **Connect to Git**.
3. Selecione o repositório `kcersarkal/moda-feminina-achadinhos` (ou o nome que definir).
4. Em configurações de build: deixe tudo em branco / `/`.
5. Clique em **Save and Deploy**.
6. Vá na aba **Custom domains** e adicione o seu domínio com 1 clique (com SSL seguro automático).
