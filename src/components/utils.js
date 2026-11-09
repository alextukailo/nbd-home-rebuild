
export const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

export const easeInCubic = (value) => value * value * value;

export const desktopMotion = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
);

export const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

export const delay = (duration) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};
