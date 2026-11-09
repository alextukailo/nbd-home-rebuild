
export function initPayments() {
  const paymentTrack = document.querySelector('#payment-track');

  if (!paymentTrack) return;

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

  paymentTrack.replaceChildren();

  for (let repeat = 0; repeat < 2; repeat++) {
    logos.forEach((img) => {
      paymentTrack.append(img.cloneNode(true));
    });
  }
}
