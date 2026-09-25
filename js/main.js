/**
 * WINSTEEL ENGINEERING WORKS - MAIN SITE SCRIPTS
 * Global interactive behaviors, navigation, header scroll, quote modal
 */

document.addEventListener('DOMContentLoaded', async () => {
  initHeader();
  initMobileNav();
  initFooterYear();
  initSharedModals();
  initQuoteForm();
  await populateGlobalSettings();
});

// 1. Header scroll effect
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Mobile Hamburger Navigation
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburgerBtn || !navMenu) return;

  function toggleNav() {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', !isOpen);
  }

  hamburgerBtn.addEventListener('click', toggleNav);

  // Close when clicking any nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleNav();
    }
  });
}

// 3. Dynamic Footer Year
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 4. Modal Popups (for Certificates, Quotes, and Images)
function initSharedModals() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Global helper
  window.openWinsteelModal = function (title, contentHtml) {
    const modalTitle = modalBackdrop.querySelector('.modal-title');
    const modalBody = modalBackdrop.querySelector('.modal-body-content');
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
}

// 5. Contact / Quote Form Handling (Static Safe Validation)
function initQuoteForm() {
  const contactForms = document.querySelectorAll('.winsteel-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const subject = form.querySelector('[name="subject"]')?.value.trim() || 'Engineering Enquiry';
      const message = form.querySelector('[name="message"]')?.value.trim();

      if (!name || !email || !message) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Please fill in all required fields (Name, Email, Message).';
          statusEl.style.display = 'block';
        }
        return;
      }

      // Basic email validation regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Please enter a valid email address.';
          statusEl.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.innerHTML = `
            <strong>Thank you, ${escapeHtml(name)}!</strong><br>
            Your inquiry regarding "<em>${escapeHtml(subject)}</em>" has been compiled.<br>
            <span style="font-size:0.85rem; color:#4B5563;">(Static website notice: You can also direct this message straight to our technical desk at <a href="mailto:contact@winsteel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ', ' + phone + ')\n\n' + message)}" style="text-decoration:underline; font-weight:700;">contact@winsteel.com</a>)</span>
          `;
          statusEl.style.display = 'block';
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Enquiry Submitted</span>';
        }
      }, 700);
    });
  });
}

// 6. Populate Global Settings (Phones, Emails, Address)
async function populateGlobalSettings() {
  if (typeof WinsteelData === 'undefined') return;
  const settings = await WinsteelData.getSettings();
  if (!settings) return;

  document.querySelectorAll('[data-bind-setting]').forEach(el => {
    const key = el.getAttribute('data-bind-setting');
    if (settings[key]) {
      if (el.tagName === 'A' && key.includes('email')) {
        el.href = `mailto:${settings[key]}`;
      } else if (el.tagName === 'A' && key.includes('phone')) {
        el.href = `tel:${settings[key].replace(/\s+/g, '')}`;
      }
      el.textContent = settings[key];
    }
  });
}

// Security string escaper helper
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
