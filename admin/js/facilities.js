/**
 * WINSTEEL ADMIN - FACILITIES CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('admin-facilities-table-body');
  const modal = document.getElementById('facility-modal');
  const modalForm = document.getElementById('facility-form');
  const addBtn = document.getElementById('btn-add-facility');
  const data = await AdminApp.getWorkingData();

  if (!tbody || !data) return;

  function renderTable() {
    if (!data.facilities || !data.facilities.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748B;">No facilities registered.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.facilities.map((fac, idx) => `
      <tr>
        <td><code style="font-size:0.8rem; background:#F1F5F9; padding:2px 6px; border-radius:3px;">${fac.id || 'fac-' + (idx + 1)}</code></td>
        <td><img src="${fac.image}" alt="${fac.title}" class="table-img"></td>
        <td><strong>${fac.title}</strong></td>
        <td>${fac.capacity || 'N/A'}</td>
        <td>${fac.area || 'N/A'}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;" onclick="openEditFacility('${fac.id}')">Edit</button>
            <button class="btn-admin btn-admin-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteFacility('${fac.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.openEditFacility = function (id) {
    const fac = data.facilities.find(f => f.id === id);
    if (!fac) return;
    document.getElementById('fac-modal-title').textContent = 'Edit Manufacturing Facility';
    document.getElementById('fac-id').value = fac.id;
    document.getElementById('fac-title').value = fac.title;
    document.getElementById('fac-desc').value = fac.description;
    document.getElementById('fac-image').value = fac.image;
    document.getElementById('fac-capacity').value = fac.capacity || '';
    document.getElementById('fac-area').value = fac.area || '';
    document.getElementById('fac-equipment').value = fac.equipment || '';
    document.getElementById('fac-status').value = fac.status || 'Active';
    modal.style.display = 'flex';
  };

  window.deleteFacility = function (id) {
    if (confirm(`Delete facility: ${id}?`)) {
      data.facilities = data.facilities.filter(f => f.id !== id);
      AdminApp.saveWorkingData(data);
      renderTable();
    }
  };

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('fac-modal-title').textContent = 'Add Manufacturing Facility';
      modalForm.reset();
      document.getElementById('fac-id').value = `fac-${data.facilities.length + 1}`;
      modal.style.display = 'flex';
    });
  }

  const closeBtn = document.getElementById('close-fac-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('fac-id').value.trim();
      const title = document.getElementById('fac-title').value.trim();
      const description = document.getElementById('fac-desc').value.trim();
      const image = document.getElementById('fac-image').value.trim();
      const capacity = document.getElementById('fac-capacity').value.trim();
      const area = document.getElementById('fac-area').value.trim();
      const equipment = document.getElementById('fac-equipment').value.trim();
      const status = document.getElementById('fac-status').value;

      const obj = { id, title, description, image, capacity, area, equipment, status };
      const idx = data.facilities.findIndex(f => f.id === id);
      if (idx !== -1) {
        data.facilities[idx] = obj;
      } else {
        data.facilities.push(obj);
      }

      AdminApp.saveWorkingData(data);
      modal.style.display = 'none';
      renderTable();
    });
  }

  renderTable();
});
