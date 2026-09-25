/**
 * WINSTEEL ENGINEERING WORKS - DATA LOADER
 * Centralized asynchronous data manager
 */

const WinsteelData = (function () {
  let cachedData = null;
  const LOCAL_STORAGE_KEY = 'winsteel_db_data';

  // Primary loader: checks local storage for admin edits, then database/db.json, then data/winsteel.json
  async function loadData() {
    if (cachedData) return cachedData;

    // Check localStorage (allows admin preview of changes without backend)
    const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localSaved) {
      try {
        cachedData = JSON.parse(localSaved);
        console.log('⚡ Loaded data from local workspace cache');
        return cachedData;
      } catch (e) {
        console.warn('Invalid local storage data, fetching from server JSON', e);
      }
    }

    // Try database/db.json first (support absolute and relative URL paths)
    const jsonPaths = ['/database/db.json', 'database/db.json', '/data/winsteel.json', 'data/winsteel.json'];
    for (const jsonPath of jsonPaths) {
      try {
        const res = await fetch(jsonPath);
        if (res.ok) {
          cachedData = await res.json();
          return cachedData;
        }
      } catch (e) {
        // try next path
      }
    }
    console.error('CRITICAL: Failed to load Winsteel JSON data from any known path!');
    return null;
  }

  // Getters
  async function getProducts() {
    const data = await loadData();
    return data && data.products ? data.products : [];
  }

  async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => String(p.id) === String(id) || p.slug === id);
  }

  async function getProjects() {
    const data = await loadData();
    return data && data.projects ? data.projects : [];
  }

  async function getProjectById(id) {
    const projects = await getProjects();
    return projects.find(p => String(p.id) === String(id) || p.slug === id);
  }

  async function getFacilities() {
    const data = await loadData();
    return data && data.facilities ? data.facilities : [];
  }

  async function getStrengths() {
    const data = await loadData();
    return data && data.strengths ? data.strengths : [];
  }

  async function getCertificates() {
    const data = await loadData();
    return data && data.certificates ? data.certificates : [];
  }

  async function getClients() {
    const data = await loadData();
    return data && data.clients ? data.clients : [];
  }

  async function getTestimonials() {
    const data = await loadData();
    return data && data.testimonials ? data.testimonials : [];
  }

  async function getNews() {
    const data = await loadData();
    return data && data.news ? data.news : [];
  }

  async function getNewsById(id) {
    const news = await getNews();
    return news.find(n => String(n.id) === String(id) || n.slug === id);
  }

  async function getSettings() {
    const data = await loadData();
    return data && data.settings ? data.settings : {};
  }

  async function getCategories() {
    const data = await loadData();
    return data && data.categories ? data.categories : { products: ['All'], projects: ['All'] };
  }

  // Helper for admin updates in memory
  function saveToLocalCache(newData) {
    cachedData = newData;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  }

  function clearLocalCache() {
    cachedData = null;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return {
    loadData,
    getProducts,
    getProductById,
    getProjects,
    getProjectById,
    getFacilities,
    getStrengths,
    getCertificates,
    getClients,
    getTestimonials,
    getNews,
    getNewsById,
    getSettings,
    getCategories,
    saveToLocalCache,
    clearLocalCache
  };
})();
