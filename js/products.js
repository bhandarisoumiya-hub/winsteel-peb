/**
 * WINSTEEL ENGINEERING WORKS - PRODUCTS SCRIPT
 * Handles Products Catalog & Product Detail View
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isDetailPage = document.getElementById('product-detail-container');
  const isCatalogPage = document.getElementById('products-grid-container');

  if (isCatalogPage) {
    await initProductsCatalog();
  } else if (isDetailPage) {
    await initProductDetail();
  }
});

// 1. Products Catalog Page
async function initProductsCatalog() {
  const container = document.getElementById('products-grid-container');
  const filterWrapper = document.getElementById('product-filters-wrapper');
  const searchInput = document.getElementById('product-search-input');
  const countBadge = document.getElementById('product-count-display');

  if (!container) return;

  const allProducts = await WinsteelData.getProducts();
  const catData = await WinsteelData.getCategories();
  const categories = catData.products || ['All'];

  // Check URL param ?category=...
  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'All';

  // Setup category filter tabs
  if (filterWrapper && typeof WinsteelFilters !== 'undefined') {
    WinsteelFilters.setupFilterBar({
      filterBarContainerSelector: '#product-filters-wrapper',
      categories: categories,
      activeCategory: activeCategory,
      onFilterChange: (cat) => {
        activeCategory = cat;
        renderFilteredProducts();
      }
    });
  }

  // Live search handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderFilteredProducts();
    });
  }

  function renderFilteredProducts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allProducts.filter(p => {
      const matchCat = (activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase());
      const matchQuery = !query || 
        p.title.toLowerCase().includes(query) || 
        p.shortDescription.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchCat && matchQuery && p.status !== 'Inactive';
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Equipment Systems`;
    }

    if (!filtered.length) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background:#F8FAFC; border-radius:8px;">
          <h3 style="color:#004B87; margin-bottom:12px;">No products found</h3>
          <p style="color:#64748B;">Try choosing another category or clearing your search filter.</p>
          <button class="btn btn-primary btn-sm" onclick="resetProductFilters()">View All Products</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(renderProductCardHtml).join('');
  }

  window.resetProductFilters = function() {
    if (searchInput) searchInput.value = '';
    activeCategory = 'All';
    const bar = document.querySelector('#product-filters-wrapper .filter-bar');
    if (bar) {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      bar.querySelector('[data-category="All"]')?.classList.add('active');
    }
    renderFilteredProducts();
  };

  renderFilteredProducts();
}

function renderProductCardHtml(p) {
  const specs = p.specifications ? Object.entries(p.specifications).slice(0, 2) : [];
  return `
    <article class="product-card reveal is-visible">
      <div class="product-img-box">
        <img src="${p.image}" alt="${p.title}" class="product-img" loading="lazy">
        <span class="product-category-tag">${p.category}</span>
      </div>
      <div class="product-body">
        <h3 class="product-title">
          <a href="product-details.html?id=${p.id}">${p.title}</a>
        </h3>
        <p class="product-desc">${p.shortDescription}</p>
        
        ${specs.length ? `
          <div class="product-specs-list">
            ${specs.map(([k, v]) => `
              <div class="product-spec-row">
                <span class="spec-label">${k}</span>
                <span class="spec-val">${v}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="product-footer">
          <a href="product-details.html?id=${p.id}" class="product-link">
            <span>Engineering Specs</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="contact.html?enquiry=${encodeURIComponent(p.title)}" class="btn btn-outline-blue btn-sm" style="padding:4px 12px; font-size:0.775rem;">Quote</a>
        </div>
      </div>
    </article>
  `;
}

// 2. Product Detail Page
async function initProductDetail() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id') || 'prod-1';

  const product = await WinsteelData.getProductById(prodId);

  if (!product) {
    container.innerHTML = `
      <div style="text-align: center; padding: 100px 20px;">
        <h2>Product Not Found</h2>
        <p style="color:#64748B; margin: 16px 0 24px;">The engineering product requested could not be located in our catalog.</p>
        <a href="products.html" class="btn btn-primary">Return to Catalog</a>
      </div>
    `;
    return;
  }

  // Update Page Title and Breadcrumb
  document.title = `${product.title} | Winsteel Engineering Works`;
  const breadcrumbCurrent = document.getElementById('breadcrumb-product-title');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.title;

  const galleryImages = (product.gallery && product.gallery.length) ? product.gallery : [product.image];
  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const features = product.features || [];

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 48px; margin-bottom: 64px;" class="product-detail-main">
      <!-- Media Gallery -->
      <div>
        <div style="height: 440px; border-radius: 8px; overflow: hidden; background: #071522; margin-bottom: 16px; border: 1px solid #E2E8F0; position: relative;">
          <img id="main-product-img" src="${galleryImages[0]}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="product-category-tag" style="top: 20px; left: 20px; font-size: 0.85rem;">${product.category}</span>
        </div>
        ${galleryImages.length > 1 ? `
          <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px;" id="product-thumbnails">
            ${galleryImages.map((img, idx) => `
              <img src="${img}" alt="Thumbnail ${idx + 1}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" style="width: 90px; height: 70px; object-fit: cover; border-radius: 4px; cursor: pointer; border: 2px solid ${idx === 0 ? '#0067B1' : 'transparent'}; opacity: ${idx === 0 ? '1' : '0.7'};" data-full-img="${img}">
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Overview & Action CTA -->
      <div>
        <div class="eyebrow">${product.category}</div>
        <h1 style="font-size: clamp(2rem, 3.5vw, 2.75rem); color: var(--color-dark-navy); margin-bottom: 16px; line-height: 1.2;">
          ${product.title}
        </h1>
        <p style="font-size: 1.1rem; line-height: 1.7; color: #475569; margin-bottom: 24px;">
          ${product.shortDescription}
        </p>

        <div style="background-color: #F8FAFC; border-left: 4px solid var(--color-primary-blue); padding: 18px 22px; border-radius: 4px; margin-bottom: 30px;">
          <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #64748B; display: block; margin-bottom: 4px;">Compliance & Tolerances</span>
          <span style="font-weight: 600; color: #071522;">Manufactured under ISO 9001:2015 & ISO 3834-2 welding quality management.</span>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 32px;">
          <a href="contact.html?enquiry=${encodeURIComponent(product.title)}" class="btn btn-primary btn-lg">
            <span>Request Technical Proposal</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="assets/Winsteel-Corporate-Profile.pdf" download class="btn btn-outline-blue btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            <span>Download Specs PDF</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Engineering Tabs / Deep Specifications -->
    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 40px; margin-bottom: 64px;">
      <h2 style="font-size: 1.75rem; margin-bottom: 20px; color: #071522;">System Architecture & Design Features</h2>
      <p style="font-size: 1.05rem; line-height: 1.8; color: #334155; margin-bottom: 32px;">
        ${product.description}
      </p>

      ${features.length ? `
        <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #004B87;">Key Structural Features</h3>
        <ul style="list-style: none; margin-bottom: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
          ${features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.95rem; color: #1E293B;">
              <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; background:#0067B1; color:#FFF; border-radius:50%; flex-shrink:0; margin-top:2px;">✓</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}

      ${specs.length ? `
        <h3 style="font-size: 1.3rem; margin-bottom: 16px; color: #004B87;">Technical Specifications Matrix</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tbody>
              ${specs.map(([k, v], idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}; border-bottom: 1px solid #E2E8F0;">
                  <td style="padding: 14px 20px; font-weight: 700; color: #0F172A; width: 35%; border-right: 1px solid #E2E8F0;">${k}</td>
                  <td style="padding: 14px 20px; color: #334155;">${v}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </div>
  `;

  // Initialize Gallery switcher
  if (galleryImages.length > 1) {
    const mainImg = document.getElementById('main-product-img');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => {
          t.style.borderColor = 'transparent';
          t.style.opacity = '0.7';
        });
        thumb.style.borderColor = '#0067B1';
        thumb.style.opacity = '1';
        mainImg.src = thumb.getAttribute('data-full-img');
      });
    });
  }
}
