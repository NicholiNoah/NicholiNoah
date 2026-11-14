document.addEventListener('click', (e) => {
  // Find the closest anchor tag if an image inside a link was clicked
  const link = e.target.closest('main a');
  if (!link) return;

  const href = link.getAttribute('href');
  const img = link.querySelector('img');

  // Check if the link points to an image file
  if (href && /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(href)) {
    e.preventDefault();

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg) return;

    // Store the element that triggered it so we can return focus later
    window.lastFocusedElement = link;

    lightboxImg.src = href;
    lightboxImg.alt = img && img.alt ? img.alt : "Enlarged artwork view";

    lightbox.removeAttribute('hidden');
    lightbox.classList.add('active');

    if (closeBtn) closeBtn.focus();
  }
});

// Lightbox Close Logic
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!lightbox) return;

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    if (window.lastFocusedElement) {
      window.lastFocusedElement.focus();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});