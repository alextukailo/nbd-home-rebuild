
import { reducedMotion } from './utils.js';

export function initMenu() {
  const menuPanel = document.querySelector('#menu-panel');
  const menuDrawer = document.querySelector('#menu-drawer');
  const menuBackdrop = document.querySelector('#menu-backdrop');
  const openButton = document.querySelector('#menu-open');
  const closeButton = document.querySelector('#menu-close');
  const submenuToggle = document.querySelector('#submenu-toggle');
  const servicesSubmenu = document.querySelector('#services-submenu');

  if (!menuPanel || !openButton || !closeButton) return;

  let menuCloseTimer = null;
  let menuOpenFrame = null;

  function setMenuOpen(isOpen) {
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = null;

    if (menuOpenFrame !== null) {
      cancelAnimationFrame(menuOpenFrame);
      menuOpenFrame = null;
    }

    if (isOpen) {
      if (menuPanel.classList.contains('is-open')) return;

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

    if (reducedMotion.matches) {
      finishClose();
    } else {
      menuCloseTimer = window.setTimeout(finishClose, 350);
    }
  }

  openButton.addEventListener('click', () => {
    setMenuOpen(true);
  });

  closeButton.addEventListener('click', () => {
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

  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (menuPanel.hidden) return;

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
}
