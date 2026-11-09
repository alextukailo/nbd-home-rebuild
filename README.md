# NBD homepage — Tailwind reconstruction

This is a presentation-only frontend prototype based on the HTML supplied in chat and the public nbd.by homepage. It preserves the four desktop scenes and their original background image URLs, includes the original foreground rocket asset, and reimplements the downward-moving slide stack without Skrollr or jQuery.

## Start

```sh
npm install
npm run dev
```

Open http://localhost:5173. Do **not** use `sudo npm install`.

## How reverse scroll works

- On desktop (>=1024px, normal motion), `#reverse-scroll` occupies 400vh. Its sticky viewport stays on screen while `#slides-track` moves **downward** from 0 to +300vh. The next slide enters **from above**, consistent with the original source's `translate(0%,100%)` Skrollr keyframes.
- Four `.reverse-slide` panels are positioned at 0, -100vh, -200vh, -300vh.
- The rocket is a separate foreground image with its own parallax movement. Change `.rocket-image` coordinates in `src/style.css` to calibrate against screenshots.
- Mobile and reduced-motion layouts use regular vertical scrolling.
- Original per-element cloud/text Skrollr animations are not reproduced, and foreground rocket size/position still needs screenshot-based calibration.

## Important

- Referenced media still loads from https://nbd.by. This is **not offline-ready**.
- Contact form is intentionally demo-only; it does not submit to production.
- Consent controls are local-only demo UI and do not configure real tracking.
- `npm run build` generates tree-shaken Tailwind output under `dist/`.
