/**
 * WINSTEEL ENGINEERING WORKS - ANIMATIONS ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
});

// 1. Intersection Observer for Scroll Reveals (Up, Down & Reload Animations)
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Allow re-animating when scrolling up and down
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

// 2. Animated Counter Numbers
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseInt(el.getAttribute('data-counter-target'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic formula
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * targetNum);

          el.textContent = currentVal.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = targetNum.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => counterObserver.observe(el));
}
