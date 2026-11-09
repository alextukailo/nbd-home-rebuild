
import rocketImage from '../assets/images/rocket-original.webp';

import {
  clamp,
  easeInCubic,
  desktopMotion,
} from './utils.js';

export function initRocket() {
  const rocketImg = document.querySelector('#rocket-image');
  const rocketAnimation = document.querySelector('#rocket-animation');
  const rocketExhaust = document.querySelector('#rocket-exhaust');

  if (rocketImg) {
    rocketImg.src = rocketImage;
  }

  let lastScrollY = window.scrollY;
  let rocketScrollPower = 0;
  let rocketFireTimer = null;

  let lastProgress = 0;
  let lastViewportHeight = window.innerHeight;

  function update(progress, viewportHeight) {
    lastProgress = progress;
    lastViewportHeight = viewportHeight;

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

    const slidePosition = progress * 3;

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
      const flameLength =
        1 +
        acceleration * 1.65 +
        rocketScrollPower * 1.3;

      const thrust =
        acceleration +
        rocketScrollPower * 1.1;

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

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);

    lastScrollY = currentScrollY;

    if (!desktopMotion.matches || scrollDelta <= 0) return;

    rocketScrollPower = clamp(
      Math.max(
        rocketScrollPower * 0.65,
        scrollDelta / 50
      ),
      0,
      1
    );

    window.clearTimeout(rocketFireTimer);

    rocketFireTimer = window.setTimeout(() => {
      rocketScrollPower = 0;
      rocketFireTimer = null;

      update(lastProgress, lastViewportHeight);
    }, 180);
  }

  function reset() {
    rocketScrollPower = 0;
    lastScrollY = window.scrollY;

    window.clearTimeout(rocketFireTimer);
    rocketFireTimer = null;

    update(lastProgress, lastViewportHeight);
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
    const onIgnitionEnd = (event) => {
      if (
        event.target !== ignitionPlasma ||
        event.animationName !== 'engine-ignite'
      ) {
        return;
      }

      rocketAnimation.classList.remove('is-igniting');

      ignitionPlasma.removeEventListener(
        'animationend',
        onIgnitionEnd
      );
    };

    ignitionPlasma.addEventListener(
      'animationend',
      onIgnitionEnd
    );

    requestAnimationFrame(() => {
      rocketAnimation.classList.add('is-igniting');
    });
  }

  return {
    update,
    handleScroll,
    reset,
  };
}
