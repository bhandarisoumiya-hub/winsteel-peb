/**
 * WINSTEEL ADMIN - FACILITIES CONTROLLER
 * Handles Listing, Creating, Editing, and Deleting Manufacturing Facilities
 */

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('admin-facilities-table-body');
  const modal = document.getElementById('facility-modal');
  const modalForm = document.getElementById('facility-form');
  const addBtn = document.getElementById('btn-add-facility');
  const closeBtn = document.getElementById('close-fac-modal');
  const closeBtnX = document.getElementById('close-fac-modal-x');
  const data = await AdminApp.getWorkingData();

  if (!tbody || !data) return;

  // Image Upload Elements
  const fileInput = document.getElementById('fac-image-file');
  const dropzone = document.getElementById('upload-dropzone');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('image-preview');
  const hiddenImageInput = document.getElementById('fac-image');
  const btnChangeImage = document.getElementById('btn-change-image');
  const btnRemoveImage = document.getElementById('btn-remove-image');

  function showImagePreview(src) {
    if (!src) return;
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

  function renderTable() {
    if (!data.facilities || !data.facilities.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748B;">No facilities registered.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.facilities.map((fac, idx) => `
      <tr>
        <td>
          <img src="${fac.image}" alt="${fac.title}" style="width:64px; height:48px; object-fit:cover; border-radius:6px; border:1px solid #E2E8F0; display:block;">
        </td>
        <td>
          <strong style="color:#0F172A; font-size:0.95rem; display:block;">${fac.title}</strong>
          <span style="font-size:0.8rem; color:#64748B;">${fac.id || 'fac-' + (idx + 1)}</span>
        </td>
        <td>
          <span style="background:#F1F5F9; color:#004B87; padding:3px 8px; border-radius:4px; font-size:0.85rem; font-weight:600;">${fac.capacity || 'N/A'}</span>
        </td>
        <td style="color:#475569; font-size:0.875rem;">${fac.area || 'N/A'}</td>
        <td style="max-width:240px; color:#475569; font-size:0.85rem; line-height:1.4;">
          <div style="overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${fac.equipment || fac.description || 'N/A'}
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn-admin btn-admin-outline" style="padding:6px 10px; font-size:0.8rem;" onclick="openEditFacility('${fac.id}')">Edit</button>
            <button class="btn-admin btn-admin-danger" style="padding:6px 10px; font-size:0.8rem;" onclick="deleteFacility('${fac.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.openEditFacility = function (id) {
    const fac = data.facilities.find(f => String(f.id) === String(id));
    if (!fac) return;
    document.getElementById('fac-modal-title').textContent = 'Edit Manufacturing Facility';
    document.getElementById('fac-id').value = fac.id;
    document.getElementById('fac-title').value = fac.title;
    document.getElementById('fac-desc').value = fac.description;
    document.getElementById('fac-capacity').value = fac.capacity || '';
    document.getElementById('fac-area').value = fac.area || '';
    document.getElementById('fac-equipment').value = fac.equipment || '';
    document.getElementById('fac-status').value = fac.status || 'Active';

    if (fac.image) {
      showImagePreview(fac.image);
    } else {
      clearImage();
    }

    modal.style.display = 'flex';
  };

  window.deleteFacility = function (id) {
    const fac = data.facilities.find(f => String(f.id) === String(id));
    const name = fac ? fac.title : id;
    if (confirm(`Are you sure you want to delete facility: "${name}"?`)) {
      data.facilities = data.facilities.filter(f => String(f.id) !== String(id));
      AdminApp.saveWorkingData(data);
      renderTable();
    }
  };

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('fac-modal-title').textContent = 'Add Manufacturing Facility';
      modalForm.reset();
      clearImage();
      document.getElementById('fac-id').value = `fac-${(data.facilities || []).length + 1}`;
      modal.style.display = 'flex';
    });
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBtnX) closeBtnX.addEventListener('click', closeModal);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('fac-id').value.trim();
      const title = document.getElementById('fac-title').value.trim();
      const description = document.getElementById('fac-desc').value.trim();
      const image = hiddenImageInput.value.trim();
      const capacity = document.getElementById('fac-capacity').value.trim();
      const area = document.getElementById('fac-area').value.trim();
      const equipment = document.getElementById('fac-equipment').value.trim();
      const status = document.getElementById('fac-status').value;

      if (!image) {
        alert('Please upload an image for this facility.');
        return;
      }

      const existingFac = data.facilities.find(f => String(f.id) === String(id));

      const obj = {
        id,
        title,
        description,
        image,
        capacity: capacity || 'N/A',
        area: area || 'N/A',
        equipment: equipment || 'N/A',
        features: existingFac && existingFac.features ? existingFac.features : [
          'High load floor capacity for heavy assembly',
          'Heavy lifting cranes with synchronized control'
        ],
        displayOrder: existingFac ? (existingFac.displayOrder || 1) : ((data.facilities || []).length + 1),
        status: status || 'Active'
      };

      const idx = data.facilities.findIndex(f => String(f.id) === String(id));
      if (idx !== -1) {
        data.facilities[idx] = obj;
      } else {
        data.facilities.push(obj);
      }

      AdminApp.saveWorkingData(data);
      closeModal();
      renderTable();
    });
  }

  renderTable();
});
