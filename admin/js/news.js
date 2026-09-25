/**
 * WINSTEEL ADMIN - NEWS & INSIGHTS CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isListPage = document.getElementById('admin-news-table-body');
  const isEditPage = document.getElementById('news-edit-form');

  if (isListPage) {
    await initNewsList();
  } else if (isEditPage) {
    await initNewsEdit();
  }
});

async function initNewsList() {
  const tbody = document.getElementById('admin-news-table-body');
  const data = await AdminApp.getWorkingData();
  if (!tbody || !data) return;

  function renderTable() {
    if (!data.news || !data.news.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#64748B;">No news announcements found.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.news.map(n => `
      <tr>
        <td><code style="font-size:0.8rem; background:#F1F5F9; padding:2px 6px; border-radius:3px;">${n.id}</code></td>
        <td><img src="${n.image}" alt="${n.title}" class="table-img"></td>
        <td>
          <strong>${n.title}</strong>
          ${n.featured ? '<span style="background:#FEF3C7; color:#92400E; font-size:0.7rem; padding:1px 6px; border-radius:3px; margin-left:6px; font-weight:700;">Featured</span>' : ''}
        </td>
        <td>${n.category}</td>
        <td>${n.date}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <a href="news-edit.html?id=${n.id}" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">Edit</a>
            <a href="../news-details.html?id=${n.id}" target="_blank" class="btn-admin btn-admin-outline" style="padding:4px 8px; font-size:0.75rem;">View</a>
            <button class="btn-admin btn-admin-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteNews('${n.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.deleteNews = function (id) {
    if (confirm(`Delete article: "${id}"?`)) {
      data.news = data.news.filter(n => String(n.id) !== String(id));
      AdminApp.saveWorkingData(data);
      renderTable();
    }
  };

  renderTable();
}

async function initNewsEdit() {
  const form = document.getElementById('news-edit-form');
  const data = await AdminApp.getWorkingData();
  if (!form || !data) return;

  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get('id');
  const isEditing = Boolean(newsId);

  const titleEl = document.getElementById('edit-news-page-title');
  if (titleEl) {
    titleEl.textContent = isEditing ? `Edit Article: ${newsId}` : 'Create News Release';
  }

  let currentItem = null;

  if (isEditing) {
    currentItem = (data.news || []).find(n => String(n.id) === String(newsId));
    if (currentItem) {
      document.getElementById('news-id').value = currentItem.id;
      document.getElementById('news-title').value = currentItem.title;
      document.getElementById('news-category').value = currentItem.category;
      document.getElementById('news-date').value = currentItem.date;
      document.getElementById('news-author').value = currentItem.author || '';
      document.getElementById('news-image').value = currentItem.image;
      document.getElementById('news-shortDesc').value = currentItem.shortDescription;
      document.getElementById('news-content').value = currentItem.content;
      document.getElementById('news-status').value = currentItem.status || 'Published';
      document.getElementById('news-featured').checked = Boolean(currentItem.featured);
    }
  } else {
    document.getElementById('news-id').value = `news-${(data.news || []).length + 1}`;
    document.getElementById('news-date').value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('news-id').value.trim();
    const title = document.getElementById('news-title').value.trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const category = document.getElementById('news-category').value.trim();
    const date = document.getElementById('news-date').value;
    const author = document.getElementById('news-author').value.trim() || 'Winsteel Editorial';
    const image = document.getElementById('news-image').value.trim();
    const shortDesc = document.getElementById('news-shortDesc').value.trim();
    const content = document.getElementById('news-content').value.trim();
    const status = document.getElementById('news-status').value;
    const featured = document.getElementById('news-featured').checked;

    const obj = { id, title, slug, category, date, author, image, shortDescription: shortDesc, content, status, featured };

    if (isEditing) {
      const idx = data.news.findIndex(n => String(n.id) === String(newsId));
      if (idx !== -1) {
        data.news[idx] = obj;
      }
    } else {
      if (!data.news) data.news = [];
      data.news.unshift(obj);
    }

    AdminApp.saveWorkingData(data);
    setTimeout(() => {
      window.location.href = 'news.html';
    }, 400);
  });
}
