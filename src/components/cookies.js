
const COOKIE_STORAGE_KEY = 'nbd-cookie-choice';

export function initCookies() {
  const cookiePanel = document.querySelector('#cookie-panel');

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
}
