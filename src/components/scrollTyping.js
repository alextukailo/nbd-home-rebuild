
import {
  reducedMotion,
  delay,
} from './utils.js';

import { typeText } from './typing.js';

export function initScrollTyping() {
  if (reducedMotion.matches) return;

  const sections = [
    document.querySelector('#slide-2'),
    document.querySelector('#slide-3'),
    document.querySelector('#slide-4'),
    document.querySelector('#contact'),
  ].filter(Boolean);

  const sequences = new Map();

  sections.forEach((section) => {
    const isContact = section.id === 'contact';

    const heading = section.querySelector(
      isContact ? '.contact-heading' : '.scene-heading'
    );

    const targets = isContact
      ? [
          heading,
          section.querySelector('.contact-intro'),
        ]
      : [
          ...section.querySelectorAll(
            '.scene-heading .hero-accent'
          ),
          section.querySelector('.scene-subheading'),
          section.querySelector(
            '.scene-copy > .scene-description'
          ),
        ];

    const elements = targets.filter(Boolean);

    if (!elements.length) return;

    const containers = [
      heading,
      ...elements.filter(
        (element) => !element.closest('.scene-heading')
      ),
    ].filter(Boolean);

    containers.forEach((element) => {
      const height = element.getBoundingClientRect().height;

      element.style.minHeight = `${Math.ceil(height)}px`;
    });

    const sequence = elements.map((element) => {
      const text = element.textContent
        .replace(/\s+/g, ' ')
        .trim();

      const duration = Math.max(
        250,
        Math.min(text.length * 6, 1100)
      );

      return {
        element,
        text,
        duration,
      };
    });

    if (heading) {
      const headingText = heading.textContent
        .replace(/\s+/g, ' ')
        .trim();

      heading.setAttribute('aria-label', headingText);
    }

    sequence.forEach(({ element }) => {
      element.textContent = '';
    });

    const trigger = section.querySelector(
      isContact ? '.contact-panel' : '.scene-copy'
    );

    if (trigger) {
      sequences.set(trigger, {
        sequence,
        containers,
      });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const config = sequences.get(entry.target);

        if (!config) return;

        observer.unobserve(entry.target);
        sequences.delete(entry.target);

        async function play() {
          for (const item of config.sequence) {
            await typeText(
              item.element,
              item.text,
              item.duration,
              'scroll-typing-active'
            );

            await delay(50);
          }

          config.containers.forEach((element) => {
            element.style.removeProperty('min-height');
          });
        }

        play();
      });
    },
    {
      root: null,
      threshold: 0.25,
    }
  );

  sequences.forEach((_, element) => {
    observer.observe(element);
  });
}
