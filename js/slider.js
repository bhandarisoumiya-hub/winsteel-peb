/**
 * WINSTEEL ENGINEERING WORKS - LIGHTWEIGHT SLIDER & GALLERY
 */

const WinsteelSlider = {
  initTestimonials: function (containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = container.querySelectorAll('.testimonial-slide');
    if (cards.length <= 1) return;

    let currentIndex = 0;

    function showSlide(index) {
      cards.forEach((card, idx) => {
        card.style.display = idx === index ? 'block' : 'none';
        card.classList.toggle('active', idx === index);
      });
    }

    showSlide(0);

    // Auto rotate every 6 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      showSlide(currentIndex);
    }, 6000);
  },

  initGallery: function (mainImgSelector, thumbsSelector) {
    const mainImg = document.querySelector(mainImgSelector);
    const thumbs = document.querySelectorAll(thumbsSelector);

    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.getAttribute('data-full-img') || thumb.getAttribute('src');
        mainImg.src = newSrc;
      });
    });
  }
};
