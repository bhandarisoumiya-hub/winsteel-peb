/**
 * WINSTEEL ADMIN - SETTINGS CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('admin-settings-form');
  const data = await AdminApp.getWorkingData();

  if (!form || !data) return;

  const s = data.settings || {};
  const seo = s.seo || {};

  // Fill in existing values
  document.getElementById('setting-companyName').value = s.companyName || '';
  document.getElementById('setting-tagline').value = s.tagline || '';
  document.getElementById('setting-phone').value = s.phone || '';
  document.getElementById('setting-email').value = s.email || '';
  document.getElementById('setting-address').value = s.address || '';
  document.getElementById('setting-mapsUrl').value = s.googleMapsUrl || '';

  document.getElementById('setting-facebook').value = s.facebookUrl || '';
  document.getElementById('setting-instagram').value = s.instagramUrl || '';
  document.getElementById('setting-linkedin').value = s.linkedinUrl || '';
  document.getElementById('setting-youtube').value = s.youtubeUrl || '';

  document.getElementById('setting-seoTitle').value = seo.defaultTitle || '';
  document.getElementById('setting-seoDesc').value = seo.defaultDescription || '';
  document.getElementById('setting-seoKeywords').value = seo.defaultKeywords || '';
  document.getElementById('setting-seoOgImage').value = seo.ogImage || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    data.settings = {
      ...data.settings,
      companyName: document.getElementById('setting-companyName').value.trim(),
      tagline: document.getElementById('setting-tagline').value.trim(),
      phone: document.getElementById('setting-phone').value.trim(),
      email: document.getElementById('setting-email').value.trim(),
      address: document.getElementById('setting-address').value.trim(),
      googleMapsUrl: document.getElementById('setting-mapsUrl').value.trim(),
      facebookUrl: document.getElementById('setting-facebook').value.trim(),
      instagramUrl: document.getElementById('setting-instagram').value.trim(),
      linkedinUrl: document.getElementById('setting-linkedin').value.trim(),
      youtubeUrl: document.getElementById('setting-youtube').value.trim(),
      seo: {
        defaultTitle: document.getElementById('setting-seoTitle').value.trim(),
        defaultDescription: document.getElementById('setting-seoDesc').value.trim(),
        defaultKeywords: document.getElementById('setting-seoKeywords').value.trim(),
        ogImage: document.getElementById('setting-seoOgImage').value.trim()
      }
    };

    AdminApp.saveWorkingData(data);
  });
});
