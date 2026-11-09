
import {
  clamp,
  desktopMotion,
  reducedMotion,
} from './utils.js';

export function initScenes(rocket) {
  const reverseScroll = document.querySelector('#reverse-scroll');
  const slidesTrack = document.querySelector('#slides-track');

  const slides = Array.from(
    document.querySelectorAll('.reverse-slide')
  );

  const slideCount = slides.length;

  let scrollFrame = null;

  slides.forEach((slide) => {
    const cards = slide.querySelectorAll('.service-card');

    cards.forEach((card, index) => {
      card.style.setProperty('--card-index', String(index));
    });
  });

  function getSceneTop() {
    if (!reverseScroll) return 0;

    return (
      reverseScroll.getBoundingClientRect().top +
      window.scrollY
    );
  }

  function goToScene(index) {
    const target = slides[index];

    if (!target) return;

    if (!desktopMotion.matches || !reverseScroll) {
      target.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });

      return;
    }

    window.scrollTo({
      top: getSceneTop() + index * window.innerHeight,
      behavior: 'smooth',
    });
  }

  function updateSlideEntrances(slidePosition) {
    slides.forEach((slide, index) => {
      if (slide.classList.contains('is-entered')) {
        return;
      }

      const shouldEnter =
        index === 0 || slidePosition >= index - 0.65;

      if (shouldEnter) {
        slide.classList.add('is-entered');
      }
    });
  }

  function updateScene() {
    scrollFrame = null;

    if (!reverseScroll || !slidesTrack || !slideCount) {
      return;
    }

    if (!desktopMotion.matches) {
      slidesTrack.style.removeProperty('--scroll-offset');

      rocket.update(0, window.innerHeight);
      return;
    }

    const viewportHeight = window.innerHeight;
    const sceneTop = getSceneTop();

    const maxScroll = (slideCount - 1) * viewportHeight;

    const progressPx = clamp(
      window.scrollY - sceneTop,
      0,
      maxScroll
    );

    const progress =
      maxScroll > 0 ? progressPx / maxScroll : 0;

    const slidePosition = progress * (slideCount - 1);

    slidesTrack.style.setProperty(
      '--scroll-offset',
      `${progressPx}px`
    );

    updateSlideEntrances(slidePosition);
    rocket.update(progress, viewportHeight);
  }

  function scheduleSceneUpdate() {
    if (scrollFrame !== null) return;

    scrollFrame = requestAnimationFrame(updateScene);
  }

  function handleScroll() {
    rocket.handleScroll();
    scheduleSceneUpdate();
  }

  window.addEventListener(
    'scroll',
    handleScroll,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    scheduleSceneUpdate
  );

  desktopMotion.addEventListener('change', () => {
    rocket.reset();

    document.documentElement.classList.toggle(
      'motion-ready',
      desktopMotion.matches && slideCount > 0
    );

    scheduleSceneUpdate();
  });

  document
    .querySelectorAll('a[href^="#slide-"]')
    .forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        const target = document.querySelector(hash);

        if (!target) return;

        const index = slides.indexOf(target);

        if (index < 0 || !desktopMotion.matches) return;

        event.preventDefault();

        goToScene(index);

        history.replaceState(null, '', hash);
      });
    });

  updateScene();

  if (desktopMotion.matches && slideCount) {
    document.documentElement.classList.add('motion-ready');
  }
}
