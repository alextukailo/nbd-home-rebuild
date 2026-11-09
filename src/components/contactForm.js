export function initContactForm() {
  const contactForm = document.querySelector('#demo-contact');
  const contactNotice = document.querySelector('#demo-form-notice');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactNotice?.classList.remove('hidden');
  });
}
