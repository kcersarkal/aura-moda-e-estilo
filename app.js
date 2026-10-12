// ===================================================================
// AURA MODA & ESTILO - BLOG EDITORIAL ENGINE & SUPABASE INTEGRATION
// ===================================================================

const SUPABASE_URL = "https://edzagtvukayclklhvokk.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemFndHZ1a2F5Y2xrbGh2b2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNjgzNTQsImV4cCI6MjEwMDY0NDM1NH0.dAfwIDKyLB-KCFCxZkWIIO_fWibhOXa2Ax_RT3KFXjM";

let allArticles = [];
let activeCategory = 'all';
let currentSearch = '';
let currentArticle = null;

// ===================================================================
// INICIALIZAÇÃO
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();

  // 1. Carregar artigos do blog
  await loadArticles();

  // 2. Carregar produtos recomendados do Supabase na Sidebar
  await loadSidebarProductsFromSupabase();

  // 3. Checar rota inicial por hash (ex: #tecidos-elegantes-shopee-parecem-caros)
  checkUrlRoute();
});

// ===================================================================
// CARREGAR ARTIGOS (JSON / FALLBACK)
// ===================================================================
async function loadArticles() {
  try {
    const res = await fetch('artigos.json');
    if (!res.ok) throw new Error('Falha ao ler artigos.json');
    allArticles = await res.json();
  } catch (err) {
    console.warn('Usando artigos integrados:', err);
    allArticles = [];
  }

  renderFeaturedCover();
  renderArticlesGrid();
  renderPopularArticlesList();
  refreshIcons();
}

// ===================================================================
// PRODUTOS REAIS DO SUPABASE PARA A SIDEBAR DO BLOG
// ===================================================================
async function loadSidebarProductsFromSupabase() {
  const container = document.getElementById('sidebarProductsList');
  if (!container) return;

  try {
    const endpoint = `${SUPABASE_URL}/produtos?select=id,name,image,affiliate_url,source,category&order=id.desc&limit=4`;
    const res = await fetch(endpoint, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) throw new Error('Erro ao buscar produtos para sidebar');
    const products = await res.json();

    container.innerHTML = products.map(prod => {
      const storeLabel = prod.source === 'mercadolivre' ? 'Mercado Livre' : 'Shopee';
      const destUrl = prod.affiliate_url && prod.affiliate_url !== '#' ? prod.affiliate_url : 'https://shopee.com.br';

      return `
        <a href="${destUrl}" target="_blank" rel="noopener noreferrer sponsored" class="sidebar-product-item">
          <img src="${prod.image}" alt="${escapeHtml(prod.name)}" class="sidebar-prod-thumb" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop'">
          <div class="sidebar-prod-info">
            <span class="sidebar-prod-title">${escapeHtml(prod.name)}</span>
            <span class="sidebar-prod-link">Conferir na ${storeLabel} <i data-lucide="external-link" style="width:12px; height:12px;"></i></span>
          </div>
        </a>
      `;
    }).join('');

    refreshIcons();
  } catch (e) {
    console.warn('Não foi possível carregar produtos na sidebar:', e);
  }
}

// ===================================================================
// RENDERIZAR ARTIGO DA CAPA (HERO)
// ===================================================================
function renderFeaturedCover() {
  const container = document.getElementById('featuredArticleContainer');
  if (!container || !allArticles.length) return;

  const cover = allArticles[0];

  container.innerHTML = `
    <div class="container">
      <article class="featured-article-card" onclick="openArticle('${cover.slug}')">
        <div class="featured-img-wrap">
          <img src="${cover.coverImage}" alt="${escapeHtml(cover.title)}">
          <span class="featured-badge-cover">Guia da Capa</span>
        </div>
        <div class="featured-content-wrap">
          <div class="meta-info-row">
            <span class="meta-category">${cover.category}</span>
            <span>•</span>
            <span>${cover.readTime}</span>
          </div>
          <h2 class="featured-title">${cover.title}</h2>
          <p class="featured-excerpt">${cover.excerpt}</p>
          <button class="btn btn-primary" onclick="event.stopPropagation(); openArticle('${cover.slug}')">
            Ler Guia Completo <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </article>
    </div>
  `;
}

// ===================================================================
// RENDERIZAR GRID DE ARTIGOS COM FILTROS E BUSCA
// ===================================================================
function renderArticlesGrid() {
  const grid = document.getElementById('articlesGrid');
  const emptyState = document.getElementById('noArticlesFound');
  if (!grid) return;

  // Filtragem (Ignora o artigo da capa se estiver na home padrão sem filtros)
  let filtered = allArticles.filter(art => {
    const matchesCat = (activeCategory === 'all') || (art.category.toLowerCase() === activeCategory.toLowerCase());
    
    const q = currentSearch.toLowerCase().trim();
    const matchesSearch = !q ||
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = filtered.map(art => {
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin + '#' + art.slug)}&media=${encodeURIComponent(art.coverImage)}&description=${encodeURIComponent(art.title)}`;

    return `
      <article class="article-card" onclick="openArticle('${art.slug}')">
        <div class="article-card-cover">
          <img src="${art.coverImage}" alt="${escapeHtml(art.title)}" loading="lazy">
          <a href="${pinUrl}" target="_blank" rel="noopener noreferrer" class="pin-save-quick" onclick="event.stopPropagation();" title="Salvar no Pinterest">
            <i data-lucide="pin"></i>
          </a>
        </div>

        <div class="article-card-body">
          <div class="article-meta">
            <span class="article-cat-tag">${art.category}</span>
            <span>${art.readTime}</span>
          </div>

          <h3 class="article-card-title">${art.title}</h3>
          <p class="article-card-excerpt">${art.excerpt}</p>

          <div class="article-card-footer">
            <span class="read-more-link">Ler artigo completo <i data-lucide="chevron-right"></i></span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  refreshIcons();
}

// ===================================================================
// LISTA DE MAIS LIDOS NA SIDEBAR
// ===================================================================
function renderPopularArticlesList() {
  const container = document.getElementById('popularArticlesList');
  if (!container) return;

  container.innerHTML = allArticles.slice(0, 4).map((art, idx) => `
    <div class="popular-item" onclick="openArticle('${art.slug}')">
      <span class="popular-number">0${idx + 1}</span>
      <span class="popular-item-title">${art.title}</span>
    </div>
  `).join('');
}

// ===================================================================
// ABRIR LEITURA COMPLETA DE ARTIGO
// ===================================================================
function openArticle(slug) {
  const art = allArticles.find(a => a.slug === slug);
  if (!art) return;

  currentArticle = art;
  window.location.hash = slug;

  document.getElementById('blogFeedView').style.display = 'none';
  const detailView = document.getElementById('articleDetailView');
  detailView.style.display = 'block';

  // Preencher Meta e Título
  document.getElementById('artCatBadge').textContent = art.category;
  document.getElementById('artReadTime').innerHTML = `<i data-lucide="clock"></i> ${art.readTime}`;
  document.getElementById('artDate').textContent = art.date;
  document.getElementById('artTitle').textContent = art.title;
  document.getElementById('artExcerpt').textContent = art.excerpt;
  document.getElementById('artCoverImg').src = art.coverImage;
  document.getElementById('artCoverImg').alt = art.title;

  // Botões de Compartilhamento
  const artUrl = window.location.origin + '#' + art.slug;
  const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(artUrl)}&media=${encodeURIComponent(art.coverImage)}&description=${encodeURIComponent(art.title)}`;
  
  const pinBtn = document.getElementById('artSharePinterest');
  if (pinBtn) {
    pinBtn.onclick = () => window.open(pinUrl, '_blank');
  }

  const nativeShare = document.getElementById('artNativeShare');
  if (nativeShare) {
    nativeShare.onclick = () => {
      if (navigator.share) {
        navigator.share({ title: art.title, url: artUrl });
      } else {
        navigator.clipboard.writeText(artUrl);
        alert('Link do artigo copiado para a área de transferência!');
      }
    };
  }

  // Renderizar o Corpo do Artigo com Parágrafos e Boxes de Produtos Afiliados
  const bodyContainer = document.getElementById('artBody');
  bodyContainer.innerHTML = (art.content || []).map(block => {
    if (block.type === 'paragraph') {
      return `<p>${block.text}</p>`;
    }
    if (block.type === 'heading') {
      return `<h2>${block.text}</h2>`;
    }
    if (block.type === 'quote') {
      return `<blockquote class="article-quote">${block.text}</blockquote>`;
    }
    if (block.type === 'product_box') {
      return `
        <div class="product-box-editorial">
          <div class="box-prod-img-wrap">
            <img src="${block.imageUrl}" alt="${escapeHtml(block.title)}" loading="lazy">
          </div>
          <div class="box-prod-details">
            <span class="box-prod-store">Recomendação Oficial • ${block.store}</span>
            <h4 class="box-prod-title">${block.title}</h4>
            <p class="box-prod-reason"><strong>Por que recomendamos:</strong> ${block.reason}</p>
            <a href="${block.affiliateUrl}" target="_blank" rel="noopener noreferrer sponsored" class="box-prod-action">
              <span>Conferir Peça na ${block.store}</span>
              <i data-lucide="external-link"></i>
            </a>
          </div>
        </div>
      `;
    }
    return '';
  }).join('');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  refreshIcons();
}

function showBlogFeed() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
  document.getElementById('articleDetailView').style.display = 'none';
  document.getElementById('blogFeedView').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================================================
// EVENT LISTENERS E NAVEGAÇÃO
// ===================================================================
function setupEventListeners() {
  // Logo volta para a Home
  document.getElementById('homeLogoLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showBlogFeed();
  });

  // Botão Voltar para o Feed
  document.getElementById('btnBackToFeed')?.addEventListener('click', showBlogFeed);

  // Categorias Editoriais
  document.getElementById('editorialCategories')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-item');
    if (!btn) return;
    document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category || 'all';
    showBlogFeed();
    renderArticlesGrid();
  });

  // Busca de Artigos
  const searchInput = document.getElementById('articleSearchInput');
  const clearBtn = document.getElementById('clearArticleSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (clearBtn) clearBtn.style.display = currentSearch ? 'flex' : 'none';
      showBlogFeed();
      renderArticlesGrid();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearBtn.style.display = 'none';
      renderArticlesGrid();
    });
  }

  // Reset de Busca
  document.getElementById('btnResetSearch')?.addEventListener('click', () => {
    activeCategory = 'all';
    currentSearch = '';
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
    document.querySelector('.chip-item[data-category="all"]')?.classList.add('active');
    renderArticlesGrid();
  });

  // Monitorar mudança de hash na URL (botão voltar do navegador)
  window.addEventListener('hashchange', checkUrlRoute);
}

function checkUrlRoute() {
  const hash = window.location.hash.replace('#', '').trim();
  if (!hash || hash === 'artigos' || hash === 'newsletter') {
    document.getElementById('articleDetailView').style.display = 'none';
    document.getElementById('blogFeedView').style.display = 'block';
  } else {
    const found = allArticles.find(a => a.slug === hash);
    if (found) {
      openArticle(found.slug);
    }
  }
}

// Helpers globais para o footer
window.filterByCategory = function(cat) {
  activeCategory = cat;
  document.querySelectorAll('.chip-item').forEach(c => {
    c.classList.toggle('active', c.dataset.category === cat);
  });
  showBlogFeed();
  renderArticlesGrid();
};

window.searchTopic = function(topic) {
  const input = document.getElementById('articleSearchInput');
  if (input) input.value = topic;
  currentSearch = topic;
  showBlogFeed();
  renderArticlesGrid();
};

window.showBlogFeed = showBlogFeed;

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
