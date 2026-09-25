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
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.shortDescription && p.shortDescription.toLowerCase().includes(q));
      const matchCat = cat === 'All' || p.category === cat;
      return matchQ && matchCat;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#64748B;">No products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.title}" style="width:64px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #E2E8F0; display:block;">
        </td>
        <td>
          <strong style="color:#0F172A; font-size:0.95rem; display:block;">${p.title}</strong>
        </td>
        <td>
          <span style="background:#F1F5F9; color:#004B87; padding:4px 10px; border-radius:4px; font-size:0.85rem; font-weight:600;">${p.category}</span>
        </td>
        <td style="max-width:340px; color:#475569; font-size:0.875rem; line-height:1.5;">
          <div style="overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${p.shortDescription || ''}
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:8px;">
            <a href="product-edit.html?id=${p.id}" class="btn-admin btn-admin-outline" style="padding:6px 12px; font-size:0.8rem;">Edit</a>
            <button class="btn-admin btn-admin-danger" style="padding:6px 12px; font-size:0.8rem;" onclick="deleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.deleteProduct = function (id) {
    const p = (data.products || []).find(x => String(x.id) === String(id));
    const name = p ? p.title : id;
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      data.products = data.products.filter(item => String(item.id) !== String(id));
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
    titleEl.textContent = isEditing ? 'Edit Product' : 'Add New Product';
  }

  // Populate Categories
  const catSelect = document.getElementById('prod-category');
  if (catSelect && data.categories && data.categories.products) {
    catSelect.innerHTML = data.categories.products
      .filter(c => c !== 'All')
      .map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // Image Upload & Preview Elements
  const fileInput = document.getElementById('prod-image-file');
  const dropzone = document.getElementById('upload-dropzone');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview');
  const hiddenImageInput = document.getElementById('prod-image');
  const btnChangeImage = document.getElementById('btn-change-image');
  const btnRemoveImage = document.getElementById('btn-remove-image');

  function showImagePreview(src) {
    hiddenImageInput.value = src;
    previewImg.src = src;
    previewContainer.style.display = 'block';
    dropzone.style.display = 'none';
  }

  function clearImage() {
    hiddenImageInput.value = '';
    previewImg.src = '';
    previewContainer.style.display = 'none';
    dropzone.style.display = 'block';
    if (fileInput) fileInput.value = '';
  }

  // Compress & convert file to data URL
  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize to max 1200px width/height and 0.82 JPEG quality
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        showImagePreview(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#004B87';
      dropzone.style.background = '#EFF6FF';
    });

    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#0067B1';
      dropzone.style.background = '#F8FAFC';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '#0067B1';
      dropzone.style.background = '#F8FAFC';
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        processFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length) {
        processFile(e.target.files[0]);
      }
    });
  }

  if (btnChangeImage && fileInput) {
    btnChangeImage.addEventListener('click', () => fileInput.click());
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', clearImage);
  }

  let currentProduct = null;

  if (isEditing) {
    currentProduct = (data.products || []).find(p => String(p.id) === String(prodId));
    if (currentProduct) {
      document.getElementById('prod-id').value = currentProduct.id;
      document.getElementById('prod-title').value = currentProduct.title || '';
      document.getElementById('prod-slug').value = currentProduct.slug || '';
      document.getElementById('prod-category').value = currentProduct.category || '';
      document.getElementById('prod-shortDesc').value = currentProduct.shortDescription || '';
      document.getElementById('prod-desc').value = currentProduct.description || '';

      if (currentProduct.image) {
        showImagePreview(currentProduct.image);
      }
    }
  } else {
    // Generate new ID automatically
    const nextNum = (data.products || []).length + 1;
    document.getElementById('prod-id').value = `prod-${nextNum}`;
  }

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('prod-title').value.trim();
    const category = document.getElementById('prod-category').value;
    const shortDesc = document.getElementById('prod-shortDesc').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const image = document.getElementById('prod-image').value.trim();

    if (!image) {
      alert('Please upload an image for this product.');
      return;
    }

    // Auto-generate ID & slug behind the scenes
    let id = document.getElementById('prod-id').value.trim();
    if (!id) {
      id = `prod-${(data.products || []).length + 1}`;
    }

    let slug = document.getElementById('prod-slug').value.trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
      features: currentProduct && currentProduct.features ? currentProduct.features : [],
      specifications: currentProduct && currentProduct.specifications ? currentProduct.specifications : {},
      status: currentProduct && currentProduct.status ? currentProduct.status : 'Active',
      featured: currentProduct && typeof currentProduct.featured !== 'undefined' ? currentProduct.featured : false,
      displayOrder: currentProduct && currentProduct.displayOrder ? currentProduct.displayOrder : 1
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
