/**
 * WINSTEEL ADMIN - PRODUCTS CONTROLLER
 * Handles Listing, Creating, Editing, and Deleting Products
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isListPage = document.getElementById('admin-products-table-body');
  const isEditPage = document.getElementById('product-edit-form');

  if (isListPage) {
    await initProductsList();
  } else if (isEditPage) {
    await initProductEdit();
  }
});

async function initProductsList() {
  const tbody = document.getElementById('admin-products-table-body');
  const searchInput = document.getElementById('admin-product-search');
  const categoryFilter = document.getElementById('admin-product-category-filter');
  const data = await AdminApp.getWorkingData();

  if (!tbody || !data) return;

  // Populate category filter
  if (categoryFilter && data.categories && data.categories.products) {
    categoryFilter.innerHTML = `<option value="All">All Categories</option>` +
      data.categories.products.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function renderTable() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = categoryFilter ? categoryFilter.value : 'All';

    const filtered = (data.products || []).filter(p => {
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || String(p.id).toLowerCase().includes(q);
      const matchCat = cat === 'All' || p.category === cat;
      return matchQ && matchCat;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748B;">No products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td><code style="font-size:0.8rem; background:#F1F5F9; padding:2px 6px; border-radius:3px;">${p.id}</code></td>
        <td><img src="${p.image}" alt="${p.title}" class="table-img"></td>
        <td>
          <strong>${p.title}</strong>
          ${p.featured ? '<span style="background:#FEF3C7; color:#92400E; font-size:0.7rem; padding:1px 6px; border-radius:3px; margin-left:6px; font-weight:700;">Featured</span>' : ''}
        </td>
        <td>${p.category}</td>
        <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.shortDescription}</td>
        <td>
          <span class="badge-status ${p.status.toLowerCase()}">${p.status}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="product-edit.html?id=${p.id}" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">Edit</a>
            <a href="../product-details.html?id=${p.id}" target="_blank" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">View</a>
            <button class="btn-admin btn-admin-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.deleteProduct = function (id) {
    if (confirm(`Are you sure you want to delete product ID: "${id}"?`)) {
      data.products = data.products.filter(p => String(p.id) !== String(id));
      AdminApp.saveWorkingData(data);
      renderTable();
    }
  };

  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (categoryFilter) categoryFilter.addEventListener('change', renderTable);

  renderTable();
}

async function initProductEdit() {
  const form = document.getElementById('product-edit-form');
  const data = await AdminApp.getWorkingData();
  if (!form || !data) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id');
  const isEditing = Boolean(prodId);

  const titleEl = document.getElementById('edit-page-title');
  if (titleEl) {
    titleEl.textContent = isEditing ? `Edit Product: ${prodId}` : 'Add New Engineering Product';
  }

  // Populate Categories
  const catSelect = document.getElementById('prod-category');
  if (catSelect && data.categories && data.categories.products) {
    catSelect.innerHTML = data.categories.products
      .filter(c => c !== 'All')
      .map(c => `<option value="${c}">${c}</option>`).join('');
  }

  let currentProduct = null;

  if (isEditing) {
    currentProduct = (data.products || []).find(p => String(p.id) === String(prodId));
    if (currentProduct) {
      document.getElementById('prod-id').value = currentProduct.id;
      document.getElementById('prod-title').value = currentProduct.title;
      document.getElementById('prod-slug').value = currentProduct.slug || '';
      document.getElementById('prod-category').value = currentProduct.category;
      document.getElementById('prod-shortDesc').value = currentProduct.shortDescription;
      document.getElementById('prod-desc').value = currentProduct.description || '';
      document.getElementById('prod-image').value = currentProduct.image;
      document.getElementById('prod-status').value = currentProduct.status || 'Active';
      document.getElementById('prod-featured').checked = Boolean(currentProduct.featured);
      document.getElementById('prod-displayOrder').value = currentProduct.displayOrder || 1;

      if (currentProduct.features && Array.isArray(currentProduct.features)) {
        document.getElementById('prod-features').value = currentProduct.features.join('\n');
      }

      if (currentProduct.specifications) {
        document.getElementById('prod-specs').value = JSON.stringify(currentProduct.specifications, null, 2);
      }
    }
  } else {
    // Generate new ID
    const nextNum = (data.products || []).length + 1;
    document.getElementById('prod-id').value = `prod-${nextNum}`;
  }

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('prod-id').value.trim();
    const title = document.getElementById('prod-title').value.trim();
    let slug = document.getElementById('prod-slug').value.trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const category = document.getElementById('prod-category').value;
    const shortDesc = document.getElementById('prod-shortDesc').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const image = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80';
    const status = document.getElementById('prod-status').value;
    const featured = document.getElementById('prod-featured').checked;
    const displayOrder = parseInt(document.getElementById('prod-displayOrder').value, 10) || 1;

    // Parse features from newline
    const featuresRaw = document.getElementById('prod-features').value.trim();
    const features = featuresRaw ? featuresRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

    // Parse specifications JSON
    let specifications = {};
    const specsRaw = document.getElementById('prod-specs').value.trim();
    if (specsRaw) {
      try {
        specifications = JSON.parse(specsRaw);
      } catch (err) {
        alert('Invalid JSON in Specifications field. Please verify format.');
        return;
      }
    }

    const updatedObj = {
      id,
      title,
      slug,
      category,
      shortDescription: shortDesc,
      description,
      image,
      gallery: currentProduct && currentProduct.gallery ? currentProduct.gallery : [image],
      features,
      specifications,
      status,
      featured,
      displayOrder
    };

    if (isEditing) {
      const idx = data.products.findIndex(p => String(p.id) === String(prodId));
      if (idx !== -1) {
        data.products[idx] = updatedObj;
      }
    } else {
      if (!data.products) data.products = [];
      data.products.push(updatedObj);
    }

    AdminApp.saveWorkingData(data);
    setTimeout(() => {
      window.location.href = 'products.html';
    }, 400);
  });
}
