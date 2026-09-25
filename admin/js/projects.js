/**
 * WINSTEEL ADMIN - PROJECTS CONTROLLER
 * Handles Projects Listing, Creation, and Editing
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

  if (categoryFilter && data.categories && data.categories.projects) {
    categoryFilter.innerHTML = `<option value="All">All Categories</option>` +
      data.categories.projects.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function renderTable() {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = categoryFilter ? categoryFilter.value : 'All';

    const filtered = (data.projects || []).filter(p => {
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      const matchCat = cat === 'All' || p.category === cat;
      return matchQ && matchCat;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748B;">No projects found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(pr => `
      <tr>
        <td><code style="font-size:0.8rem; background:#F1F5F9; padding:2px 6px; border-radius:3px;">${pr.id}</code></td>
        <td><img src="${pr.coverImage}" alt="${pr.title}" class="table-img"></td>
        <td>
          <strong>${pr.title}</strong>
          ${pr.featured ? '<span style="background:#FEF3C7; color:#92400E; font-size:0.7rem; padding:1px 6px; border-radius:3px; margin-left:6px; font-weight:700;">Featured</span>' : ''}
        </td>
        <td>${pr.category}</td>
        <td>${pr.client}</td>
        <td>
          <span class="badge-status ${pr.status.toLowerCase()}">${pr.status}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="project-edit.html?id=${pr.id}" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">Edit</a>
            <a href="../project-details.html?id=${pr.id}" target="_blank" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">View</a>
            <button class="btn-admin btn-admin-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteProject('${pr.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.deleteProject = function (id) {
    if (confirm(`Are you sure you want to delete project: "${id}"?`)) {
      data.projects = data.projects.filter(p => String(p.id) !== String(id));
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
    titleEl.textContent = isEditing ? `Edit Project: ${projId}` : 'Add New Infrastructure Project';
  }

  // Populate categories
  const catSelect = document.getElementById('proj-category');
  if (catSelect && data.categories && data.categories.projects) {
    catSelect.innerHTML = data.categories.projects
      .filter(c => c !== 'All')
      .map(c => `<option value="${c}">${c}</option>`).join('');
  }

  let currentProject = null;

  if (isEditing) {
    currentProject = (data.projects || []).find(p => String(p.id) === String(projId));
    if (currentProject) {
      document.getElementById('proj-id').value = currentProject.id;
      document.getElementById('proj-title').value = currentProject.title;
      document.getElementById('proj-slug').value = currentProject.slug || '';
      document.getElementById('proj-category').value = currentProject.category;
      document.getElementById('proj-location').value = currentProject.location;
      document.getElementById('proj-year').value = currentProject.year;
      document.getElementById('proj-client').value = currentProject.client;
      document.getElementById('proj-shortDesc').value = currentProject.shortDescription;
      document.getElementById('proj-desc').value = currentProject.description;
      document.getElementById('proj-coverImage').value = currentProject.coverImage;
      document.getElementById('proj-scope').value = currentProject.scopeOfWork || '';
      document.getElementById('proj-materials').value = currentProject.materials || '';
      document.getElementById('proj-status').value = currentProject.status || 'Completed';
      document.getElementById('proj-featured').checked = Boolean(currentProject.featured);
      document.getElementById('proj-displayOrder').value = currentProject.displayOrder || 1;
    }
  } else {
    const nextNum = (data.projects || []).length + 1;
    document.getElementById('proj-id').value = `proj-${nextNum}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('proj-id').value.trim();
    const title = document.getElementById('proj-title').value.trim();
    let slug = document.getElementById('proj-slug').value.trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const category = document.getElementById('proj-category').value;
    const location = document.getElementById('proj-location').value.trim();
    const year = document.getElementById('proj-year').value.trim();
    const client = document.getElementById('proj-client').value.trim();
    const shortDesc = document.getElementById('proj-shortDesc').value.trim();
    const description = document.getElementById('proj-desc').value.trim();
    const coverImage = document.getElementById('proj-coverImage').value.trim() || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80';
    const scopeOfWork = document.getElementById('proj-scope').value.trim();
    const materials = document.getElementById('proj-materials').value.trim();
    const status = document.getElementById('proj-status').value;
    const featured = document.getElementById('proj-featured').checked;
    const displayOrder = parseInt(document.getElementById('proj-displayOrder').value, 10) || 1;

    const updatedObj = {
      id,
      title,
      slug,
      category,
      location,
      year,
      client,
      shortDescription: shortDesc,
      description,
      coverImage,
      gallery: currentProject && currentProject.gallery ? currentProject.gallery : [coverImage],
      scopeOfWork,
      materials,
      status,
      featured,
      displayOrder
    };

    if (isEditing) {
      const idx = data.projects.findIndex(p => String(p.id) === String(projId));
      if (idx !== -1) {
        data.projects[idx] = updatedObj;
      }
    } else {
      if (!data.projects) data.projects = [];
      data.projects.push(updatedObj);
    }

    AdminApp.saveWorkingData(data);
    setTimeout(() => {
      window.location.href = 'projects.html';
    }, 400);
  });
}
