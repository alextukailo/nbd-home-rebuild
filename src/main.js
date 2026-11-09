
import rocketImage from './assets/images/rocket-original.webp';
import './style.css';

const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

const easeInCubic = (value) => value * value * value;

const rocketImg = document.querySelector('#rocket-image');
const rocketAnimation = document.querySelector('#rocket-animation');
const rocketExhaust = document.querySelector('#rocket-exhaust');

if (rocketImg) {
  rocketImg.src = rocketImage;
}

const menuPanel = document.querySelector('#menu-panel');
const menuDrawer = document.querySelector('#menu-drawer');
const menuBackdrop = document.querySelector('#menu-backdrop');
const openButton = document.querySelector('#menu-open');
const closeButton = document.querySelector('#menu-close');
const submenuToggle = document.querySelector('#submenu-toggle');
const servicesSubmenu = document.querySelector('#services-submenu');

let menuCloseTimer = null;
let menuOpenFrame = null;
let previousFocus = null;

function setMenuOpen(isOpen) {
  if (!menuPanel || !openButton || !closeButton) return;

  window.clearTimeout(menuCloseTimer);

  if (menuOpenFrame !== null) {
    cancelAnimationFrame(menuOpenFrame);
    menuOpenFrame = null;
  }

  if (isOpen) {
    if (!menuPanel.hidden) return;

    previousFocus = document.activeElement;

    menuPanel.hidden = false;
    menuPanel.setAttribute('aria-hidden', 'false');

    document.body.classList.add('overflow-hidden');
    openButton.setAttribute('aria-expanded', 'true');

    menuOpenFrame = requestAnimationFrame(() => {
      menuOpenFrame = null;

      if (menuPanel.hidden) return;

      menuPanel.classList.add('is-open');
      menuDrawer?.focus();
    });

    return;
  }

  if (menuPanel.hidden) return;

  if (menuPanel.contains(document.activeElement)) {
    openButton.focus({ preventScroll: true });
  }

  menuPanel.classList.remove('is-open');
  openButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');

  const finishClose = () => {
    menuCloseTimer = null;

    menuPanel.hidden = true;
    menuPanel.setAttribute('aria-hidden', 'true');
  };

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reducedMotion) {
    finishClose();
  } else {
    menuCloseTimer = window.setTimeout(finishClose, 350);
  }
}

openButton?.addEventListener('click', () => {
  setMenuOpen(true);
});

closeButton?.addEventListener('click', () => {
  setMenuOpen(false);
});

menuBackdrop?.addEventListener('click', () => {
  setMenuOpen(false);
});

submenuToggle?.addEventListener('click', () => {
  const expanded =
    submenuToggle.getAttribute('aria-expanded') === 'true';

  submenuToggle.setAttribute(
    'aria-expanded',
    String(!expanded)
  );

  if (servicesSubmenu) {
    servicesSubmenu.hidden = expanded;
  }
});

menuPanel?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (!menuPanel || menuPanel.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    setMenuOpen(false);
    return;
  }

  if (event.key !== 'Tab' || !menuDrawer) return;

  const focusable = Array.from(
    menuDrawer.querySelectorAll(
      'a[href], button:not([disabled])'
    )
  ).filter((element) => {
    return element.getClientRects().length > 0;
  });

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (
    event.shiftKey &&
    (
      document.activeElement === first ||
      document.activeElement === menuDrawer
    )
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (
      document.activeElement === last ||
      document.activeElement === menuDrawer
    )
  ) {
    event.preventDefault();
    first.focus();
  }
});

const header = document.querySelector('#site-header');
const contactSection = document.querySelector('#contact');

if (header && contactSection) {
  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      const isVisible = entry.isIntersecting;

      header.classList.toggle(
        'bg-[#234267]/95',
        isVisible
      );

      header.classList.toggle(
        'shadow-md',
        isVisible
      );
    },
    {
      root: null,
      threshold: 0,
    }
  );

  contactObserver.observe(contactSection);
}

const reverseScroll = document.querySelector('#reverse-scroll');
const slidesTrack = document.querySelector('#slides-track');

const slides = Array.from(
  document.querySelectorAll('.reverse-slide')
);

const desktopMotion = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
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
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });

    return;
  }

  window.scrollTo({
    top: getSceneTop() + index * window.innerHeight,
    behavior: 'smooth',
  });
}

function updateRocket(progress, viewportHeight) {
  if (!rocketAnimation) return;

  if (!desktopMotion.matches) {
    rocketAnimation.style.transform = '';
    rocketAnimation.style.opacity = '1';

    if (rocketExhaust) {
      rocketExhaust.style.removeProperty('--thrust');
      rocketExhaust.style.removeProperty('--flame-length');
      rocketExhaust.style.removeProperty('--flame-opacity');
    }

    return;
  }

  const slidePosition = progress * (slideCount - 1);

  const slowProgress = clamp(slidePosition / 2, 0, 1);
  const launchProgress = clamp(slidePosition - 2, 0, 1);
  const acceleration = easeInCubic(launchProgress);

  const slowDistance = viewportHeight * 0.18;
  const launchDistance = viewportHeight * 1.8;

  const translateY =
    -slowProgress * slowDistance -
    acceleration * launchDistance;

  const translateX = -acceleration * 260;

  const baseRotation = -slowProgress * 1.5;
  const launchRotation = -acceleration * 18;
  const rotation = baseRotation + launchRotation;

  const scale = 1 - acceleration * 0.08;

  rocketAnimation.style.transform = `
    translate3d(${translateX}px, ${translateY}px, 0)
    rotate(${rotation}deg)
    scale(${scale})
  `;

  rocketAnimation.style.opacity = '1';

  if (rocketExhaust) {
    const flameLength = 1 + acceleration * 1.65;

    rocketExhaust.style.setProperty(
      '--thrust',
      acceleration.toFixed(3)
    );

    rocketExhaust.style.setProperty(
      '--flame-length',
      flameLength.toFixed(3)
    );

    rocketExhaust.style.setProperty(
      '--flame-opacity',
      '1'
    );
  }
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

    updateRocket(0, window.innerHeight);
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
  updateRocket(progress, viewportHeight);
}

function scheduleSceneUpdate() {
  if (scrollFrame !== null) return;

  scrollFrame = requestAnimationFrame(updateScene);
}

window.addEventListener(
  'scroll',
  scheduleSceneUpdate,
  { passive: true }
);

window.addEventListener(
  'resize',
  scheduleSceneUpdate
);

desktopMotion.addEventListener(
  'change',
  scheduleSceneUpdate
);

document.querySelectorAll('a[href^="#slide-"]').forEach((link) => {
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

if (desktopMotion.matches && slides.length) {
  document.documentElement.classList.add('motion-ready');
}

const ignitionPlasma = rocketAnimation?.querySelector(
  '.exhaust-plasma'
);

if (
  desktopMotion.matches &&
  rocketAnimation &&
  ignitionPlasma &&
  window.scrollY < window.innerHeight * 0.2
) {
  ignitionPlasma.addEventListener(
    'animationend',
    (event) => {
      if (
        event.target === ignitionPlasma &&
        event.animationName === 'engine-ignite'
      ) {
        rocketAnimation.classList.remove('is-igniting');
      }
    },
    { once: true }
  );

  requestAnimationFrame(() => {
    rocketAnimation.classList.add('is-igniting');
  });
}

const paymentIds = [
  22,
  23,
  24,
  25,
  26,
  28,
  30,
  29,
  21,
];

const paymentTrack = document.querySelector('#payment-track');

if (paymentTrack) {
  const logos = paymentIds.map((id) => {
    const img = document.createElement('img');

    img.src =
      `https://nbd.by/assets/img/payment_systems/color-${id}.png`;

    img.alt = 'Платежная система';
    img.loading = 'lazy';

    img.className = [
      'h-12',
      'w-auto',
      'max-w-[110px]',
      'shrink-0',
      'object-contain',
    ].join(' ');

    return img;
  });

  for (let repeat = 0; repeat < 2; repeat++) {
    logos.forEach((img) => {
      paymentTrack.append(img.cloneNode(true));
    });
  }
}

const contactForm = document.querySelector('#demo-contact');
const contactNotice = document.querySelector('#demo-form-notice');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  contactNotice?.classList.remove('hidden');
});

const cookiePanel = document.querySelector('#cookie-panel');

const COOKIE_STORAGE_KEY = 'nbd-demo-cookie-choice';

if (cookiePanel) {
  let cookieChoice = null;

  try {
    cookieChoice = localStorage.getItem(
      COOKIE_STORAGE_KEY
    );
  } catch {
    cookieChoice = null;
  }

  cookiePanel.hidden = Boolean(cookieChoice);
}

const cookieActions = [
  ['cookie-all', 'all'],
  ['cookie-essential', 'essential'],
];

cookieActions.forEach(([id, value]) => {
  document
    .querySelector(`#${id}`)
    ?.addEventListener('click', () => {
      try {
        localStorage.setItem(
          COOKIE_STORAGE_KEY,
          value
        );
      } catch {
      }

      if (cookiePanel) {
        cookiePanel.hidden = true;
      }
    });
});
