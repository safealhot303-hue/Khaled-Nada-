# Reference-faithful wedding intro

This is a production-oriented React + TypeScript intro component built directly from the two supplied master reference images.

## What is implemented

- Full-viewport master-scene composition using the supplied reference image.
- Real accessible DOM buttons over the exact visual positions.
- Subtle pointer parallax around the envelope.
- GSAP cinematic opening timeline:
  1. button press/fade
  2. scene focus/depth push
  3. wax seal movement/release
  4. hinged flap opening
  5. invitation card emergence
  6. card camera push
  7. physical-entry style transition
- Skip works immediately and cancels the active timeline.
- No `localStorage` "seen" flag: every page load starts at the intro.
- Keyboard accessible buttons and `prefers-reduced-motion` handling.
- Responsive layout for desktop, tablet and mobile.
- Reference-derived assets are included so the implementation is faithful and replaceable later with higher-resolution originals.

## Run

```bash
npm install
npm run dev
```

## Integrate with the existing wedding site

Use the component:

```tsx
<ReferenceFaithfulIntro
  onReveal={() => {
    // Replace this with your existing site's reveal logic.
    setIntroVisible(false);
  }}
/>
```

The intro intentionally does not own the main wedding site. `onReveal()` is the integration boundary so your current site remains unchanged.

## Important fidelity note

The two supplied images are the visual specification. The full first reference is retained as the master scene so the background, lighting, flowers, ribbon, stationery, shadows and typography remain pixel-faithful. The opening sequence then crossfades into layered DOM elements made from cropped portions of the same reference photography so the envelope and card can physically animate without introducing an unrelated redesign.

The included `envelope-source.png`, `envelope-body.png`, `envelope-flap.png`, `wax-seal.png`, and `invitation-card.png` are derived from the references and are easy to swap for higher-resolution source assets later.
