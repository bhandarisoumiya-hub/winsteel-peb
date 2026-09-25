/**
 * WINSTEEL ADMIN - CORE SYSTEM
 * Handles session authentication, sidebar navigation, export/reset JSON data
 */

const AdminApp = (function () {
  const AUTH_KEY = 'winsteel_admin_logged_in';
  const DATA_CACHE_KEY = 'winsteel_db_data';

  // Check Auth on Protected Admin Pages
  function checkAuth() {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/admin/') || window.location.pathname.endsWith('/admin');
    const isLoggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';

    if (!isLoggedIn && !isLoginPage) {
      window.location.href = 'index.html';
    } else if (isLoggedIn && isLoginPage) {
      window.location.href = 'dashboard.html';
    }
  }

  // Handle Login
  function login(username, password) {
    // Configurable demo credentials
    if ((username === 'admin' || username === 'winsteel') && (password === 'admin123' || password === 'winsteel2026')) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem('winsteel_admin_user', username);
      return true;
    }
    return false;
  }

  // Handle Logout
  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('winsteel_admin_user');
    window.location.href = 'index.html';
  }

  // Fetch or Load Working Data
  async function getWorkingData() {
    const local = localStorage.getItem(DATA_CACHE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }

    const paths = ['../database/db.json', '/database/db.json', '../data/winsteel.json', '/data/winsteel.json'];
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        // try next path
      }
    }
    console.error('Error fetching base db.json from any known path');
    return null;
  }

  // Save Working Data
  function saveWorkingData(newData) {
    try {
      localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(newData));
      showToast('Changes saved successfully! Data is now live across the website.', 'success');
    } catch (err) {
      console.error('Storage error:', err);
      showToast('Warning: LocalStorage limit reached. Please export db.json.', 'error');
    }

    // Also attempt saving directly to disk if server is running
    try {
      fetch('/api/save-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      }).then(res => {
        if (res.ok) console.log('✅ Synchronized to database/db.json on disk!');
      }).catch(() => {});
    } catch (e) {}
  }

  // Export JSON file download
  async function exportJSON() {
    const data = await getWorkingData();
    if (!data) {
      showToast('No data to export!', 'error');
      return;
    }

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Downloaded db.json! Replace database/db.json and run "npm run build:data" for deployment.', 'success');
  }

  // Reset to default
  async function resetToDefault() {
    if (confirm('Are you sure you want to reset all modifications back to default database/db.json?')) {
      localStorage.removeItem(DATA_CACHE_KEY);
      showToast('Reset to base database/db.json!', 'info');
      setTimeout(() => location.reload(), 600);
    }
  }

  // Toast notifications
  function showToast(message, type = 'info') {
    let container = document.getElementById('admin-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'admin-toast-container';
      container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:10px; max-width:400px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#065F46' : type === 'error' ? '#991B1B' : '#1E40AF';
    toast.style.cssText = `background:${bgColor}; color:#FFF; padding:14px 18px; border-radius:6px; font-size:0.9rem; box-shadow:0 10px 15px -3px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:space-between; gap:12px; animation:fadeIn 0.3s ease;`;
    toast.innerHTML = `<span>${message}</span><button style="background:none; border:none; color:#FFF; cursor:pointer; font-size:1.1rem;">&times;</button>`;

    toast.querySelector('button').onclick = () => toast.remove();
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4500);
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Bind logout buttons
    document.querySelectorAll('.btn-sidebar-logout').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });

    // Bind export button
    document.querySelectorAll('[data-action="export-json"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        exportJSON();
      });
    });

    // Bind reset button
    document.querySelectorAll('[data-action="reset-json"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resetToDefault();
      });
    });

    // Sidebar Mobile Toggle
    const sidebarToggle = document.querySelector('.topbar-toggle-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  });

  return {
    login,
    logout,
    getWorkingData,
    saveWorkingData,
    exportJSON,
    resetToDefault,
    showToast
  };
})();
