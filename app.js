// ===================================================================
// AURA MODA & TENDÊNCIAS - CORE APP (SUPABASE INTEGRATION)
// ===================================================================

const SUPABASE_URL = "https://edzagtvukayclklhvokk.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemFndHZ1a2F5Y2xrbGh2b2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNjgzNTQsImV4cCI6MjEwMDY0NDM1NH0.dAfwIDKyLB-KCFCxZkWIIO_fWibhOXa2Ax_RT3KFXjM";

const PAGE_SIZE = 36;
let currentOffset = 0;
let hasMoreItems = true;
let isLoading = false;

let allProducts = [];
let activeCategory = 'all';
let activeStore = 'all';
let currentSearch = '';
let currentSort = 'recent';
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist') || '[]');

// Inspirações de Looks curadas
const CURATED_LOOKS = [
  {
    id: "look-1",
    title: "Look Elegante de Trabalho com Pantalona & Alfaiataria",
    occasion: "Trabalho & Reuniões",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    description: "Composição refinada para o dia a dia profissional com tecidos leves e corte estruturado.",
    pieces: [
      { name: "Calça Alfaiataria Cós Alto", store: "Shopee", link: "#produtos" },
      { name: "Colete Estruturado Nude", store: "Shopee", link: "#produtos" },
      { name: "Scarpin Bico Fino", store: "Mercado Livre", link: "#produtos" }
    ]
  },
  {
    id: "look-2",
    title: "Composição Casual Chic com Vestido & Sandália",
    occasion: "Final de Semana & Passeio",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    description: "Equilíbrio entre charme feminino e frescor para passeios, encontros e viagens.",
    pieces: [
      { name: "Vestido Midi Plissado", store: "Shopee", link: "#produtos" },
      { name: "Bolsa Meia Lua Transversal", store: "Shopee", link: "#produtos" },
      { name: "Tamanco Bico Folha Dourado", store: "Shopee", link: "#produtos" }
    ]
  }
];

// ===================================================================
// INICIALIZAÇÃO
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  updateWishlistBadge();
  setupEventListeners();
  renderLooks();
  
  await fetchProductsFromSupabase(true);
});

// ===================================================================
// BUSCA DE PRODUTOS NO SUPABASE REST API
// ===================================================================
async function fetchProductsFromSupabase(isReset = false) {
  if (isLoading) return;
  isLoading = true;

  const loadingEl = document.getElementById('loadingState');
  const loadMoreBtn = document.getElementById('btnLoadMore');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  
  if (isReset) {
    currentOffset = 0;
    allProducts = [];
    if (loadingEl) loadingEl.style.display = 'flex';
  } else {
    if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = `<span class="spinner-sm"></span> Carregando...`;
    }
  }

  try {
    // Parâmetros da Query
    const params = new URLSearchParams();
    params.set('select', 'id,name,category,image,description,rating,reviews_count,affiliate_url,source,tag,spotlight');
    params.set('limit', PAGE_SIZE);
    params.set('offset', currentOffset);

    // Filtros no Banco
    if (activeCategory !== 'all') {
      params.set('category', `ilike.%${activeCategory}%`);
    }

    if (activeStore !== 'all') {
      params.set('source', `eq.${activeStore.toLowerCase()}`);
    }

    if (currentSearch.trim()) {
      params.set('name', `ilike.%${currentSearch.trim()}%`);
    }

    // Ordenação
    if (currentSort === 'rating') {
      params.set('order', 'rating.desc,id.desc');
    } else {
      params.set('order', 'id.desc');
    }

    const response = await fetch(`${SUPABASE_URL}/produtos?${params.toString()}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro Supabase: ${response.statusText}`);
    }

    const items = await response.json();

    if (isReset) {
      allProducts = items;
    } else {
      allProducts = [...allProducts, ...items];
    }

    hasMoreItems = items.length === PAGE_SIZE;
    currentOffset += items.length;

    renderProductsGrid();

    if (loadMoreContainer) {
      loadMoreContainer.style.display = hasMoreItems ? 'flex' : 'none';
    }

  } catch (error) {
    console.error('Erro ao conectar ao Supabase:', error);
    // Fallback: se houver falha de rede ou CORS, renderiza produtos locais
    if (allProducts.length === 0) {
      renderFallbackNotice();
    }
  } finally {
    isLoading = false;
    if (loadingEl) loadingEl.style.display = 'none';
    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = `<i data-lucide="refresh-cw"></i> Carregar Mais Achadinhos`;
      refreshIcons();
    }
  }
}

// ===================================================================
// RENDERIZAÇÃO DO GRID DE PRODUTOS (SEM PREÇO NUMÉRICO)
// ===================================================================
function renderProductsGrid() {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  if (allProducts.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = allProducts.map(prod => {
    const isSaved = wishlist.includes(prod.id);
    const storeLabel = (prod.source === 'mercadolivre') ? 'Mercado Livre' : 'Shopee';
    const storeClass = (prod.source === 'mercadolivre') ? 'MercadoLivre' : 'Shopee';
    const ratingValue = prod.rating ? Number(prod.rating).toFixed(1) : '4.9';
    const destinationUrl = prod.affiliate_url && prod.affiliate_url !== '#' ? prod.affiliate_url : 'https://shopee.com.br';
    const pinterestShareUrl = getPinterestShareUrl(prod, storeLabel, destinationUrl);

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-card-media">
          <img src="${prod.image}" alt="${escapeHtml(prod.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop'">
          
          <div class="product-badges">
            <span class="store-badge ${storeClass}">${storeLabel}</span>
            <span class="discount-tag">Cupom & Oferta</span>
          </div>

          <div class="product-actions-floating">
            <button class="btn-float-action ${isSaved ? 'saved' : ''}" 
                    onclick="toggleWishlist(${prod.id})" 
                    title="${isSaved ? 'Remover dos favoritos' : 'Salvar favorito'}">
              <i data-lucide="heart"></i>
            </button>
            <a href="${pinterestShareUrl}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-float-action pinterest-pin" 
               title="Salvar no Pinterest">
              <i data-lucide="pin"></i>
            </a>
          </div>
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-category-name">${prod.category || 'Moda Feminina'}</span>
            <div class="product-rating">
              <i data-lucide="star"></i>
              <span>${ratingValue}</span>
            </div>
          </div>

          <h3 class="product-title" onclick="openProductModal(${prod.id})">${escapeHtml(prod.name)}</h3>

          <!-- Área Sem Preço Fixo: Foco no Benefício e no Clique -->
          <div class="product-benefit-box">
            <div class="benefit-item">
              <i data-lucide="sparkles"></i>
              <span>Preço Oficial com Desconto</span>
            </div>
            <span class="product-shipping-tag">Frete Grátis</span>
          </div>

          <div class="product-card-footer">
            <a href="${destinationUrl}" 
               target="_blank" 
               rel="noopener noreferrer sponsored" 
               class="btn-buy-affiliate">
              <span>Conferir Oferta na Loja</span>
              <i data-lucide="external-link"></i>
            </a>
            <button class="btn-quick-view" onclick="openProductModal(${prod.id})" title="Ver Detalhes">
              <i data-lucide="eye"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  refreshIcons();
}

// ===================================================================
// LOOKS INSPIRATIONS
// ===================================================================
function renderLooks() {
  const container = document.getElementById('looksGrid');
  if (!container) return;

  container.innerHTML = CURATED_LOOKS.map(look => {
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(look.imageUrl)}&description=${encodeURIComponent(look.title + ' - Achadinhos Femininos')}`;

    return `
      <div class="look-card">
        <div class="look-card-img-wrap">
          <img src="${look.imageUrl}" alt="${look.title}" loading="lazy">
          <span class="look-badge">${look.occasion}</span>
          <a href="${pinUrl}" target="_blank" rel="noopener noreferrer" class="look-pinterest-btn" title="Salvar no Pinterest">
            <i data-lucide="pin"></i> <span>Salvar no Pinterest</span>
          </a>
        </div>
        <div class="look-content">
          <h3 class="look-title">${look.title}</h3>
          <p class="look-desc">${look.description}</p>
          <div class="look-pieces-list">
            ${look.pieces.map(piece => `
              <div class="look-piece-item">
                <span>${piece.name}</span>
                <a href="${piece.link}" class="look-piece-link">
                  Ver na ${piece.store} <i data-lucide="chevron-right"></i>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

// ===================================================================
// URL DE COMPARTILHAMENTO PINTEREST
// ===================================================================
function getPinterestShareUrl(product, storeLabel, destinationUrl) {
  const description = `${product.name} | Achadinho da ${storeLabel}! Confira detalhes, fotos reais e cupom de frete grátis no site.`;
  return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(destinationUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(description)}`;
}

// ===================================================================
// MODAL DE DETALHES (SEM PREÇO NUMÉRICO)
// ===================================================================
function openProductModal(productId) {
  const prod = allProducts.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('productModal');
  const body = document.getElementById('modalBody');
  const storeLabel = (prod.source === 'mercadolivre') ? 'Mercado Livre' : 'Shopee';
  const storeClass = (prod.source === 'mercadolivre') ? 'MercadoLivre' : 'Shopee';
  const destinationUrl = prod.affiliate_url && prod.affiliate_url !== '#' ? prod.affiliate_url : 'https://shopee.com.br';
  const pinterestUrl = getPinterestShareUrl(prod, storeLabel, destinationUrl);

  body.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image-col">
        <img src="${prod.image}" alt="${escapeHtml(prod.name)}">
      </div>

      <div class="modal-info-col">
        <span class="modal-store-tag store-badge ${storeClass}">${storeLabel} • ${prod.category || 'Moda Feminina'}</span>
        <h2 class="modal-product-title">${escapeHtml(prod.name)}</h2>

        <div class="modal-notice-box">
          <div class="notice-badge"><i data-lucide="tag"></i> Cupom e Frete Grátis Disponíveis</div>
          <p class="notice-sub">Os valores e cupons são atualizados em tempo real diretamente na loja parceira.</p>
        </div>

        <p class="modal-desc">${escapeHtml(prod.description || 'Peça queridinha com altíssima avaliação das compradoras, caimento impecável e excelente custo-benefício.')}</p>

        <div class="modal-features">
          <div class="modal-feature-item">
            <i data-lucide="check-circle-2"></i>
            <span>Loja Verificada na ${storeLabel}</span>
          </div>
          <div class="modal-feature-item">
            <i data-lucide="check-circle-2"></i>
            <span>Avaliação Média: ${prod.rating || '4.9'} ★ de clientes satisfeitas</span>
          </div>
          <div class="modal-feature-item">
            <i data-lucide="check-circle-2"></i>
            <span>Garantia de Compra Segura e Entrega Rápida</span>
          </div>
        </div>

        <div class="modal-actions-box">
          <a href="${destinationUrl}" 
             target="_blank" 
             rel="noopener noreferrer sponsored" 
             class="btn btn-primary" 
             style="width: 100%; justify-content: center; font-size: 1rem; padding: 1rem;">
            Conferir Preço Oficial na ${storeLabel} <i data-lucide="external-link"></i>
          </a>
          <a href="${pinterestUrl}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="modal-pinterest-btn">
            <i data-lucide="pin"></i> Salvar este Achadinho no Pinterest
          </a>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  refreshIcons();
}

function closeModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ===================================================================
// EVENT LISTENERS & FILTROS
// ===================================================================
let searchDebounceTimeout = null;

function setupEventListeners() {
  // Filtro por Categoria (Chips)
  const chipContainer = document.getElementById('categoryChips');
  if (chipContainer) {
    chipContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-item');
      if (!btn) return;
      document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      fetchProductsFromSupabase(true);
    });
  }

  // Busca em Tempo Real com Debounce
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (clearSearch) clearSearch.style.display = currentSearch ? 'flex' : 'none';
      
      clearTimeout(searchDebounceTimeout);
      searchDebounceTimeout = setTimeout(() => {
        fetchProductsFromSupabase(true);
      }, 350);
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearSearch.style.display = 'none';
      fetchProductsFromSupabase(true);
    });
  }

  // Filtro por Loja (Shopee, Mercado Livre)
  const storeFilter = document.getElementById('storeFilter');
  if (storeFilter) {
    storeFilter.addEventListener('change', (e) => {
      activeStore = e.target.value;
      fetchProductsFromSupabase(true);
    });
  }

  // Ordenação
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentSort = e.target.value;
      fetchProductsFromSupabase(true);
    });
  }

  // Botão Carregar Mais
  const loadMoreBtn = document.getElementById('btnLoadMore');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      fetchProductsFromSupabase(false);
    });
  }

  // Reset de Filtros
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activeStore = 'all';
      currentSearch = '';
      if (searchInput) searchInput.value = '';
      if (clearSearch) clearSearch.style.display = 'none';
      if (storeFilter) storeFilter.value = 'all';
      document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
      document.querySelector('.chip-item[data-category="all"]')?.classList.add('active');
      fetchProductsFromSupabase(true);
    });
  }

  // Fechar Modal
  const closeBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('productModal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===================================================================
// FAVORITOS
// ===================================================================
function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderProductsGrid();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = wishlist.length;
}

// ===================================================================
// UTILITÁRIOS
// ===================================================================
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
