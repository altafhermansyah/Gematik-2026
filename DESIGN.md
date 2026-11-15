# DESIGN.md: KarsaLoka

## Concept

KarsaLoka is a **printed field atlas** paired with a **deep-space WebGL observatory**. The editorial half borrows from a cartographic archive: numbered registers, verified evidence rows with verbatim quotes, and direct primary-source citations kept visible in the reading flow instead of hidden behind modals.

Two visual grounds, one typographic and data language (`src/app/globals.css`):

| Ground | Where | Meaning |
|---|---|---|
| Night / Cosmos (`#040914`, raised `#0B1428`, on-night `#EDF2FF`) | `/` cosmos stage, `/atlas` observatory globe, Assistant Drawer, & `1200×630` OG share banners | the observatory |
| Paper (`#ECEEE2`, raised `#F4F5EA`, ink `#16211C`) | `/cases/[slug]` case dossiers, `/atlas` filmstrip rail & detail sheet, default header/footer | the archive |

## Palette (`src/app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ECEEE2` | case dossier & paper sheet base surface |
| `--paper-raised` | `#F4F5EA` | elevated note/card surfaces |
| `--paper-sunk` | `#DDE3D2` | muted surfaces, skeletons, tracks |
| `--ink` | `#16211C` | primary text on paper, primary dark buttons |
| `--ink-soft` | `rgb(22 33 28 / 0.82)` | secondary text on paper |
| `--ink-faint` | `rgb(22 33 28 / 0.72)` | metadata, counts, timestamps |
| `--night` | `#040914` | deep-space stage (`/` & `/atlas`) |
| `--night-raised` | `#0B1428` | observatory cards, controls, OG card panels |
| `--night-sunk` | `#02050C` | recessed dark surfaces |
| `--on-night` | `#EDF2FF` | primary text on dark grounds |
| `--on-night-soft` | `rgb(237 242 255 / 0.82)` | secondary copy on dark grounds |
| `--on-night-faint` | `rgb(237 242 255 / 0.68)` | dark metadata & telemetry captions |
| `--focus` | `#1F4BFF` | keyboard focus ring on paper |
| `--focus-on-night` | `#A8B8FF` | keyboard focus ring on dark surfaces |
| Mint accent | `#5DF0A8` | cosmos highlight, observatory telemetry numerals |

**Colour is data.** Domain accents come directly from `src/content/domains.ts`:
`climate` (`#34D399`), `food` (`#FBBF24`), `health` (`#F472B6`), `education` (`#60A5FA`), `disaster` (`#FB923C`), `inclusion` (`#A78BFA`).

## Typography

- Display and metric numerals: **Bricolage Grotesque Variable** (200–800), opsz 48–96, tight tracking (`-0.045em` to `-0.052em`). Used for headlines, large metric figures, and display marks.
- Body and interface: **Familjen Grotesk Variable** (400–700), plus italic for verbatim source quotes.
- Both font families are self-hosted via `@fontsource-variable` so rendering has zero network dependency or third-party font layout shift.

## Layout

### Home (`/`, Cosmos Stage)

```text
┌ cosmos header (fixed frosted) ───────────────────────────────┐
│ KarsaLoka     Atlas 3D · Indonesia · Domain & SDG  [ID/EN] ↗ │
├──────────────────────────────────────────────────────────────┤
│ [Three.js r0.143.0 fixed WebGL Earth + clouds + orbital pins]│
│  1. Hero: Inovasi Global, Dampak Terbukti  [Jelajahi] [ID]   │
│  2. 6-Pillar Domain × UN SDGs Glass Cards                    │
│  3. Audited Telemetry: Split Copy + Interactive 3-Tab Card   │
│     (Per Domain / Target SDGs / 3 Kasus Indonesia) + 4 Stats │
│  4. Closing CTA + 3-column Cosmos footer                     │
└──────────────────────────────────────────────────────────────┘
```

Homepage counts (`16` cases, `11` countries, `41` verbatim-quoted metrics, `12` unique SDGs, and `3` Indonesian cases) are computed directly from `src/content/` on the server. All accents use solid mint (`#5DF0A8`) or `#F3F6FF` ink; gradient-clipped text (`background-clip: text`) is never used.

### Atlas (`/atlas`, Observatory & Contact Sheet)

```text
┌ night stage (#040914) ───────────────────────────────────────┐
│ header (default nav + locale switcher)                       │
│  Atlas inovasi               ╭───────────────╮               │
│  search (/) · [ID][Picks]    │  Three.js 3D  │               │
│  Bidang masalah (6 pills)    │ Earth + GLB + │               │
│  16 / 11 / 41 stats          │  domain pins  │               │
│  [putar][Indonesia][reset]   ╰───────────────╯               │
├──────────────────────────────────────────────────────────────┤
│ paper filmstrip (`AtlasCaseRail`): [card][card][card] →      │
└──────────────────────────────────────────────────────────────┘
      slide-over paper dossier (`AtlasCaseSheet`) on selection
```

- Built around a single `Three.js` (`0.143.0`) WebGL canvas (`AtlasGlobe.tsx` + `earth-builder.ts`) loading self-hosted `public/globe/planet.glb`, cloud/night-light textures, and local `public/draco/` decoders with an instant placeholder sphere during load.
- Empty filter results keep the WebGL canvas mounted and display an accessible reset-filters overlay instead of tearing down WebGL state; `webglcontextlost` and unsupported WebGL fallbacks leave the rail fully navigable.
- Mobile order keeps exploration natural: intro/controls, 3D globe, filmstrip rail, and detail sheet.

### Case Dossier (`/cases/[slug]`, Static Archive)

A focused reading column (`max-width` tuned around `64ch`) paired with a sticky metadata rail showing location, year, domain badge, UN SDGs, technology tags, metric/source counts, and section navigation. Every metric displays its figure, unit, label, a domain-colored rule beside the **verbatim quote**, and a direct link to the primary source.

### Assistant Drawer (`AssistantDrawer`)

A slide-over dark-observatory drawer mounted globally in `layout.tsx`, using Web Animations / CSS backdrop + high-contrast dark surfaces (`#0B1428` / `#EDF2FF`), domain-scoped quick prompts, bilingual UI labels, and direct clickable chips linking to relevant `/cases/[slug]` dossiers.

### Social Share Banners (`1200×630` PNG via `next/og`)

Both `/opengraph-image` (Home & Atlas) and the 16 prerendered `/cases/[slug]/opengraph-image` banners use the same Dark Cosmos `#040914` palette, 80% central safe-zone framing, domain accent hex highlights, and verified primary-metric telemetry cards for clear WhatsApp and X/Twitter (`summary_large_image`) previews.

## Motion

- Home (`/`): `Lenis` smooth scrolling drives deterministic `Three.js` Earth keyframes (`CosmosViewport.tsx`) and `IntersectionObserver` section reveals; `prefers-reduced-motion` disables smooth scroll and renders static frames cleanly.
- Atlas (`/atlas`): shortest-path camera fly-to (`PLANET_RADIUS = 1.82`), smooth inertia dragging with pitch bounds, auto-rotation that pauses on user selection, and instant snap under `prefers-reduced-motion`.
- Assistant Drawer & Case Sheet: synchronized CSS/WAAPI open and close transitions with pointer-events disabled until open and proper focus management on `Esc`.

## Accessibility

- The 3D globe is never the only navigation route: every case is reachable via `AtlasCaseRail`, an `sr-only` accessible marker list, `/cases/[slug]`, and `AssistantDrawer`.
- Keyboard support: canvas arrow keys rotate the globe, `Home` resets camera, `/` focuses search, `Esc` clears selection or closes sheets/drawers. Focus indicators use `#1F4BFF` (paper) and `#A8B8FF` (night).
- Swatches always pair with visible domain labels, never color alone; `<html lang>` dynamically tracks `?lang=id|en` via `LocaleDocumentLang`.

## Non-Goals

No `background-clip: text` gradients, no stock photography, no unverified metrics, no external CDN fonts/models, no PostgreSQL/Prisma runtime dependency, and no user signup walls.
