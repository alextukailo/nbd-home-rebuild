
export function typeText(
  element,
  text,
  duration,
  activeClass = 'typing-active'
) {
  return new Promise((resolve) => {
    const characters = Array.from(text);

    let startTime = null;

    element.classList.add(activeClass);

    function animate(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const visibleCount = Math.floor(
        progress * characters.length
      );

      element.textContent = characters
        .slice(0, visibleCount)
        .join('');

      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      element.textContent = text;
      element.classList.remove(activeClass);
      resolve();
    }

    requestAnimationFrame(animate);
  });
}
