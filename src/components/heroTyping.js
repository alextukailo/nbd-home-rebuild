
import {
  reducedMotion,
  delay,
} from './utils.js';

import { typeText } from './typing.js';

export function initHeroTyping() {
  const hero = document.querySelector('#slide-1');

  if (!hero || reducedMotion.matches) return;

  const title = hero.querySelector('h1');

  const titleParts = Array.from(
    title?.querySelectorAll('.hero-accent') ?? []
  );

  const subtitle = hero.querySelector('h2');
  const description = hero.querySelector('p');

  if (
    !title ||
    titleParts.length !== 2 ||
    !subtitle ||
    !description
  ) {
    return;
  }

  const elements = [
    ...titleParts,
    subtitle,
    description,
  ];

  const durations = [
    250,
    450,
    600,
    1100,
  ];

  const originalTexts = elements.map((element) =>
    element.textContent.replace(/\s+/g, ' ').trim()
  );

  const layoutElements = [
    title,
    subtitle,
    description,
  ];

  layoutElements.forEach((element) => {
    const height = element.getBoundingClientRect().height;

    element.style.minHeight = `${Math.ceil(height)}px`;
  });

  title.setAttribute(
    'aria-label',
    originalTexts.slice(0, 2).join(' ')
  );

  subtitle.setAttribute(
    'aria-label',
    originalTexts[2]
  );

  elements.forEach((element) => {
    element.textContent = '';
  });

  async function play() {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    for (let index = 0; index < elements.length; index++) {
      await typeText(
        elements[index],
        originalTexts[index],
        durations[index]
      );

      if (index < elements.length - 1) {
        await delay(120);
      }
    }

    layoutElements.forEach((element) => {
      element.style.removeProperty('min-height');
    });
  }

  play();
}
