/**
 * WINSTEEL ENGINEERING WORKS - NEWS & INSIGHTS SCRIPT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isNewsDetailPage = document.getElementById('news-detail-container');
  const isNewsListPage = document.getElementById('news-grid-container');

  if (isNewsListPage) {
    await initNewsListing();
  } else if (isNewsDetailPage) {
    await initNewsDetail();
  }
});

async function initNewsListing() {
  const container = document.getElementById('news-grid-container');
  if (!container) return;

  const newsList = await WinsteelData.getNews();

  if (!newsList.length) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #64748B;">No news announcements at this time.</p>`;
    return;
  }

  container.innerHTML = newsList.map(n => `
    <article class="news-card reveal is-visible">
      <div class="news-img-box">
        <img src="${n.image}" alt="${n.title}" class="news-img" loading="lazy">
      </div>
      <div class="news-body">
        <div class="news-meta">
          <span class="category">${n.category}</span>
          <span>•</span>
          <time datetime="${n.date}">${new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
        </div>
        <h3 class="news-card-title">
          <a href="news-details.html?id=${n.id}">${n.title}</a>
        </h3>
        <p class="news-excerpt">${n.shortDescription}</p>
        <a href="news-details.html?id=${n.id}" class="product-link" style="margin-top: auto;">
          <span>Read Full Release</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  `).join('');
}

async function initNewsDetail() {
  const container = document.getElementById('news-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get('id') || 'news-1';

  const item = await WinsteelData.getNewsById(newsId);

  if (!item) {
    container.innerHTML = `
      <div style="text-align: center; padding: 100px 20px;">
        <h2>Article Not Found</h2>
        <p style="color:#64748B; margin: 16px 0 24px;">The press release or news story requested could not be located.</p>
        <a href="news.html" class="btn btn-primary">Return to News</a>
      </div>
    `;
    return;
  }

  document.title = `${item.title} | Winsteel News`;
  const breadcrumbEl = document.getElementById('breadcrumb-news-title');
  if (breadcrumbEl) breadcrumbEl.textContent = item.title;

  container.innerHTML = `
    <article style="max-width: 860px; margin: 0 auto;">
      <div class="eyebrow">${item.category}</div>
      <h1 style="font-size: clamp(2.2rem, 4vw, 3.2rem); color: var(--color-dark-navy); margin-bottom: 20px; line-height: 1.2;">
        ${item.title}
      </h1>
      
      <div style="display: flex; align-items: center; gap: 20px; color: #64748B; font-size: 0.95rem; margin-bottom: 36px; padding-bottom: 20px; border-bottom: 1px solid #E2E8F0;">
        <span><strong>Published:</strong> ${new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span>•</span>
        <span><strong>Source:</strong> ${item.author || 'Winsteel Editorial'}</span>
      </div>

      <div style="height: 440px; border-radius: 8px; overflow: hidden; margin-bottom: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="font-size: 1.2rem; line-height: 1.8; color: #1E293B; margin-bottom: 32px; font-weight: 500;">
        ${item.shortDescription}
      </div>

      <div style="font-size: 1.05rem; line-height: 1.85; color: #334155; margin-bottom: 48px;">
        <p>${item.content}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 24px;">
        <a href="news.html" class="btn btn-outline-blue btn-sm">← Back to News & Media</a>
        <a href="contact.html?enquiry=Press" class="btn btn-primary btn-sm">Media Inquiries</a>
      </div>
    </article>
  `;
}
