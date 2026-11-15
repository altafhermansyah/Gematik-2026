# KarsaLoka: Project Engineering & Design Rules

> **Document status:** Mandatory project standard  
> **Last updated:** 2026-11-15  
> **Purpose:** Shared source of truth for human developers and AI coding agents  
> **Architecture:** Modular Monolith (100% Full-Local Typed Content, Zero Database, Zero Auth/Admin)  
> **Primary stack:** Next.js `16.3.8` + React `19.2.8` + TypeScript `5` (strict) + Tailwind CSS `4` + Three.js `0.143.0` + Lenis `1.3.27` + Zod `4.6.5`  
> **Project concept:** Global problem → interactive 3D atlas exploration → primary-source case dossier → evidence-grounded assistant  
> **Precedence statement:** `docs/PROJECT_CONCEPT.md` is the authority for product scope, page map, and local content entity responsibilities. `KARSALOKA_PROJECT_RULES.md` remains the authority for engineering, design, accessibility, SEO/GEO, and process rules.

---

## 0. How to Use This Document

Every human contributor and AI coding agent must treat this document as the default source of truth before creating, modifying, refactoring, or deleting code.

When another instruction conflicts with this document:

1. Follow explicit human instructions for the current task.
2. Refer to `docs/PROJECT_CONCEPT.md` for product scope and implemented routes.
3. Preserve working architecture and invariants unless the project owner explicitly approves a change.
4. Always inspect existing code and `package.json` first rather than guessing dependencies or file layouts.

---

## 1. Product Definition

### 1.1 Name

**KarsaLoka**

### 1.2 Product Idea

KarsaLoka is an interactive educational atlas that connects real-world global challenges with scientifically verified AI and field-tested technology deployments, backed by verbatim quotes and primary sources, plus an evidence-grounded assistant.

Core experience flow:

```text
GLOBAL CHALLENGES (6 DOMAINS)
      ↓
COSMOS SHOWCASE (/) & 3D OBSERVATORY GLOBE (/atlas)
      ↓
PRIMARY-SOURCE CASE DOSSIER (/cases/[slug])
      ↓
EVIDENCE-GROUNDED ASSISTANT (AssistantDrawer + /api/assistant)
```

### 1.3 Implemented Value Proposition & Boundaries

- KarsaLoka must feel like a cohesive **observatory + cartographic field archive**, never a generic AI chatbot wrapper, dashboard template, or database CRUD demo.
- Every quantitative metric displayed in UI, OG cards, JSON-LD, or `/llms.txt` must map to a verbatim quote and verifiable primary source URL.
- **Not part of this product:** end-user login/signup, PostgreSQL/Prisma, `/admin/*` panels, `/quiz`, `/paths`, `/paths/[slug]`, `@xyflow/react` skill graphs, `cobe`, `zustand`, or `framer-motion`.

---

## 2. Competition Alignment (GEMATIK VI 2026)

Theme: **"Empowering Global Innovators for an Intelligent Future"**

Visual polish must serve comprehension and source verification; technical architecture must maintain reliability without external database dependencies or mandatory external AI API keys.

---

## 3. Core Engineering Principles

1. **Production-minded by default:** No secret literals, no `any` escape hatches without documented necessity, no suppressed unhandled errors, no duplicated business rules across pages.
2. **Simplicity over cleverness:** Keep everything inside one Next.js modular monolith; avoid unnecessary external packages, global state libraries, or microservices.
3. **Single source of truth:**
   - Curated content access → `src/modules/content/store.ts`
   - Bilingual messages & copy → `src/lib/i18n/messages.ts` & `src/lib/i18n/localized.ts`
   - Visual tokens → `src/app/globals.css`
   - Assistant domain guardrails & local engine → `src/modules/assistant/local-engine.ts` & `knowledge.ts`
   - SEO metadata, JSON-LD, OG rendering, and `llms.txt` → `src/lib/seo/`
4. **Explicit over implicit:** Prefer readable modules with clear domain ownership over catch-all utility files.

---

## 4. Architecture: Modular Monolith

### 4.1 Actual Module Layout

```text
src/
├── app/
│   ├── api/assistant/           POST /api/assistant (Gemini optional + deterministic local fallback)
│   ├── atlas/                   /atlas Server Page + loading/error boundaries
│   ├── cases/[slug]/            SSG Case Dossier + /cases/[slug]/opengraph-image + loading/error/not-found
│   ├── llms.txt/ & llms-full.txt/ Static GEO text endpoints
│   ├── opengraph-image.tsx      Root 1200x630 PNG OG banner
│   ├── manifest.ts              /manifest.webmanifest
│   ├── robots.ts                /robots.txt (AI search friendly)
│   ├── sitemap.ts               /sitemap.xml
│   ├── globals.css              Design tokens & visual system
│   ├── layout.tsx               Root layout, metadataBase, SmoothScrollProvider & AssistantDrawer
│   └── page.tsx                 Cosmos Homepage (/), interactive telemetry showcase & JSON-LD
│
├── components/
│   ├── assistant/               AssistantDrawer
│   ├── atlas/                   AtlasExplorer, AtlasGlobe, AtlasCaseRail, AtlasCaseSheet
│   ├── cases/                   CaseDetailView, CaseHeader, CaseMetrics, CaseSection, CaseSources
│   ├── home/                    CosmosViewport, PlanetCanvas, InteractiveTelemetryShowcase
│   └── site/                    SiteHeader, SiteFooter, LocaleSwitch, LocaleDocumentLang,
│                                SmoothScrollProvider, GlobalNotFoundView
│
├── content/                     Strictly typed curated data (`as const satisfies ...`)
│   ├── cases/                   6 domain files (16 published case studies, 41 verified metrics)
│   ├── domains.ts               6 problem domains with hex accents
│   └── paths.ts, resources.ts, skills.ts   Internal validated legacy data modules (no UI routes)
│
├── lib/
│   ├── format.ts                Locale formatting utilities
│   ├── i18n/                    localized.ts, messages.ts, urls.ts, locale-events.ts
│   ├── motion/                  useSharedIndicator.ts
│   └── seo/                     metadata.ts, json-ld.ts, og-card.tsx, llms.ts
│
└── modules/
    ├── assistant/               knowledge.ts, local-engine.ts, types.ts
    ├── atlas/                   queries.ts, types.ts
    ├── cases/                   queries.ts, types.ts
    ├── content/                 store.ts, validate.ts, types.ts
    ├── home/                    planet-coordinates.ts
    └── three/                   earth-builder.ts (Three.js GLB/DRACO Earth loader & disposal)
```

### 4.2 Dependency Direction

Dependencies flow inward toward `src/modules/content/store.ts` and `src/content/`. UI components must stay focused on presentation/interaction and must not embed content validation logic or cross-file query duplication.

---

## 5. Next.js App Router Rules

1. **Server Components by default:** Pages (`/`, `/atlas`, `/cases/[slug]`) resolve curated data and SEO metadata on the server.
2. **Minimal client islands (`"use client"`):** Limit client components to genuine browser interactivity:
   - `PlanetCanvas` & `CosmosViewport` (Three.js + Lenis scroll synchronization)
   - `AtlasGlobe`, `AtlasExplorer`, `AtlasCaseRail`, `AtlasCaseSheet` (Three.js globe + URL-synced filtering)
   - `InteractiveTelemetryShowcase` (3-tab telemetry explorer)
   - `AssistantDrawer` (interactive slide-over drawer)
   - `CaseDetailView`, `LocaleSwitch`, `LocaleDocumentLang`, `SmoothScrollProvider`
3. **SSG Preservation on `/cases/[slug]`:** Keep `/cases/[slug]/page.tsx` and `/cases/[slug]/opengraph-image.tsx` driven by `generateStaticParams()` and `dynamicParams = false` (without `searchParams` forcing dynamic rendering on case routes). Bilingual switching on case dossiers stays instant client-side while server HTML/JSON-LD pre-renders statically.
4. **URL State:** `/atlas` filters, domain selection, search query, selected case, and locale sync cleanly via URL query parameters (`?domain`, `?country`, `?featured`, `?q`, `?case`, `?lang`).

---

## 6. TypeScript & Validation Rules

- TypeScript `strict` mode is mandatory (`npm run typecheck`). Avoid `any`, `@ts-ignore`, and `@ts-expect-error`.
- Keep domain types co-located in `src/modules/<domain>/types.ts` and `src/modules/content/types.ts`.
- Validate untrusted external payloads and bilingual content with Zod (`src/lib/i18n/localized.ts`) and build-time `assertContentIntegrity()`.

---

## 7. Local Content Store & Integrity Invariants

All content reads go through `src/modules/content/store.ts`. `assertContentIntegrity()` in `src/modules/content/validate.ts` runs automatically on first store access and build time (`generateStaticParams`):

- Unique slugs across `domains`, `cases`, `skills`, and `paths`.
- Every `PUBLISHED` case study (`16` cases across `6` domains and `11` countries, including `3` in Indonesia) must provide complete bilingual `id` and `en` fields for `title`, `summary`, `problem`, `solution`, `aiRole`, `impact`, metric `label`, and metric `unit`.
- Valid ISO-2 uppercase `countryCode`, valid `lat`/`lng` (rejecting `(0, 0)` placeholder coordinates), SDG numbers `1..17`, and `kebab-case` technology tags.
- **Audit trail rule:** Every entry in `CaseStudy.metrics` (`41` metrics total) must include a non-empty verbatim `quote` and a `sourceUrl` matching one of that case's verified entries in `sources`.

Do not fabricate statistics, impact numbers, quotes, or sources.

---

## 8. Globe & Smooth-Scroll Engine Rules (`three@0.143.0` + `lenis`)

Both `/` (`PlanetCanvas.tsx`) and `/atlas` (`AtlasGlobe.tsx`) use **`three@0.143.0`** sharing `src/modules/three/earth-builder.ts` and self-hosted static assets (`public/globe/planet.glb`, `planet-clouds.webp`, `planet-lights.webp`, and `public/draco/*`).

Required invariants:

1. **Instant fallback + non-blocking asset loading:** Render a lightweight placeholder Earth sphere immediately while GLTF/DRACO assets and textures stream in parallel; always handle WebGL unavailability and `webglcontextlost` gracefully.
2. **Coordinate accuracy:** Map `(lat, lng)` onto `PLANET_RADIUS` via `caseLatLngToSpherePoint()` in `src/modules/home/planet-coordinates.ts` (covered by unit tests).
3. **Empty filter resilience on `/atlas`:** Keep the WebGL `<canvas>` mounted when filters return `0` matches and overlay an accessible reset-filters action instead of destroying and recreating WebGL contexts.
4. **Resource & animation hygiene:** Cap devicePixelRatio cleanly (`MAX_DPR <= 1.5`), clean up `requestAnimationFrame` loops, dispose Three.js geometries/materials/textures on unmount via `disposeSceneObjects()` / `disposeMaterial()`, and respect `prefers-reduced-motion`.
5. **Lenis scroll coexistence:** Keep `SmoothScrollProvider.tsx` (`Lenis`) coordinated cleanly without conflicting native CSS `scroll-behavior: smooth` loops.

---

## 9. Asisten KarsaLoka Rules (`src/modules/assistant/` & `/api/assistant`)

1. **Strict scope guardrail:** `isQueryInDomain()` and system prompts restrict responses strictly to KarsaLoka's 16 case studies, 6 domains, 41 metrics, UN SDGs, and real-world case technologies. Explicitly reject off-topic questions and non-existent routes/features (such as `/paths` or `/quiz`).
2. **Zero external dependency requirement:** If `GEMINI_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` are absent or an upstream Gemini call fails/times out (`fetchGeminiWithTimeout`), `/api/assistant` seamlessly falls back to `generateLocalFallback()` in `src/modules/assistant/local-engine.ts`.
3. **Never leak server keys:** Read Gemini API keys exclusively inside server-side route handlers.

---

## 10. SEO, Social Share Banners (`next/og`), & GEO Rules (`src/lib/seo/`)

1. **Absolute origin normalization:** Use `getSiteOrigin()` (`NEXT_PUBLIC_SITE_URL` → `SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → `https://karsaloka.vercel.app`) for `metadataBase`, `canonical`, `alternates.languages`, `openGraph`, `sitemap.xml`, `robots.txt`, JSON-LD, and `llms*.txt`.
2. **Complete per-route OpenGraph & Twitter cards:** Every route uses `buildPageMetadata()` so child pages never strip parent `openGraph`/`twitter` properties (`summary_large_image` + `1200×630` PNG). Keep `<title>` clamped (`<= 68` chars, `<= 62` on `/cases/[slug]` before `&amp;` encoding) and `description` clamped (`<= 160` chars).
3. **OG image Satori safety (`src/lib/seo/og-card.tsx`):** Every `<div>` layout container in `ImageResponse` JSX must explicitly specify `display: "flex"` (no `grid` or `calc()`), use High-Contrast Dark Cosmos framing inside the central 80% safe-zone, and keep dynamic case cards pre-rendered via SSG (`generateStaticParams()`).
4. **JSON-LD XSS sanitization:** Serialize every inline `<script type="application/ld+json">` through `serializeJsonLd()` (`.replace(/</g, "\\u003c")`).
5. **AI crawler & GEO compliance:** Serve `/llms.txt` and `/llms-full.txt` statically with `Content-Type: text/plain; charset=utf-8` and `X-Content-Type-Options: nosniff`; keep `/robots.txt` open to AI search bots while disallowing `/api/`.

---

## 11. State Management Policy

- **Server/Build-time data:** Retrieved synchronously from `src/modules/content/store.ts`.
- **Shareable view state:** Held in URL search parameters (`?domain`, `?country`, `?featured`, `?q`, `?case`, `?lang`).
- **Ephemeral UI state:** Held in local React component state (`AssistantDrawer`, `AtlasCaseSheet`, `InteractiveTelemetryShowcase` tabs).

---

## 12. Design Tokens, Accessibility & Responsive Rules

1. **Palette & Theme (`src/app/globals.css`):**
   - Night / Cosmos stage: `--night: #040914`, `--night-raised: #0B1428`, `--on-night: #EDF2FF`, mint `#5DF0A8`.
   - Paper archive stage: `--paper: #ECEEE2`, `--paper-raised: #F4F5EA`, `--ink: #16211C`.
   - Focus rings: `--focus: #1F4BFF` (paper) and `--focus-on-night: #A8B8FF` (dark).
   - No `background-clip: text` gradient headlines; accent colors strictly represent the 6 domains from `src/content/domains.ts` plus mint `#5DF0A8`.
2. **Typography:** Self-hosted `Bricolage Grotesque Variable` (display/numerals) and `Familjen Grotesk Variable` (body/italic quotes) via `@fontsource-variable`.
3. **Accessibility:**
   - The 3D globe is never the only route to a case (`AtlasCaseRail`, `sr-only` marker list, `/cases/[slug]`, and `AssistantDrawer`).
   - Support keyboard rotation (`ArrowLeft`/`Right`/`Up`/`Down`, `Home` reset), `/` search focus, and `Esc` dismiss on sheets/drawers.
   - Pair every color indicator with text labels; sync `<html lang>` dynamically via `LocaleDocumentLang`; provide skip-to-main link (`#main`).
   - Respect `prefers-reduced-motion: reduce` across Three.js motion, Lenis scroll, and drawer transitions.

---

## 13. Security & Privacy

- Sanitize inline JSON-LD (`\u003c`), validate API request shapes in `/api/assistant`, set `X-Content-Type-Options: nosniff` on static text GEO routes, and never expose server-only environment secrets (`GEMINI_API_KEY`) to client bundles.

---

## 14. Testing, Verification & Git Discipline

### 14.1 Commands

Before completing any non-trivial change, run:

- `npm run typecheck` (`tsc --noEmit`)
- `npm test` (`node --import ./scripts/register-at-alias.mjs --test "src/**/*.test.ts"`)
- `npm run lint` (`eslint`)
- `npm run build` (`next build`: verifies `assertContentIntegrity()`, SSG pages, and OG image generation)

### 14.2 Unit Test Suites Currently Active

- `src/lib/i18n/localized.test.ts`: Bilingual resolution & Zod schema validation
- `src/lib/seo/seo.test.ts`: Origin normalization, metadata clamping, JSON-LD XSS escaping, and `llms*.txt` completeness
- `src/modules/assistant/local-engine.test.ts`: Domain guardrails, local fallback accuracy, and `?lang=en` link formatting
- `src/modules/content/validate.test.ts`: Live bundle integrity and invalid-case rejection
- `src/modules/home/planet-coordinates.test.ts`: 3D spherical coordinate placement for all 16 cases

### 14.3 Git Discipline

Use focused Conventional Commits (`feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`). Never commit `.env` secrets or re-introduce unused database scaffolding. Preserve Next.js's managed block in `AGENTS.md`.

---

## 15. Decision Log & Change Log

### Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2026-10-04 | Modular Monolith without user login | Keep complexity proportional and let visitors/judges explore without auth friction |
| 2026-10-25 | 100% Full-Local architecture (zero DB, zero `/admin/*`) | Removed PostgreSQL and Prisma; moved curated data into strictly typed `src/content/` with build-time quote/source verification |
| 2026-11-13 | Unified `Three.js` Earth (`0.143.0`) + GLB/DRACO + Cosmos Home (`Lenis`) | Replaced `cobe` and external CDNs with local `public/globe/` + `public/draco/` assets across both `/` and `/atlas` |
| 2026-11-15 | Product focus on Atlas + Evidence-Grounded Assistant + Full SEO/GEO | Removed remaining Prisma generated client, excluded `/quiz` & `/paths` from app scope, added `AssistantDrawer` + deterministic local fallback, and shipped OG banners (`next/og`), JSON-LD, `/llms.txt`, `/llms-full.txt`, `sitemap.xml`, `robots.txt`, and `manifest.webmanifest` |

### Change Log

| Version | Date | Summary |
|---|---|---|
| 2.0.0 | 2026-10-25 | Migrated to 100% full-local typed content (`src/content/`) and build-time verification (`assertContentIntegrity`) |
| 2.1.0 | 2026-11-13 | Cosmos homepage overhaul (`three@0.143.0`, `lenis`, `InteractiveTelemetryShowcase`, unified 3D globe assets) |
| 2.2.0 | 2026-11-15 | Removed Prisma remnants, resolved Lenis/drawer motion & accessibility issues, aligned Assistant domain scope without `/paths`/`/quiz`, and implemented full SEO + GEO + 17 `next/og` `1200×630` banners |
