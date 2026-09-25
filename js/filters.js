/**
 * WINSTEEL ENGINEERING WORKS - CATEGORY FILTER HANDLER
 */

const WinsteelFilters = {
  setupFilterBar: function ({
    filterBarContainerSelector,
    categories,
    activeCategory = 'All',
    onFilterChange
  }) {
    const container = document.querySelector(filterBarContainerSelector);
    if (!container) return;

    container.innerHTML = '';
    const bar = document.createElement('div');
    bar.className = 'filter-bar';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn ${cat.toLowerCase() === activeCategory.toLowerCase() ? 'active' : ''}`;
      btn.textContent = cat;
      btn.setAttribute('data-category', cat);

      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (typeof onFilterChange === 'function') {
          onFilterChange(cat);
        }
      });

      bar.appendChild(btn);
    });

    container.appendChild(bar);
  }
};
