
export function initHeader() {
  const header = document.querySelector('#site-header');
  const contactSection = document.querySelector('#contact');

  if (!header || !contactSection) return;

  const observer = new IntersectionObserver(
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

  observer.observe(contactSection);
}
