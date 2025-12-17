document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const slider = document.querySelector('.slider');
  const container = document.querySelector('.slider-container');
  const stopCheckbox = document.getElementById('stopOnInteraction');

  if (!cards.length || !slider || !container) return;

  let currentIndex = Math.floor(cards.length / 2);
  let stopOnInteraction = stopCheckbox?.checked ?? true;
  let userInteracted = false;
  let autoplayTimer = null;
  let isHovering = false;
  let isUpdating = false;

  const AUTOPLAY_INTERVAL = 3000;
  const INACTIVE_WIDTH = 150;
  const ACTIVE_WIDTH = 260;
  const GAP = 36;

  if (stopCheckbox) {
    stopCheckbox.addEventListener('change', (e) => {
      stopOnInteraction = e.target.checked;
      if (!stopOnInteraction) {
        userInteracted = false;
        startAutoplay();
      } else if (userInteracted) {
        stopAutoplay();
      }
    });
  }

  function updateSlider() {
    if (isUpdating) return;
    isUpdating = true;

    // Update active states
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
    });

    // Calculate position using simple math (no DOM reads during animation)
    requestAnimationFrame(() => {
      const containerWidth = container.offsetWidth;
      const centerX = containerWidth / 2;
      
      // Calculate position: each card before current takes up INACTIVE_WIDTH + GAP space
      let offset = 0;
      for (let i = 0; i < currentIndex; i++) {
        offset += INACTIVE_WIDTH + GAP;
      }
      
      // Center the active card
      const translateX = centerX - (ACTIVE_WIDTH / 2) - offset;
      slider.style.transform = `translate3d(${translateX}px, 0, 0)`;
      
      isUpdating = false;
    });
  }

  function moveSlide(direction) {
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    updateSlider();
    handleInteraction();
  }

  function handleInteraction() {
    if (stopOnInteraction && !userInteracted) {
      userInteracted = true;
      stopAutoplay();
    }
  }

  function startAutoplay() {
    if (autoplayTimer || isHovering || (stopOnInteraction && userInteracted) || cards.length <= 1) return;
    autoplayTimer = setInterval(() => {
      if (!isHovering && !isUpdating) moveSlide(1);
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => moveSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => moveSlide(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    else if (e.key === 'ArrowRight') moveSlide(1);
  });

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      currentIndex = idx;
      updateSlider();
      handleInteraction();
    });
  });

  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoplay();
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    startAutoplay();
  });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSlider, 200);
  });

  // Initialize
  setTimeout(() => {
    updateSlider();
    startAutoplay();
  }, 50);
});