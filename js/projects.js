/**
 * WINSTEEL ENGINEERING WORKS - PROJECTS SCRIPT
 * Handles Portfolio Grid & Project Details Page
 */

document.addEventListener('DOMContentLoaded', async () => {
  const isDetailPage = document.getElementById('project-detail-container');
  const isPortfolioPage = document.getElementById('projects-grid-container');

  if (isPortfolioPage) {
    await initProjectsPortfolio();
  } else if (isDetailPage) {
    await initProjectDetail();
  }
});

// 1. Projects Portfolio Page
async function initProjectsPortfolio() {
  const container = document.getElementById('projects-grid-container');
  const filterWrapper = document.getElementById('project-filters-wrapper');
  const countBadge = document.getElementById('project-count-display');

  if (!container) return;

  const allProjects = await WinsteelData.getProjects();
  const catData = await WinsteelData.getCategories();
  const categories = catData.projects || ['All'];

  const urlParams = new URLSearchParams(window.location.search);
  let activeCategory = urlParams.get('category') || 'All';

  if (filterWrapper && typeof WinsteelFilters !== 'undefined') {
    WinsteelFilters.setupFilterBar({
      filterBarContainerSelector: '#project-filters-wrapper',
      categories: categories,
      activeCategory: activeCategory,
      onFilterChange: (cat) => {
        activeCategory = cat;
        renderFilteredProjects();
      }
    });
  }

  function renderFilteredProjects() {
    const filtered = allProjects.filter(p => {
      const matchCat = (activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase());
      return matchCat && p.status !== 'Inactive';
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Landmark Projects`;
    }

    if (!filtered.length) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background:#F8FAFC; border-radius:8px;">
          <h3 style="color:#004B87; margin-bottom:12px;">No projects found</h3>
          <p style="color:#64748B;">Please select another project category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(renderProjectCardHtml).join('');
  }

  renderFilteredProjects();
}

function renderProjectCardHtml(p) {
  return `
    <article class="project-card reveal is-visible">
      <img src="${p.coverImage}" alt="${p.title}" class="project-card-img" loading="lazy">
      <div class="project-overlay">
        <div class="project-meta-top">
          <span class="project-category-badge">${p.category}</span>
          <span class="project-year-badge">${p.year}</span>
        </div>
        <div class="project-client-name">Client: ${p.client}</div>
        <h3 class="project-card-title">
          <a href="project-details.html?id=${p.id}">${p.title}</a>
        </h3>
        <div class="project-card-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${p.location}</span>
        </div>
        <a href="project-details.html?id=${p.id}" class="project-cta-link">
          <span>Case Study & Details</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  `;
}

// 2. Project Details Page
async function initProjectDetail() {
  const container = document.getElementById('project-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projId = urlParams.get('id') || 'proj-1';

  const project = await WinsteelData.getProjectById(projId);

  if (!project) {
    container.innerHTML = `
      <div style="text-align: center; padding: 100px 20px;">
        <h2>Project Not Found</h2>
        <p style="color:#64748B; margin: 16px 0 24px;">The engineering infrastructure project requested could not be found.</p>
        <a href="projects.html" class="btn btn-primary">Return to Projects</a>
      </div>
    `;
    return;
  }

  // Set Page Title and Breadcrumb
  document.title = `${project.title} | Winsteel Engineering Works`;
  const breadcrumbEl = document.getElementById('breadcrumb-project-title');
  if (breadcrumbEl) breadcrumbEl.textContent = project.title;

  const galleryImages = (project.gallery && project.gallery.length) ? project.gallery : [project.coverImage];

  container.innerHTML = `
    <!-- Top Hero Banner with High Visual Impact -->
    <div style="position: relative; height: 500px; border-radius: 12px; overflow: hidden; margin-bottom: 48px; border: 1px solid #1E3752; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
      <img src="${project.coverImage}" alt="${project.title}" style="width:100%; height:100%; object-fit: cover;">
      <div style="position: absolute; inset:0; background: linear-gradient(180deg, rgba(7,21,34,0.3) 0%, rgba(7,21,34,0.92) 85%); display: flex; flex-direction: column; justify-content: flex-end; padding: 48px 40px; color: #FFF;">
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <span class="project-category-badge" style="font-size:0.85rem;">${project.category}</span>
          <span class="project-year-badge">${project.year}</span>
        </div>
        <h1 style="font-size: clamp(2rem, 4vw, 3rem); line-height: 1.2; margin-bottom: 12px; color: #FFF;">
          ${project.title}
        </h1>
        <div style="display: flex; align-items: center; gap: 8px; color: #FFC400; font-weight: 600;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${project.location}</span>
        </div>
      </div>
    </div>

    <!-- Project Data Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 48px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 8px; border-top: 3px solid #0067B1;">
        <span style="font-size:0.75rem; text-transform:uppercase; color:#64748B; font-weight:700; display:block; margin-bottom:6px;">Client / Partner</span>
        <strong style="font-size:1.1rem; color:#0F172A;">${project.client}</strong>
      </div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 8px; border-top: 3px solid #FFC400;">
        <span style="font-size:0.75rem; text-transform:uppercase; color:#64748B; font-weight:700; display:block; margin-bottom:6px;">Sector / Domain</span>
        <strong style="font-size:1.1rem; color:#0F172A;">${project.category}</strong>
      </div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 8px; border-top: 3px solid #0067B1;">
        <span style="font-size:0.75rem; text-transform:uppercase; color:#64748B; font-weight:700; display:block; margin-bottom:6px;">Delivery Year</span>
        <strong style="font-size:1.1rem; color:#0F172A;">${project.year}</strong>
      </div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 24px; border-radius: 8px; border-top: 3px solid #10B981;">
        <span style="font-size:0.75rem; text-transform:uppercase; color:#64748B; font-weight:700; display:block; margin-bottom:6px;">Execution Status</span>
        <strong style="font-size:1.1rem; color:#0F172A;">${project.status}</strong>
      </div>
    </div>

    <!-- Content Breakdown: Overview, Scope, Materials -->
    <div style="display: grid; grid-template-columns: 1.8fr 1fr; gap: 48px; margin-bottom: 64px;" class="project-detail-body">
      <div>
        <h2 style="font-size: 1.85rem; color: #071522; margin-bottom: 18px;">Engineering Execution Overview</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: #334155; margin-bottom: 32px;">
          ${project.description}
        </p>

        <h3 style="font-size: 1.4rem; color: #004B87; margin-bottom: 14px;">Scope of Engineering & Fabrication</h3>
        <p style="font-size: 1.05rem; line-height: 1.7; color: #475569; margin-bottom: 32px; background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #004B87;">
          ${project.scopeOfWork}
        </p>

        <h3 style="font-size: 1.4rem; color: #004B87; margin-bottom: 14px;">Materials & Metallurgy</h3>
        <p style="font-size: 1.05rem; line-height: 1.7; color: #475569; margin-bottom: 32px;">
          ${project.materials}
        </p>
      </div>

      <!-- Quick Action / Consult Box -->
      <div>
        <div style="background: #071522; color: #FFF; border-radius: 8px; padding: 36px 30px; position: sticky; top: 100px;">
          <div class="eyebrow eyebrow-light">Partner With Winsteel</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 16px; color: #FFF;">Have a Similar Mega Project?</h3>
          <p style="font-size: 0.95rem; color: #94A3B8; line-height: 1.7; margin-bottom: 24px;">
            Consult with our chief technical equipment specialists for preliminary structural sizing, load charts, and custom steel mould engineering.
          </p>
          <a href="contact.html?enquiry=${encodeURIComponent('Project Consultation: ' + project.title)}" class="btn btn-accent btn-lg" style="width: 100%; text-align: center;">
            Contact Project Desk
          </a>
        </div>
      </div>
    </div>

    <!-- Gallery Grid -->
    ${galleryImages.length > 1 ? `
      <div style="margin-bottom: 64px;">
        <h2 style="font-size: 1.75rem; color: #071522; margin-bottom: 24px;">Jobsite & Fabrication Gallery</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          ${galleryImages.map((img, idx) => `
            <div style="height: 260px; border-radius: 8px; overflow: hidden; border: 1px solid #E2E8F0;">
              <img src="${img}" alt="${project.title} - Image ${idx + 1}" style="width:100%; height:100%; object-fit: cover; transition: transform 0.4s ease;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}
