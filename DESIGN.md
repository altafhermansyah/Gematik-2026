# DESIGN.md — KarsaLoka

## Concept

KarsaLoka is a **printed field atlas** that happens to be a website. The material
world it borrows from is a cartographic index: numbered registers, proportional
bars, a chronologically ordered specimen strip, and evidence slips with verbatim
quotes. The product already has that discipline in its content — every metric
carries a quote and a matching source — so the interface makes the audit trail
visible instead of hiding it in a modal.

Two grounds, one language:

| Ground | Where | Meaning |
|---|---|---|
| Paper `#ECEEE2` | case dossiers, default footer | the archive |
| Cosmos `#04060F` + `#5DF0A8` | `/` homepage cosmos stage, planet canvas, header & footer | deep-space stage |
| Night `#07120E` | `/atlas` only | the observatory |

The atlas is a deliberate tonal shift, not a second theme: the globe is the one
object that earns a dark stage.

## Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ECEEE2` | base surface |
| `--paper-raised` | `#F4F5EA` | field-note band |
| `--paper-sunk` | `#DDE3D2` | skeletons, bar tracks |
| `--ink` | `#16211C` | text, primary buttons |
| `--ink-soft` | `rgb(22 33 28 / .75)` | secondary text |
| `--ink-faint` | `rgb(22 33 28 / .62)` | metadata, counts |
| `--night` | `#07120E` | atlas stage |
| `--on-night` | `#E9EEDD` | atlas text |
| `--focus` | `#1F4BFF` | keyboard focus only |

**Colour is data.** Every hue other than ink, paper, and cobalt comes from the
six domain colours in `src/content/domains.ts`. There is no decorative accent
colour; if something is green, it is climate, and the legend says so.

## Type

- Display and numerals: **Bricolage Grotesque Variable** (200–800), opsz 48–96,
  tracking −0.045em to −0.052em. Used for headlines, metric figures, the
  oversized `ATLAS` stage word.
- Text and interface: **Familjen Grotesk Variable** (400–700), plus italic for
  verbatim source quotes.
- Both are self-hosted through `@fontsource-variable`, so the build has no
  network dependency and no layout shift from a third-party font host.
- Scale: hero `clamp(2.9rem, 8.6vw, 7.6rem)`, title `clamp(2rem, 4.4vw, 3.75rem)`,
  body `1–1.0625rem`, metadata `0.75rem`. No all-caps labels, no monospace
  labels, no eyebrow above every heading.

## Layout

### Home (Cosmos Stage)

```
┌ cosmos header (fixed frosted) ───────────────────────────────┐
│ KarsaLoka     Atlas 3D · Indonesia · Domain & SDG  [ID/EN] ↗ │
├──────────────────────────────────────────────────────────────┤
│ [Three.js r0.143.0 fixed WebGL1 Earth + orbital ring + pins] │
│  1. Hero: Inovasi Global, Dampak Terbukti  [Jelajahi] [ID]   │
│     6 Verified Field Deployment Sources                      │
│  2. 6-Pillar Domain × UN SDGs Glass Cards                    │
│  3. Audited Telemetry: Split Copy + Interactive 3-Tab Card   │
│     (Per Domain / Target SDGs / 3 Kasus Indonesia) + 4 Stats │
│  4. Closing CTA + 3-column Cosmos footer                     │
└──────────────────────────────────────────────────────────────┘
```

The homepage telemetry (`16` cases, `11` countries, `41` verbatim-quoted metrics,
`12` unique SDGs, and `3` Indonesian cases) is computed directly from
`src/content/` on the server. All accents use solid mint (`#5DF0A8`) or paper
ink (`#F3F6FF`) — high-contrast gradient text (`background-clip: text`) is
forbidden.

### Atlas

```
┌ night stage ──────────────────────────────────────────┐
│ header (inverted)                                     │
│  Atlas inovasi        ╭───────────────╮               │
│  search…              │   ATLAS word  │               │
│  [Indonesia][Picks]   │    behind     │               │
│  Bidang masalah       │    globe      │               │
│  ● Iklim        2     ╰───────────────╯               │
│  ● Pangan       2                                     │
│  16 / 11 / 41        [putar][Indonesia][reset]        │
├───────────────────────────────────────────────────────┤
│ paper filmstrip: [card][card][card] →                 │
└───────────────────────────────────────────────────────┘
      detail sheet slides in from the right (paper)
```

- The oversized `ATLAS` sits *behind* the WebGL canvas; the opaque sphere
  occludes it, producing depth without a decorative overlay.
- One canvas, one rAF loop, markers without `id` (cobe v2 rewrites a `:root`
  style node every frame when markers have ids).
- The rail is paper on night: a contact sheet laid over the instrument.
- Mobile order: intro → globe → filters → rail. The globe is never buried under
  a long filter list.

### Case dossier

A single column of argument (≤66ch) with a sticky file rail: location, year,
domain, SDGs, technologies, metric and source counts, plus an index of the six
sections. Metrics are evidence rows: large figure, label, verbatim quote with a
domain-coloured rule, and the source link. Sources are a numbered reference
list. Numbering appears only where the content is genuinely a sequence.

## Motion

- Home (`/`): `Lenis` smooth scrolling drives deterministic `Three.js` Earth keyframes (`STOPS_X`/`STOPS_Y`/`STOPS_S`) and `IntersectionObserver` section reveals (`[data-reveal]`); `prefers-reduced-motion` freezes animations and renders static Earth keyframes immediately.
- Globe (`/atlas`): `cobe` camera lerp 0.12/frame, shortest angular path, auto-rotation stops on selection, reduced-motion snaps instantly.
- Hover: rules extend, cards lift subtly on hover.
- `prefers-reduced-motion` disables rotation, smooth scroll, and transitions.

## Accessibility

- The globe is never the only route to a case: a full filmstrip, an sr-only
  marker list, and case pages exist independently.
- Keyboard: canvas arrows rotate, `Home` resets, `/` focuses search, `Esc`
  clears selection or query. Focus uses cobalt, or periwinkle on night.
- Every control has a text label or accessible name; swatches always pair with
  a domain name, never colour alone.
- WebGL failure renders a supported fallback message and leaves the rail usable.
- Skip link, `lang` synced to `?lang`, semantic headings, `<a>` for navigation.

## Non-goals

No gradient text (`background-clip: text`), no stock photography, no fake metrics,
no external CDN asset dependencies, and no auth/signup clutter. On `/atlas` and
`/cases/[slug]`, preserve crisp paper-and-ink clarity (`no glassmorphism` on
reading dossiers). Copy is plain and specific; failure and empty states say what
happened and what to do next.
