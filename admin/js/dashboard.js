/**
 * WINSTEEL ADMIN - DASHBOARD SCRIPT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const data = await AdminApp.getWorkingData();
  if (!data) return;

  // 1. Populate Metrics
  const metricProducts = document.getElementById('count-products');
  const metricProjects = document.getElementById('count-projects');
  const metricFacilities = document.getElementById('count-facilities');
  const metricNews = document.getElementById('count-news');
  const metricCerts = document.getElementById('count-certificates');
  const metricClients = document.getElementById('count-clients');

  if (metricProducts) metricProducts.textContent = data.products ? data.products.length : 0;
  if (metricProjects) metricProjects.textContent = data.projects ? data.projects.length : 0;
  if (metricFacilities) metricFacilities.textContent = data.facilities ? data.facilities.length : 0;
  if (metricNews) metricNews.textContent = data.news ? data.news.length : 0;
  if (metricCerts) metricCerts.textContent = data.certificates ? data.certificates.length : 0;
  if (metricClients) metricClients.textContent = data.clients ? data.clients.length : 0;

  // 2. Recent Products Table
  const recentProductsTbody = document.getElementById('recent-products-tbody');
  if (recentProductsTbody && data.products) {
    const recents = data.products.slice(0, 5);
    recentProductsTbody.innerHTML = recents.map(p => `
      <tr>
        <td><img src="${p.image}" alt="${p.title}" class="table-img"></td>
        <td><strong>${p.title}</strong></td>
        <td><span style="font-size:0.8rem; background:#F1F5F9; padding:3px 8px; border-radius:4px;">${p.category}</span></td>
        <td><span class="badge-status ${p.status.toLowerCase()}">${p.status}</span></td>
        <td>
          <a href="product-edit.html?id=${p.id}" class="btn-admin btn-admin-outline" style="padding:4px 10px; font-size:0.8rem;">Edit</a>
        </td>
      </tr>
    `).join('');
  }

  // 3. Recent Projects Table
  const recentProjectsTbody = document.getElementById('recent-projects-tbody');
  if (recentProjectsTbody && data.projects) {
    const recents = data.projects.slice(0, 5);
    recentProjectsTbody.innerHTML = recents.map(pr => `
      <tr>
        <td><img src="${pr.coverImage}" alt="${pr.title}" class="table-img"></td>
        <td><strong>${pr.title}</strong></td>
        <td>${pr.client}</td>
        <td>${pr.year}</td>
        <td><span class="badge-status ${pr.status.toLowerCase()}">${pr.status}</span></td>
        <td>
          <a href="project-edit.html?id=${pr.id}" class="btn-admin btn-admin-outline" style="padding:4px 10px; font-size:0.8rem;">Edit</a>
        </td>
      </tr>
    `).join('');
  }
});
