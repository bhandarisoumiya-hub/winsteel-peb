/**
 * WINSTEEL ADMIN - PROJECTS CONTROLLER
 * Handles Projects Listing, Creation, and Editing with simplified UX
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isListPage = document.getElementById('admin-projects-table-body');
  const isEditPage = document.getElementById('project-edit-form');

  if (isListPage) {
    await initProjectsList();
  } else if (isEditPage) {
    await initProjectEdit();
  }
});

async function initProjectsList() {
  const tbody = document.getElementById('admin-projects-table-body');
  const searchInput = document.getElementById('admin-project-search');
  const categoryFilter = document.getElementById('admin-project-category-filter');
  const data = await AdminApp.getWorkingData();

  if (!tbody || !data) return;

  // Populate category filter
  if (categoryFilter && data.categories && data.categories.projects) {
    categoryFilter.innerHTML = `<option value="All">All Categories</option>` +
      data.categories.projects.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function renderTable() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = categoryFilter ? categoryFilter.value : 'All';

    const filtered = (data.projects || []).filter(p => {
      const matchQ = !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q));
      const matchCat = cat === 'All' || p.category === cat;
      return matchQ && matchCat;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748B;">No projects found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(pr => {
      const imgSrc = pr.coverImage || pr.image || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80';
      return `
        <tr>
          <td>
            <img src="${imgSrc}" alt="${pr.title}" style="width:64px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #E2E8F0; display:block;">
          </td>
          <td>
            <strong style="color:#0F172A; font-size:0.95rem; display:block;">${pr.title}</strong>
            ${pr.featured ? '<span style="background:#FEF3C7; color:#92400E; font-size:0.7rem; padding:2px 6px; border-radius:3px; font-weight:700; display:inline-block; margin-top:4px;">Featured</span>' : ''}
          </td>
          <td>
            <span style="background:#F1F5F9; color:#004B87; padding:4px 10px; border-radius:4px; font-size:0.85rem; font-weight:600;">${pr.category}</span>
          </td>
          <td style="color:#475569; font-size:0.875rem;">
            <div style="font-weight:600; color:#1E293B;">${pr.client || 'Client Partner'}</div>
            <div style="font-size:0.8rem; color:#64748B;">${pr.location ? pr.location + ' • ' : ''}${pr.year || ''}</div>
          </td>
          <td style="max-width:280px; color:#475569; font-size:0.875rem; line-height:1.5;">
            <div style="overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              ${pr.shortDescription || pr.description || ''}
            </div>
          </td>
          <td style="text-align:center;">
            <div style="display:inline-flex; gap:6px;">
              <a href="project-edit.html?id=${pr.id}" class="btn-admin btn-admin-outline" style="padding:6px 10px; font-size:0.8rem;">Edit</a>
              <a href="../project-details.html?id=${pr.id}" target="_blank" class="btn-admin btn-admin-outline" style="padding:6px 10px; font-size:0.8rem;">View ↗</a>
              <button class="btn-admin btn-admin-danger" style="padding:6px 10px; font-size:0.8rem;" onclick="deleteProject('${pr.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteProject = function (id) {
    const p = (data.projects || []).find(x => String(x.id) === String(id));
    const name = p ? p.title : id;
    if (confirm(`Are you sure you want to delete project: "${name}"?`)) {
      data.projects = data.projects.filter(item => String(item.id) !== String(id));
      AdminApp.saveWorkingData(data);
      renderTable();
    }
  };

  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (categoryFilter) categoryFilter.addEventListener('change', renderTable);

  renderTable();
}

async function initProjectEdit() {
  const form = document.getElementById('project-edit-form');
  const data = await AdminApp.getWorkingData();
  if (!form || !data) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projId = urlParams.get('id');
  const isEditing = Boolean(projId);

  const titleEl = document.getElementById('edit-project-page-title');
  if (titleEl) {
    titleEl.textContent = isEditing ? 'Edit Project' : 'Add New Project';
  }

  // Populate categories
  const catSelect = document.getElementById('proj-category');
  if (catSelect && data.categories && data.categories.projects) {
    catSelect.innerHTML = data.categories.projects
      .filter(c => c !== 'All')
      .map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // Image Upload & Preview Elements
  const fileInput = document.getElementById('proj-image-file');
  const dropzone = document.getElementById('upload-dropzone');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview');
  const hiddenImageInput = document.getElementById('proj-image');
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

  // Optimize & convert file to data URL (max 800px, 0.75 quality)
  function processFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
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

        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
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

  let currentProject = null;

  if (isEditing) {
    currentProject = (data.projects || []).find(p => String(p.id) === String(projId));
    if (currentProject) {
      document.getElementById('proj-id').value = currentProject.id;
      document.getElementById('proj-title').value = currentProject.title || '';
      document.getElementById('proj-slug').value = currentProject.slug || '';
      document.getElementById('proj-category').value = currentProject.category || '';
      document.getElementById('proj-client').value = currentProject.client || '';
      document.getElementById('proj-location').value = currentProject.location || '';
      document.getElementById('proj-year').value = currentProject.year || '';
      document.getElementById('proj-shortDesc').value = currentProject.shortDescription || '';
      document.getElementById('proj-desc').value = currentProject.description || '';
      document.getElementById('proj-scope').value = currentProject.scopeOfWork || '';
      document.getElementById('proj-materials').value = currentProject.materials || '';

      const existingImg = currentProject.coverImage || currentProject.image;
      if (existingImg) {
        showImagePreview(existingImg);
      }
    }
  } else {
    // Generate new ID automatically
    const nextNum = (data.projects || []).length + 1;
    document.getElementById('proj-id').value = `proj-${nextNum}`;
    document.getElementById('proj-year').value = String(new Date().getFullYear());
  }

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('proj-title').value.trim();
    const category = document.getElementById('proj-category').value;
    const client = document.getElementById('proj-client').value.trim();
    const location = document.getElementById('proj-location').value.trim();
    const year = document.getElementById('proj-year').value.trim();
    const shortDesc = document.getElementById('proj-shortDesc').value.trim();
    const description = document.getElementById('proj-desc').value.trim();
    const scope = document.getElementById('proj-scope').value.trim();
    const materials = document.getElementById('proj-materials').value.trim();
    const image = document.getElementById('proj-image').value.trim();

    if (!image) {
      alert('Please upload an image for this project.');
      return;
    }

    // Auto-generate ID & slug in the background
    let id = document.getElementById('proj-id').value.trim();
    if (!id) {
      id = `proj-${(data.projects || []).length + 1}`;
    }

    let slug = document.getElementById('proj-slug').value.trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const updatedObj = {
      id,
      title,
      slug,
      category,
      location: location || 'India',
      year: year || String(new Date().getFullYear()),
      client: client || 'Infrastructure Partner',
      shortDescription: shortDesc,
      description,
      coverImage: image,
      image: image,
      gallery: currentProject && currentProject.gallery ? currentProject.gallery : [image],
      scopeOfWork: scope || 'Turnkey detail engineering design, precision fabrication, trial assembly, and site commissioning.',
      materials: materials || 'High-tensile structural steel, specialized corrosion-resistant marine epoxy coating.',
      status: 'Completed',
      featured: true,
      displayOrder: 1
    };

    if (isEditing) {
      const idx = data.projects.findIndex(p => String(p.id) === String(projId));
      if (idx !== -1) {
        data.projects[idx] = updatedObj;
      }
    } else {
      if (!data.projects) data.projects = [];
      data.projects.unshift(updatedObj); // Placed at top so it appears first on website!
    }

    AdminApp.saveWorkingData(data);
    setTimeout(() => {
      window.location.href = 'projects.html';
    }, 400);
  });
}
