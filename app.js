// ===================================================================
// AURA MODA & TENDÊNCIAS - CORE APP JAVASCRIPT
// ===================================================================

let allProducts = [];
let allLooks = [];
let activeCategory = 'all';
let activeStore = 'all';
let currentSearch = '';
let currentSort = 'popular';
let wishlist = JSON.parse(localStorage.getItem('aura_wishlist') || '[]');

// Fallback de dados para garantir funcionamento até mesmo em visualização local direta
const FALLBACK_DATA = {
  products: [
    {
      id: "prod-1",
      title: "Vestido Midi Canelado Gola Alta Fenda Lateral Elegance",
      category: "Vestidos",
      store: "Shein",
      originalPrice: 129.90,
      currentPrice: 59.90,
      discountPercentage: 54,
      rating: 4.9,
      reviewsCount: 2480,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/vestido-midi",
      freeShipping: true,
      description: "Vestido midi com modelagem impecável que valoriza a silhueta sem marcar. Tecido canelado premium de alta elasticidade com acabamento em gola alta suave e fenda lateral moderna.",
      features: ["Tecido canelado encorpado", "Não fica transparente", "Comprimento midi clássico", "Ideal para salto ou tênis"],
      tags: ["vestidos", "midi", "elegante", "shein", "festa"]
    },
    {
      id: "prod-2",
      title: "Conjunto Alfaiataria Colete e Calça Wide Leg Linho Bege",
      category: "Conjuntos",
      store: "Shopee",
      originalPrice: 189.90,
      currentPrice: 89.90,
      discountPercentage: 52,
      rating: 4.8,
      reviewsCount: 1340,
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/conjunto-alfaiataria",
      freeShipping: true,
      description: "O conjunto queridinho do Pinterest. Colete cropped estruturado com botões forrados acompanhado de calça pantalona wide leg de cós alto e caimento impecável.",
      features: ["Toque de linho com elastano", "Cintura alta com passantes", "Botões decorativos refinados", "Caimento alfaiataria"],
      tags: ["conjuntos", "alfaiataria", "shopee", "trabalho", "linho"]
    },
    {
      id: "prod-3",
      title: "Calça Pantalona Alfaiataria Cinto Encapado Nude",
      category: "Alfaiataria",
      store: "Shopee",
      originalPrice: 119.90,
      currentPrice: 54.90,
      discountPercentage: 54,
      rating: 4.9,
      reviewsCount: 5120,
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/calca-pantalona",
      freeShipping: true,
      description: "Peça coringa para looks elegantes de trabalho ou eventos casuais. Acompanha cinto encapado no mesmo tom e possui corte reto que alonga as pernas.",
      features: ["Tecido Crepe Two Way encorpado", "Acompanha cinto", "Bolsos laterais faca funcionais", "Não amassa fácil"],
      tags: ["alfaiataria", "calca", "pantalona", "trabalho", "shopee"]
    },
    {
      id: "prod-4",
      title: "Bolsa Feminina Baguette Alça Corrente Dourada Off-White",
      category: "Bolsas",
      store: "Shein",
      originalPrice: 89.90,
      currentPrice: 42.90,
      discountPercentage: 52,
      rating: 4.7,
      reviewsCount: 890,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/bolsa-baguette",
      freeShipping: false,
      description: "Bolsa minimalista formato baguette com alça trançada e detalhe em corrente metálica banhada a dourado. Espaçosa e muito sofisticada.",
      features: ["Couro ecológico texturizado", "Fechamento em zíper resistente", "Alça regulável removível", "Ferragens douradas"],
      tags: ["bolsas", "acessorios", "shein", "baguette"]
    },
    {
      id: "prod-5",
      title: "Sandália Salto Bloco Tiras Finas Amarrar Nude Chic",
      category: "Calçados",
      store: "Amazon",
      originalPrice: 159.90,
      currentPrice: 79.90,
      discountPercentage: 50,
      rating: 4.8,
      reviewsCount: 970,
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/sandalia-salto-bloco",
      freeShipping: true,
      description: "Conforto e estabilidade absoluta. Salto bloco de 6cm com palmilha acolchoada e tiras delicadas de amarração no tornozelo.",
      features: ["Salto bloco estável 6cm", "Palmilha ultra conforto", "Solado antiderrapante", "Tiras macias que não machucam"],
      tags: ["calcados", "sandalias", "amazon", "festa", "salto"]
    },
    {
      id: "prod-6",
      title: "Camisa Feminina Oversized 100% Algodão Branco Clássico",
      category: "Casual",
      store: "Renner",
      originalPrice: 149.90,
      currentPrice: 69.90,
      discountPercentage: 53,
      rating: 4.9,
      reviewsCount: 310,
      imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/camisa-oversized",
      freeShipping: true,
      description: "A camisa branca indispensável em qualquer guarda-roupa cápsula. Modelagem ampla oversized moderna para usar aberta ou fechada.",
      features: ["Toque puro algodão macio", "Botões madrepérola", "Caimento soltinho e elegante", "Alta durabilidade"],
      tags: ["casual", "camisa", "renner", "basico", "elegante"]
    },
    {
      id: "prod-7",
      title: "Vestido Longo Floral Decote V Babados Boho Romântico",
      category: "Vestidos",
      store: "Shein",
      originalPrice: 169.90,
      currentPrice: 78.90,
      discountPercentage: 54,
      rating: 4.8,
      reviewsCount: 1820,
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/vestido-longo-floral",
      freeShipping: true,
      description: "Vestido fluído longo com estampa floral sutil, saia três marias com babados delicados e ajuste com amarração na cintura.",
      features: ["Tecido chiffon leve com forro", "Cintura com elastex", "Caimento fluido e leve", "Ideal para passeios e ensaios"],
      tags: ["vestidos", "longo", "floral", "shein", "romantico"]
    },
    {
      id: "prod-8",
      title: "Blazer Feminino Alfaiataria Estruturado Alongado Preto",
      category: "Alfaiataria",
      store: "Shopee",
      originalPrice: 199.90,
      currentPrice: 94.90,
      discountPercentage: 52,
      rating: 4.9,
      reviewsCount: 3410,
      imageUrl: "https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=800&auto=format&fit=crop",
      affiliateUrl: "https://seu-link-de-afiliado.com/blazer-alfaiataria",
      freeShipping: true,
      description: "Blazer modelo maxi com ombreiras suaves que alinham a postura e modelagem acinturada. Bolsos decorativos e tecido com caimento impecável.",
      features: ["Forro interno acetinado", "Ombreiras estruturadas leves", "Corte alongado moderno", "Combina do jeans ao vestido"],
      tags: ["alfaiataria", "blazer", "shopee", "trabalho", "preto"]
    }
  ],
  looks: [
    {
      id: "look-1",
      title: "Look Brunch Elegante em Tons Terrosos",
      occasion: "Final de Semana & Brunch",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      description: "Combinação sofisticada e leve para um almoço com amigas ou passeio ao ar livre com cores quentes e tecidos naturais.",
      pieces: [
        { name: "Conjunto Alfaiataria Nude", store: "Shopee", price: "R$ 89,90", link: "#produtos" },
        { name: "Bolsa Baguette Off-White", store: "Shein", price: "R$ 42,90", link: "#produtos" },
        { name: "Sandália Salto Bloco", store: "Amazon", price: "R$ 79,90", link: "#produtos" }
      ]
    },
    {
      id: "look-2",
      title: "Office Look Minimalista & Confortável",
      occasion: "Trabalho & Reuniões",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      description: "Equilíbrio perfeito entre seriedade e estilo contemporâneo, sem abrir mão do conforto durante o dia inteiro.",
      pieces: [
        { name: "Calça Pantalona Cinto Nude", store: "Shopee", price: "R$ 54,90", link: "#produtos" },
        { name: "Camisa Oversized Algodão", store: "Renner", price: "R$ 69,90", link: "#produtos" },
        { name: "Blazer Preto Estruturado", store: "Shopee", price: "R$ 94,90", link: "#produtos" }
      ]
    }
  ]
};

// ===================================================================
// INICIALIZAÇÃO
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  updateWishlistBadge();
  setupEventListeners();

  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('Falha ao carregar JSON local');
    const data = await res.json();
    allProducts = data.products || [];
    allLooks = data.looks || [];
  } catch (err) {
    console.warn('Carregando dados de fallback integrados:', err);
    allProducts = FALLBACK_DATA.products;
    allLooks = FALLBACK_DATA.looks;
  }

  renderProducts();
  renderLooks();
  refreshIcons();
});

// ===================================================================
// RENDERIZAÇÃO DE PRODUTOS
// ===================================================================
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  // Filtragem
  let filtered = allProducts.filter(item => {
    // Filtro por Categoria
    const matchesCategory = (activeCategory === 'all') || (item.category.toLowerCase() === activeCategory.toLowerCase());
    
    // Filtro por Loja
    const matchesStore = (activeStore === 'all') || (item.store.toLowerCase() === activeStore.toLowerCase());
    
    // Filtro por Busca
    const q = currentSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.store.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q)));

    return matchesCategory && matchesStore && matchesSearch;
  });

  // Ordenação
  filtered.sort((a, b) => {
    if (currentSort === 'lowest') return a.currentPrice - b.currentPrice;
    if (currentSort === 'highest') return b.currentPrice - a.currentPrice;
    if (currentSort === 'discount') return b.discountPercentage - a.discountPercentage;
    return b.rating - a.rating; // default: popular
  });

  // Estado Vazio
  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Render dos Cards
  grid.innerHTML = filtered.map(prod => {
    const isSaved = wishlist.includes(prod.id);
    const pinterestShareUrl = getPinterestShareUrl(prod);

    return `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-card-media">
          <img src="${prod.imageUrl}" alt="${prod.title}" loading="lazy">
          
          <div class="product-badges">
            <span class="store-badge ${prod.store}">${prod.store}</span>
            <span class="discount-tag">-${prod.discountPercentage}% OFF</span>
          </div>

          <div class="product-actions-floating">
            <button class="btn-float-action ${isSaved ? 'saved' : ''}" 
                    onclick="toggleWishlist('${prod.id}')" 
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
            <span class="product-category-name">${prod.category}</span>
            <div class="product-rating">
              <i data-lucide="star"></i>
              <span>${prod.rating}</span>
            </div>
          </div>

          <h3 class="product-title" onclick="openProductModal('${prod.id}')">${prod.title}</h3>

          <div class="product-price-box">
            <span class="product-price-original">R$ ${prod.originalPrice.toFixed(2).replace('.', ',')}</span>
            <span class="product-price-current">R$ ${prod.currentPrice.toFixed(2).replace('.', ',')}</span>
            ${prod.freeShipping ? '<span class="product-shipping-tag">Frete Grátis</span>' : ''}
          </div>

          <div class="product-card-footer">
            <a href="${prod.affiliateUrl}" 
               target="_blank" 
               rel="noopener noreferrer sponsored" 
               class="btn-buy-affiliate">
              <span>Ver Oferta na ${prod.store}</span>
              <i data-lucide="external-link"></i>
            </a>
            <button class="btn-quick-view" onclick="openProductModal('${prod.id}')" title="Ver Detalhes">
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
// RENDERIZAÇÃO DE LOOKS (PINTEREST STYLE)
// ===================================================================
function renderLooks() {
  const container = document.getElementById('looksGrid');
  if (!container || !allLooks.length) return;

  container.innerHTML = allLooks.map(look => {
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(look.imageUrl)}&description=${encodeURIComponent(look.title + ' - Achadinhos Femininos')}`;

    return `
      <div class="look-card">
        <div class="look-card-img-wrap">
          <img src="${look.imageUrl}" alt="${look.title}" loading="lazy">
          <span class="look-badge">${look.occasion}</span>
          <a href="${pinUrl}" target="_blank" rel="noopener noreferrer" class="look-pinterest-btn" title="Salvar no Pinterest">
            <i data-lucide="pin"></i> <span>Salvar Pin</span>
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
                  ${piece.price} na ${piece.store} <i data-lucide="chevron-right"></i>
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
function getPinterestShareUrl(product) {
  const currentUrl = window.location.href;
  const description = `${product.title} por apenas R$ ${product.currentPrice.toFixed(2).replace('.', ',')} na ${product.store}! Achadinho imperdível.`;
  return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(product.imageUrl)}&description=${encodeURIComponent(description)}`;
}

// ===================================================================
// MODAL DE DETALHES
// ===================================================================
function openProductModal(productId) {
  const prod = allProducts.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('productModal');
  const body = document.getElementById('modalBody');
  const pinterestUrl = getPinterestShareUrl(prod);

  body.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image-col">
        <img src="${prod.imageUrl}" alt="${prod.title}">
      </div>

      <div class="modal-info-col">
        <span class="modal-store-tag store-badge ${prod.store}">${prod.store} • ${prod.category}</span>
        <h2 class="modal-product-title">${prod.title}</h2>

        <div class="modal-price-box">
          <span class="old-price">R$ ${prod.originalPrice.toFixed(2).replace('.', ',')}</span>
          <span class="new-price" style="color: var(--color-primary); font-size: 1.75rem;">R$ ${prod.currentPrice.toFixed(2).replace('.', ',')}</span>
          <span class="discount-badge">-${prod.discountPercentage}% OFF</span>
        </div>

        <p class="modal-desc">${prod.description}</p>

        <div class="modal-features">
          ${(prod.features || []).map(f => `
            <div class="modal-feature-item">
              <i data-lucide="check-circle-2"></i>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-actions-box">
          <a href="${prod.affiliateUrl}" 
             target="_blank" 
             rel="noopener noreferrer sponsored" 
             class="btn btn-primary" 
             style="width: 100%; justify-content: center; font-size: 1rem; padding: 1rem;">
            Ir para a Loja Oficial (${prod.store}) <i data-lucide="external-link"></i>
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
// EVENT LISTENERS & INTERAÇÕES
// ===================================================================
function setupEventListeners() {
  // Chips de Categoria
  const chipContainer = document.getElementById('categoryChips');
  if (chipContainer) {
    chipContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-item');
      if (!btn) return;
      document.querySelectorAll('.chip-item').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      renderProducts();
    });
  }

  // Busca em Tempo Real
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (clearSearch) clearSearch.style.display = currentSearch ? 'flex' : 'none';
      renderProducts();
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearSearch.style.display = 'none';
      renderProducts();
    });
  }

  // Filtro de Loja
  const storeFilter = document.getElementById('storeFilter');
  if (storeFilter) {
    storeFilter.addEventListener('change', (e) => {
      activeStore = e.target.value;
      renderProducts();
    });
  }

  // Filtro de Ordenação
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Botão Limpar Filtros do Estado Vazio
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
      renderProducts();
    });
  }

  // Modal Close
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
// FAVORITOS (LOCALSTORAGE)
// ===================================================================
function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderProducts();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = wishlist.length;
}

// ===================================================================
// LUCIDE ICONS REFRESH
// ===================================================================
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
