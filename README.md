# Tejas Mundhe — Portfolio (React + Three.js + GSAP)

A Vite/React port of the portfolio: a blueprint-styled site with a persistent
Three.js scene (starfield, a black hole with a physically-inspired accretion
disk, and a solar system attached to the camera) and GSAP-driven motion.

## Setup

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Structure

```
src/
  main.jsx              entry point
  App.jsx                page composition + loader state
  index.css              design system (CSS variables, layout, components)
  data/content.js         resume content — edit this to update copy
  hooks/useFadeIn.js       scroll-triggered fade-in hook
  components/
    Loader.jsx             boot overlay, calls onDone() when finished
    Scene3D.jsx             the persistent Three.js scene (fixed canvas)
    Nav.jsx
    Hero.jsx                headline reveal + magnetic buttons
    Experience.jsx          timeline with scroll-driven progress line
    Projects.jsx / ProjectCard.jsx
    Skills.jsx
    Education.jsx
    Contact.jsx
    Footer.jsx
```

## Notes

- All resume content lives in `src/data/content.js` — edit it, no JSX changes needed.
- The 3D scene's scroll depth is controlled by `depth` in `Scene3D.jsx` (currently -24);
  the black hole sits at world y = -19, so it surfaces roughly 4/5 of the way down the page.
- `prefers-reduced-motion` is respected: rotation/orbit updates and the loader bar pause down to a near-instant fade.
