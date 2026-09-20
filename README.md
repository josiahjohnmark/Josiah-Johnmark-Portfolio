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
| **All site copy, projects, links** | `src/data/content.json` — edited through the admin panel |
| Content types and validation | `src/data/schema.ts` |
| Admin panel | `src/admin/`, `api/` — see [ADMIN.md](ADMIN.md) |
| Design tokens (colour, type, spacing) | `src/index.css` — the `@theme` block |
| Page sections | `src/components/` |
| Images | `public/images/` |
| Brand assets | `public/brand/` |

**Edit content through the admin panel at `/admin`**, not inside components. Every
string on the page comes from `src/data/content.json`, which the panel writes.
See [ADMIN.md](ADMIN.md) for setup and use.

## Things to fill in

1. **GitHub and LinkedIn links** — Admin panel → Profile & contact. Instagram,
   Facebook and X are already set. Anything left empty is not rendered, so the
   site never ships a link that goes nowhere.
2. **CV** — drop the PDF into `public/`, then set the CV path in
   Profile & contact. The download buttons appear once it is set.
3. **Selah screens** — Admin panel → Projects → Selah → Screens. Drop the
   images in, then clear the "Note" field.

## Brand

The `JJ` monogram is traced vector, not a bitmap:

- `src/brand-mark.ts` — the mark as an inline vector path, rendered by the
  `Mark` component with `currentColor`. Inline so it cannot fail to load.
- `public/brand/jj-mark.svg` — the same mark as a standalone file.
- `public/brand/jj-mark-white.png` / `jj-mark-black.png` — transparent PNGs, 1024px.
- `public/favicon.svg` — theme-aware: dark mark on light browser tabs, light mark
  on dark ones. Plus `favicon-96.png`, `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png` and `site.webmanifest`.
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
