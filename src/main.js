
import rocketImage from './assets/images/rocket-original.webp';
import './style.css';

const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

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
let previousFocus = null;

function setMenuOpen(isOpen) {
  if (!menuPanel || !openButton || !closeButton) return;

  window.clearTimeout(menuCloseTimer);

  if (isOpen) {
    previousFocus = document.activeElement;

    menuPanel.hidden = false;
    menuPanel.setAttribute('aria-hidden', 'false');

    document.body.classList.add('overflow-hidden');
    openButton.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
      menuPanel.classList.add('is-open');
      menuDrawer?.focus();
    });

    return;
  }

  if (menuPanel.hidden) return;

  if (menuPanel.contains(document.activeElement)) {
    openButton.focus();
  }

  menuPanel.classList.remove('is-open');
  openButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');

  const finishClose = () => {
    menuPanel.hidden = true;
    menuPanel.setAttribute('aria-hidden', 'true');

    const focusTarget =
      previousFocus instanceof HTMLElement
        ? previousFocus
        : openButton;

    focusTarget.focus();
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
    (document.activeElement === first ||
      document.activeElement === menuDrawer)
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last ||
      document.activeElement === menuDrawer)
  ) {
    event.preventDefault();
    first.focus();
  }
});

const header = document.querySelector('#site-header');
const reverseScroll = document.querySelector('#reverse-scroll');
const slidesTrack = document.querySelector('#slides-track');

const desktopMotion = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
);

const slideCount = 4;
let scrollFrame = null;

function updateRocket(progress, viewportHeight) {
  if (!rocketAnimation) return;

  if (!desktopMotion.matches) {
    rocketAnimation.style.transform = '';
    rocketAnimation.style.opacity = '1';

    if (rocketExhaust) {
      rocketExhaust.style.removeProperty('--flame-length');
      rocketExhaust.style.removeProperty('--flame-opacity');
    }

    return;
  }

  const slidePosition = progress * (slideCount - 1);

  const slowProgress = clamp(slidePosition / 2, 0, 1);
  const launchProgress = clamp(slidePosition - 2, 0, 1);

  const easeInCubic = (value) => value * value * value;

  const slowDistance = viewportHeight * 0.18;
  const launchDistance = viewportHeight * 1.65;

  const translateY =
    -slowProgress * slowDistance -
    easeInCubic(launchProgress) * launchDistance;

  const rotation = -slowProgress * 1.5;

  rocketAnimation.style.transform = `
    translate3d(0, ${translateY}px, 0)
    rotate(${rotation}deg)
  `;

  rocketAnimation.style.opacity = '1';

  if (rocketExhaust) {
    const thrust = easeInCubic(launchProgress);
    const flameLength = 1 + thrust * 1.4;

    rocketExhaust.style.setProperty(
      '--thrust',
      thrust.toFixed(3)
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

function updateScene() {
  scrollFrame = null;

  if (!reverseScroll || !slidesTrack) return;

  if (!desktopMotion.matches) {
    slidesTrack.style.removeProperty('--scroll-offset');

    header?.classList.toggle(
      'bg-[#234267]/95',
      window.scrollY > 40
    );

    header?.classList.toggle(
      'shadow-md',
      window.scrollY > 40
    );

    updateRocket(0, window.innerHeight);
    return;
  }

  const viewportHeight = window.innerHeight;

  const sceneTop =
    reverseScroll.getBoundingClientRect().top +
    window.scrollY;

  const maxScroll = (slideCount - 1) * viewportHeight;

  const progressPx = clamp(
    window.scrollY - sceneTop,
    0,
    maxScroll
  );

  const progress =
    maxScroll > 0 ? progressPx / maxScroll : 0;

  slidesTrack.style.setProperty(
    '--scroll-offset',
    `${progressPx}px`
  );

  updateRocket(progress, viewportHeight);

  const highlightHeader =
    progressPx > viewportHeight * 0.4;

  header?.classList.toggle(
    'bg-[#234267]/95',
    highlightHeader
  );

  header?.classList.toggle(
    'shadow-md',
    highlightHeader
  );
}

function scheduleSceneUpdate() {
  if (scrollFrame !== null) return;

  scrollFrame = window.requestAnimationFrame(updateScene);
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

document
  .querySelectorAll('a[href^="#slide-"]')
  .forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!desktopMotion.matches || !reverseScroll) {
        return;
      }

      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);

      if (!target) return;

      const index = Number(
        target.style
          .getPropertyValue('--slide-index')
          .trim()
      );

      if (!Number.isInteger(index)) return;

      event.preventDefault();

      const sceneTop =
        reverseScroll.getBoundingClientRect().top +
        window.scrollY;

      window.scrollTo({
        top: sceneTop + index * window.innerHeight,
        behavior: 'smooth',
      });

      history.replaceState(
        null,
        '',
        `#slide-${index + 1}`
      );
    });
  });

updateScene();

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
    cookieChoice = localStorage.getItem(COOKIE_STORAGE_KEY);
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
        localStorage.setItem(COOKIE_STORAGE_KEY, value);
      } catch {
        // Storage may be unavailable.
      }

      if (cookiePanel) {
        cookiePanel.hidden = true;
      }
    });
});
