# Josiah Johnmark — Portfolio

Personal portfolio site. React 19 + TypeScript + Vite + Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run lint       # TypeScript check
```

## Where things live

| What | Where |
|---|---|
| **All site copy, projects, links** | `src/data/site.ts` |
| Design tokens (colour, type, spacing) | `src/index.css` — the `@theme` block |
| Page sections | `src/components/` |
| Images | `public/images/` |
| Brand assets | `public/brand/` |

**Edit content in `src/data/site.ts`, not inside components.** Every string on the
page comes from that one file.

## Things to fill in

1. **Social links** — `socials` in `src/data/site.ts`. Each one is `null` by
   default and anything left `null` is simply not rendered, so the site never
   ships a link that goes nowhere. Replace `null` with your real profile URL.
2. **CV** — drop the PDF into `public/` and set `resumeUrl` in `src/data/site.ts`.
   The download buttons appear automatically once it is set.
3. **Selah screens** — add images to `public/images/selah/`, then add a `shots`
   array to the Selah entry in `src/data/site.ts` (copy the shape of `ludoShots`)
   and remove its `note`.

## Brand

The `JJ` monogram is traced vector, not a bitmap:

- `public/brand/jj-mark.svg` — real vector paths, coloured with `currentColor`
  through a CSS mask (`.jj-mark` in `index.css`), so one file works on any
  background at any size.
- `public/brand/jj-mark-white.png` / `jj-mark-black.png` — transparent PNGs, 1024px.
- `public/favicon.svg` — theme-aware: dark mark on light browser tabs, light mark
  on dark ones.
- `public/brand/og-image.png` — social sharing preview (1200×630).

Original artwork is kept in `brand-source/`.

## Design system

Dark editorial. One accent colour, used sparingly.

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0a0a0b` | Page background |
| `--color-ink-elev` | `#121214` | Cards, media frames |
| `--color-bone` | `#f4f2ee` | Primary text |
| `--color-bone-muted` | `#a3a19c` | Body text |
| `--color-bone-faint` | `#6e6c68` | Labels, meta |
| `--color-gold` | `#d8b44a` | The single accent |

Type: **Instrument Serif** for display, **Inter Tight** for everything else, a
system monospace stack for small labels. Smallest type on the site is 11px.

Motion is deliberately minimal: one entrance fade per section, short hover
transitions, and everything collapses under `prefers-reduced-motion`.
