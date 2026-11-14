# KarsaLoka — Project Engineering & Design Rules

> **Document status:** Mandatory project standard
> **Purpose:** Shared source of truth for human developers and AI coding agents
> **Architecture:** Modular Monolith (100% Full-Local Content & Client Storage, Zero Database, Zero Admin Panel)
> **Primary stack:** Next.js + React + TypeScript + Tailwind CSS + Local Typed Content (`src/content/`)
> **Primary visual technology:** cobe
> **Project concept:** Global problem → innovation → personal path
> **Precedence statement:** `docs/PROJECT_CONCEPT.md` is the authority for product scope, page map, and local content entity responsibilities. `KARSALOKA_PROJECT_RULES.md` remains the authority for engineering, design, accessibility, and process rules. Where the two overlap, engineering rules in this document must stay consistent with `docs/PROJECT_CONCEPT.md`. If a conflict arises between them, stop and ask instead of choosing.

---

## 0. How to use this document

This file is the **project constitution**. Every human contributor and every AI agent must treat it as the default source of truth before creating, modifying, refactoring, or deleting code.

When another instruction conflicts with this document:

1. Follow explicit human instructions for the current task.
2. Refer to `docs/PROJECT_CONCEPT.md` as the authority for product scope, page map, and local content entity responsibilities; engineering rules in this document must stay consistent with it. If they conflict, stop and ask.
3. Preserve the architecture and invariants in this document unless the human explicitly approves a change.
4. Never make a potentially destructive architectural change silently.
5. When uncertain, inspect the existing implementation and dependencies first rather than guessing.

This document governs:

- architecture
- folder/module boundaries
- data access
- API and server-side behavior
- UI/UX
- design system
- accessibility
- responsive behavior
- performance
- security
- validation
- error handling
- testing
- Git collaboration
- AI-agent behavior
- production readiness

---

# 1. Product Definition

## 1.1 Working name

**KarsaLoka**

## 1.2 Product idea

KarsaLoka is an interactive educational platform that connects global challenges with real-world innovations and then translates user interest into a personalized learning/skill path.

Core narrative:

```text
GLOBAL PROBLEM
      ↓
EXPLORE THE ATLAS
      ↓
UNDERSTAND THE INNOVATION
      ↓
"I WANT TO HELP"
      ↓
DIAGNOSTIC QUIZ
      ↓
PERSONALIZED SKILL PATH
      ↓
LEARN + BUILD + TRACK PROGRESS
```

## 1.3 Primary value proposition

The website must not feel like:

- a generic article website
- a generic AI learning roadmap
- a portfolio with a globe decoration
- a dashboard template
- a CRUD demonstration

The globe, case studies, diagnostic system, and skill graph must form **one coherent product experience**.

## 1.4 Product principles

Every feature should satisfy at least one of the following:

- helps users understand a meaningful global problem
- helps users discover a credible innovation
- helps users understand how technology/AI contributes
- helps users identify a meaningful role for themselves
- helps users take the next concrete learning/building step

Avoid features that exist only because they are technically impressive.

---

# 2. Competition Constraints

The official competition guideline states that the website must follow the theme **"Empowering Global Innovators for an Intelligent Future"**, be original, and contain informative, educational, and theme-relevant content. The guideline permits static and dynamic web implementations, including React and other frameworks. See the supplied guideline, section C.

The judging weights are:

| Criterion | Weight |
|---|---:|
| Theme relevance | 20% |
| Design & creativity | 20% |
| Functionality & technology | 25% |
| Content & informative value | 15% |
| Demo video & documentation | 10% |
| Finalist presentation | 10% |

These weights are stated in section D of the supplied guideline.

Therefore, technical architecture must never sacrifice usability and storytelling, while visual polish must never replace actual functionality.

---

# 3. Non-Negotiable Engineering Principles

## 3.1 Production-minded by default

All code must be written as if it could be deployed to production immediately.

Do not:

- leave temporary hacks in the main path
- hardcode secrets
- suppress errors without handling them
- use `any` as a convenience escape hatch
- duplicate business logic across components
- fetch the same data repeatedly without reason
- create unnecessary client-side state
- add dependencies for trivial functionality

## 3.2 Simplicity over cleverness

Prefer the simplest architecture that satisfies the requirement.

Do not introduce:

- microservices
- event buses
- message queues
- GraphQL
- unnecessary global state
- unnecessary caching layers
- custom abstraction frameworks

unless a measured project requirement justifies them.

This project is a **modular monolith**, not a microservice system.

## 3.3 Single source of truth

A concept, business rule, or data model must have one authoritative implementation.

Examples:

- status definitions → one domain/constants source
- quiz scoring rules → one scoring module
- local content access → `src/modules/content/store.ts`
- design tokens → central theme/tokens
- validation schemas → central schema per domain/use case

## 3.4 Explicit over implicit

Code should be easy for another developer or AI agent to understand without reverse engineering hidden behavior.

Prefer descriptive names and small modules over clever one-liners.

---

# 4. Architecture — Modular Monolith

## 4.1 Architectural model

The application is a **modular monolith**:

```text
                  Next.js Application
                          │
         ┌────────────────┼────────────────┐
         │                │                │
       Atlas            Cases           Paths
         │                │                │
       Quiz           Resources        Progress
         │                │                │
         └────────────────┼────────────────┘
                          │
                    Shared Kernel
                          │
          Local Typed Content (src/content/)
```

Modules live in one deployable application backed by version-controlled local content (`src/content/`), with separated responsibilities. Visitors never log in; path progress, bookmarks, and quiz results live in the browser (`localStorage` through Zustand `persist`). There is no external database and no admin panel.

## 4.2 Suggested module boundaries

```text
src/
├── app/
│   ├── atlas/
│   ├── cases/
│   │   └── [slug]/
│   ├── paths/
│   │   └── [slug]/
│   └── quiz/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── atlas/
│   ├── cases/
│   ├── paths/
│   └── quiz/
│
├── content/
│   ├── types.ts
│   ├── domains.ts
│   ├── skills.ts
│   ├── resources.ts
│   ├── paths.ts
│   └── cases/
│       └── index.ts
│
├── modules/
│   ├── content/
│   │   ├── store.ts
│   │   └── validate.ts
│   ├── atlas/
│   │   ├── queries.ts
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── cases/
│   ├── paths/
│   ├── quiz/
│   │   ├── questions.ts
│   │   ├── scoring.ts
│   │   └── types.ts
│   └── progress/
│       └── store.ts
│
├── lib/
│   ├── i18n/
│   ├── validation/
│   ├── utils/
│   └── constants/
│
├── hooks/
└── styles/
```

This is a target structure, not permission to blindly restructure the repository. Preserve working code and migrate incrementally.

## 4.3 Module dependency rule

Dependencies should generally flow inward:

```text
UI
 ↓
Application/use-case logic
 ↓
Domain logic
 ↓
Content access (src/modules/content/store.ts)
 ↓
Local typed content (src/content/)
```

A UI component must not contain complicated query/filtering business rules.

A content query module must not know about visual concerns.

A reusable UI component must not depend on a specific content entity unless it is explicitly a domain component.

## 4.4 Forbidden architecture patterns

Do not:

- put all logic inside `page.tsx`
- create a giant `utils.ts`
- create a giant `api.ts` for unrelated domains
- bypass `src/modules/content/store.ts` inside reusable presentational components
- duplicate the same data transformation in multiple pages
- import an internal module's private implementation from another module
- use circular module dependencies
- create a catch-all `helpers/` directory with no domain ownership

---

# 5. Next.js Rules

## 5.1 Server Components by default

Use React Server Components by default.

Use `"use client"` only when the component actually requires:

- browser APIs
- local interactive state
- event handlers
- animation libraries requiring client execution
- WebGL/canvas
- client-only state management

Examples that are naturally client-side:

- cobe globe
- React Flow graph
- interactive quiz controls
- drag interactions
- client-side animation requiring runtime state

## 5.2 Keep client boundaries small

Do not mark an entire page `"use client"` just because one child is interactive.

Prefer:

```text
Server Page
  ├── Server content
  ├── Server data
  └── Client interactive island
```

## 5.3 Data fetching

Prefer server-side data fetching when data does not require browser state.

Avoid:

```text
page → useEffect → fetch → loading
```

when the data can be loaded directly on the server.

Prefer server-side retrieval and pass the minimum required serialized data to client components.

## 5.4 Route handlers / server actions

Choose the smallest appropriate mechanism.

Use Server Actions for mutations that naturally belong to the application UI.

Use Route Handlers when a real HTTP endpoint is needed, including:

- external integrations
- public API contracts
- webhooks
- endpoints consumed outside a Server Component tree

Do not create an API route merely to fetch data for a Server Component that can query the server directly.

## 5.5 URL state

Filters, search terms, sorting, and shareable view configuration should use URL parameters when appropriate.

Example:

```text
/atlas?region=southeast-asia&field=climate
```

This improves:

- shareability
- navigation
- back/forward behavior
- reproducibility
- SEO where relevant

---

# 6. TypeScript Rules

## 6.1 Strict typing

TypeScript strict mode is mandatory.

Avoid:

```ts
any
as any
// @ts-ignore
// @ts-expect-error
```

unless there is a documented technical reason and the workaround is isolated.

## 6.2 Types belong near their domain

Do not create one enormous global types file.

Prefer:

```text
modules/cases/types.ts
modules/paths/types.ts
modules/quiz/types.ts
```

## 6.3 Runtime validation

TypeScript types do not validate runtime input.

All externally supplied or user-controlled input must be validated with Zod or equivalent runtime schemas.

Validate:

- form submissions
- query parameters when structurally important
- route parameters where needed
- persisted `localStorage` state on rehydration
- local content invariants via `assertContentIntegrity()`

---

# 7. Local Content Store & Integrity Rules (`src/content/` & `src/modules/content/`)

## 7.1 Full-local content architecture (Zero Database)

Since the 2026-10-25 architectural migration, KarsaLoka operates **100% locally without PostgreSQL, Prisma, or any external database**:

- All curated entities (`Domain`, `CaseStudy`, `Skill`, `Resource`, `LearningPath`) live as strictly typed TypeScript modules (`as const satisfies ...`) inside `src/content/`.
- All read operations go through the single access point `src/modules/content/store.ts` (`getDomains()`, `getPublishedCases()`, `getPublishedCaseBySlug()`, `getPaths()`, `getSkills()`, `getResourcesBySkill()`).
- Do not re-introduce Prisma, database drivers, or runtime SQL queries.

## 7.2 Build-time integrity verification (`assertContentIntegrity`)

`src/modules/content/validate.ts` enforces cross-entity invariants automatically when `src/modules/content/store.ts` is first accessed (including during `generateStaticParams` at `next build` time):

- Unique `slug` values across `domains`, `cases`, `skills`, and `paths`.
- Every `PUBLISHED` case must have non-empty bilingual text (`id` and `en`) for `title`, `summary`, `problem`, `solution`, `aiRole`, and `impact`, and at least one verifiable entry in `sources`.
- Valid ISO-2 uppercase `countryCode`, valid `lat` (`-90..90`) and `lng` (`-180..180`), and no placeholder `(0, 0)` coordinates.
- Every metric in `CaseStudy.metrics` must include a non-empty verbatim `quote` and a `sourceUrl` that matches one of the case's `sources`.
- All `LearningPath.edges` must form a valid DAG (no cycles) connecting skills present in that path.

---

# 8. Domain Rules

## 8.1 Core domain entities (Local Typed Modules)

```text
Domain (6 domains) 1──∞ CaseStudy (curated cases with embedded sources & metrics)
CaseStudy ∞──∞ LearningPath            (via CaseStudy.paths: CasePathLink[])
LearningPath 1──∞ PathNode ∞──1 Skill 1──∞ Resource
PathNode ∞──∞ PathNode                 (via LearningPath.edges: [fromSlug, toSlug][])
```

Entity responsibilities:

| Entity | Location | Responsibility |
|---|---|---|
| `Domain` | `src/content/domains.ts` | 6 problem domains (`climate`, `food`, `health`, `education`, `disaster`, `inclusion`) with bilingual names and 6-digit hex colors. |
| `CaseStudy` | `src/content/cases/*.ts` | Bilingual case study narratives, coordinates (`lat`, `lng`, `countryCode`, `region`), `sdgs`, `technologies`, audited `metrics` (with verbatim `quote` + `sourceUrl`), and `sources`. |
| `LearningPath` | `src/content/paths.ts` | Learning roadmaps with ordered `nodes` (`PathNode[]`) and prerequisite `edges` (`[fromSkillSlug, toSkillSlug][]`). |
| `Skill` | `src/content/skills.ts` | Reusable skill definitions referenced by path nodes and resources. |
| `Resource` | `src/content/resources.ts` | Curated learning materials linked to skills by `skillSlug`. |

## 8.2 Case content quality

Every case must have verifiable sources.

Do not fabricate:

- statistics
- impact numbers
- organization claims
- geographic details
- scientific claims
- citations

Content should distinguish clearly between:

- factual evidence (backed by verbatim `quote` + `sourceUrl`)
- interpretation
- editorial explanation

## 8.3 Content scope

Target:

- **16 curated `PUBLISHED` cases** across all 6 domains and 11 countries (including 3 credible Indonesian case studies and **41 verified metrics**)
- 6 problem domains
- curated skill paths (`3` paths), skills (`14` skills), and resources (`26` resources)

Quality and verifiability beat quantity.

---

# 9. Atlas / Globe Rules

## 9.1 cobe

Use **cobe** (`cobe@2.x`) as the primary interactive explorer globe on `/atlas`.

Do not install or introduce another globe engine unless explicitly approved.

> **Homepage exception (2026-11-13):** `/` uses self-hosted `three@0.143.0` (`WebGL1Renderer` in `PlanetCanvas.tsx`) and `lenis` with local `public/globe/` + `public/draco/` assets and WebGL fallback for the GEMATIK VI deep-space showcase. Keep `cobe@2.0.1` on `/atlas` (`AtlasGlobe.tsx`), and avoid `react-globe.gl` and `react-three-fiber`.

## 9.2 Globe responsibilities

The globe must provide meaningful exploration:

- markers represent real cases
- marker selection maps to a case
- filtering affects displayed cases
- search can narrow results
- selected state is visible
- interaction remains usable on touch devices

## 9.3 Animation & cobe 2.x technical invariants

Animations must remain efficient:

- `cobe@2.x` has no `onRender` callback option; rotation is driven by a `requestAnimationFrame` loop calling `globe.update({ phi, theta })`.
- The `width` and `height` options passed to cobe are in logical CSS pixels; cobe multiplies by `devicePixelRatio` itself. Do not pre-multiply width or height by `devicePixelRatio`.
- Cap `devicePixelRatio` at 2 to maintain smooth performance and bounded memory on high-DPI displays.
- Clean up the `requestAnimationFrame` loop and call `globe.destroy()` on component unmount.
- Do not create competing animation loops for the same globe.

## 9.4 Marker visibility

Markers behind the globe should not remain interactable.

Do not rely exclusively on CSS Anchor Positioning for essential functionality.

There must be a fallback for browsers where anchor positioning is unavailable or unreliable.

Fallback examples:

- side list of cases
- selected case panel
- accessible list view

## 9.5 Accessibility

The globe is a visualization, not the only navigation mechanism.

Users must be able to reach cases without interacting with the 3D globe.

Keyboard-accessible alternatives are mandatory.

## 9.6 Performance

Avoid rendering hundreds of unnecessary HTML markers.

Render only the cases relevant to the current view/filter where possible.

Avoid high-frequency React state updates inside the animation loop.

---

# 10. Skill Graph Rules

Use `@xyflow/react` for the interactive path visualization.

## 10.1 Graph semantics

Nodes must represent meaningful learning/building units.

Edges must represent actual relationships such as prerequisites or progression.

Do not connect nodes merely to make the graph visually interesting.

## 10.2 Node states

At minimum:

```text
LOCKED
AVAILABLE
IN_PROGRESS
COMPLETED
```

State must have both:

- visual distinction
- accessible textual meaning

## 10.3 Mobile behavior

A dense graph should not become an unusable miniature on mobile.

Provide an alternative list/timeline representation when necessary.

---

# 11. Quiz & Recommendation Engine

## 11.1 Quiz as code

The diagnostic quiz lives entirely in code:

- Questions, options, and weights live in `modules/quiz/` as typed data (`questions.ts`); scoring is a pure function (`scoring.ts` / `recommendPath()`) with comprehensive unit tests.
- Use deterministic, rule-based scoring.
- Do not make an external LLM/API a critical dependency for the core quiz. Core functionality must work offline from external AI services.
- Every path and skill slug referenced by the quiz must exist in `src/content/paths.ts` and `src/content/skills.ts` and be verified by `assertContentIntegrity()`.

## 11.2 Scoring

Scoring rules must be:

- explicit
- deterministic
- testable
- explainable
- stored in one domain module (`modules/quiz/scoring.ts`)

## 11.3 Recommendation transparency

The result page should explain the recommendation in plain language.

Example:

```text
You were recommended this path because you showed strong interest in:
Climate + Data + Building
```

Avoid pretending that a simple score is advanced artificial intelligence.

---

# 12. State Management

Use Zustand only for genuinely shared client state and client-side persistence.

Do not place server data into Zustand by default.

Prefer:

```text
URL state → filters/search, selected case
Server data → Server Components / server cache
Local state → component state
Cross-cutting client state → Zustand
Client-side persistence → Zustand persist (localStorage)
```

Avoid making Zustand the application's universal data store.

## 12.1 Client-side progress (Zustand `persist`)

Visitors never log in. Path progress, bookmarks, and quiz results live in the browser (`localStorage` through Zustand `persist`), never in the database:

- Use a versioned storage key (for example `karsaloka:v1:...`).
- Validate data with Zod on rehydrate; discard and reset on invalid or outdated data instead of crashing.
- No `localStorage` access during server rendering or before hydration; avoid hydration mismatches.
- Provide a visible "reset progress" action in the UI.
- Progress is keyed by stable identifiers (path slug and node id/skill slug), never array positions.
- Never block core content behind stored state.

---

# 13. UI/UX Design Constitution

## 13.1 Desired visual identity

The visual direction is:

**Editorial + Cartographic + Futuristic + Human**, not “generic AI SaaS”.

Suggested foundation:

- dark navy / ink as a structural base
- warm amber/yellow as a meaningful accent
- restrained neutral surfaces
- typography with editorial character for major display text
- highly readable grotesk/sans-serif for interface content

Color values must be centralized as design tokens.

> **Cosmos Homepage palette note (2026-11-13):** `/` extends the palette with `--cosmos-bg: #04060f`, `--cosmos-ink: #f3f6ff`, `--cosmos-muted: #a6b2d0`, `--cosmos-accent: #5df0a8`, and translucent glass surfaces (`rgba(12, 18, 38, .62)`) layered over the 3D Earth canvas — using solid colors without gradient-clipped text. `/atlas` keeps dark `#07120e` (`--night`), and `/cases/[slug]` keeps paper `#ECEEE2` (`--paper`).

## 13.2 Anti-AI-slop rules

The following patterns are **not default design solutions** and should be treated as red flags:

- generic purple/blue gradients
- gradient text everywhere
- a tiny pill/badge above every hero headline
- excessive glassmorphism
- giant floating rounded rectangles without purpose
- every element inside a card
- excessive `rounded-full`
- enormous soft drop shadows
- glowing borders around everything
- random blurred blobs
- decorative 3D objects unrelated to the product
- huge centered text with little information
- repetitive bento-card layouts
- “AI” visual clichés such as sparkles everywhere
- identical card grids for every section
- excessive black/white contrast with no hierarchy
- animations on every element

These patterns may be used only when they have a clear product/brand rationale.

## 13.3 Hero section rule

The hero must communicate:

1. what the product is
2. why it matters
3. what the user can do

Do not automatically use:

```text
[small pill]
BIG TITLE
subtitle
[button] [button]
```

This is one of the most common AI-generated landing-page patterns and should not become the project's visual grammar.

## 13.4 Visual hierarchy

Hierarchy should be established through:

- typography
- scale
- spacing
- composition
- contrast
- information grouping

not through endless cards, shadows, and borders.

## 13.5 Typography

Use a deliberate typographic system.

Define:

- display scale
- heading scale
- body scale
- metadata scale
- line heights
- letter spacing

Do not randomly assign text sizes section by section.

## 13.6 Spacing

Use a consistent spacing scale.

Do not use arbitrary values everywhere.

When a special value is genuinely necessary, document why.

## 13.7 Border radius

Do not make every component maximally rounded.

Radius should communicate hierarchy:

- small controls: subtle radius
- surfaces/cards: moderate radius
- buttons: deliberate shape
- circular elements: only when semantically circular

## 13.8 Shadows

Use shadows sparingly.

Prefer elevation through:

- contrast
- borders
- layering
- whitespace

before heavy blur shadows.

## 13.9 Motion

Motion should explain relationships and state changes.

Good:

- globe → selected case transition
- case → related path transition
- graph node state change
- section entrance when it supports reading flow

Bad:

- constant floating animation
- excessive parallax
- animation purely to impress
- long delays before content becomes usable

Respect `prefers-reduced-motion`.

---

# 14. Responsive Design Rules

Responsive design is not “desktop shrunk down”.

Design from content constraints.

Minimum expectation:

```text
mobile
↓
tablet
↓
small laptop
↓
desktop
↓
large desktop
```

## 14.1 Every interactive feature must have a mobile strategy

Especially:

- globe
- filters
- case detail
- quiz
- graph
- path / progress view

## 14.2 Touch targets

Interactive controls must be comfortably tappable.

Avoid tiny icon-only controls without accessible labeling.

## 14.3 Overflow

Never solve responsive problems by blindly using:

```css
overflow-x: hidden;
```

If overflow is hidden, determine why it exists first.

---

# 15. Accessibility Rules

Target WCAG-aligned behavior.

Mandatory basics:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible names for icon buttons
- correct heading hierarchy
- sufficient contrast
- form labels
- error messages connected to inputs
- reduced-motion support
- no critical information conveyed by color alone
- accessible alternatives for the globe and graph

Do not use ARIA to compensate for invalid semantic HTML when a native element can solve the problem.

Prefer:

```html
<button>
```

over clickable `div`s.

---

# 16. Performance Constitution

Performance is a product requirement, not post-processing.

## 16.1 Core goals

Aim for:

- fast initial render
- low JavaScript shipped to the browser
- minimal hydration
- stable layout
- efficient image loading
- zero-latency local content queries
- minimal client state
- controlled animation costs

## 16.2 JavaScript

Do not import a large package to replace a few lines of native logic.

Do not move server logic into the client without a reason.

Lazy-load heavy interactive modules when appropriate.

## 16.3 Images

Use Next.js image optimization where applicable.

Specify dimensions/aspect ratios to reduce layout shift.

Do not ship oversized source images when smaller assets are sufficient.

## 16.4 Fonts

Use a deliberate font strategy.

Avoid loading unnecessary font families and weights.

## 16.5 Animation performance

Prefer transforms and opacity for frequently animated elements.

Avoid causing layout recalculation on every animation frame.

## 16.6 Data fetching

Do not repeatedly fetch the same server data from multiple client components.

Do not refetch merely because a component re-rendered.

## 16.7 Rendering budget

For each new feature, ask:

> Can this be server-rendered?
>
> Can this be static or cached?
>
> Can this be lazy-loaded?
>
> Can this be reduced to fewer DOM nodes?
>
> Can this avoid continuous JavaScript work?

---

# 17. Loading, Empty, Error, and Success States

Every meaningful interactive feature must define:

```text
Loading /Fallback
Empty
Error
Success
```

Do not design only the happy path.

Examples:

### Atlas
- WebGL initialization / fallback state
- no cases match filter (empty state with reset filter action)
- successful marker selection & camera focus

### Quiz
- loading quiz
- validation error
- incomplete submission
- result

---

# 18. Error Handling

Errors must be handled at the correct layer.

## 18.1 User-facing errors

Use actionable language.

Bad:

```text
Something went wrong.
```

Better:

```text
We couldn't load the atlas right now. Please try again.
```

## 18.2 Developer-facing diagnostics

Log useful contextual information server-side without exposing secrets or sensitive data to users.

## 18.3 Do not swallow errors

Never use empty catches such as:

```ts
try {
  ...
} catch {
}
```

unless the ignored failure is explicitly intentional and documented.

---

# 19. Security Rules

Assume every client input (URL query parameters, `localStorage` payloads) is untrusted.

Mandatory:

- validate and normalize query inputs server-side
- validate `localStorage` payloads on rehydration before use
- never expose secrets to client bundles
- keep any environment configuration in environment variables
- do not commit `.env` files containing secrets
- sanitize/encode user-controlled content where applicable
- apply least privilege

Client-side checks are UX checks, not security controls.

---

# 20. Zero-Authentication & No-Admin-Panel Policy

Since the 2026-10-25 architectural decision, KarsaLoka uses **zero authentication and has no admin panel (`/admin/*`)**:

- Visitors and learners never log in; there are no end-user accounts, user profiles, or public registration.
- Curated content (`domains`, `cases`, `skills`, `resources`, `paths`) is authored directly in version-controlled TypeScript files under `src/content/` and validated at build time via `assertContentIntegrity()` in `src/modules/content/validate.ts`.
- Do not introduce `/admin/*` routes, `AdminUser` tables, session cookies, or password-hashing flows.

---

# 21. SEO & Metadata

Public case pages should have meaningful metadata.

Use:

- descriptive page titles
- descriptions
- canonical URLs where appropriate
- Open Graph metadata
- meaningful URLs/slugs
- semantic content hierarchy

Example:

```text
/cases/rainforest-restoration
```

is preferable to:

```text
/cases/17
```

---

# 22. Content & Editorial Rules

## 22.1 Writing style

Content should be:

- concise
- evidence-based
- understandable to students
- globally relevant
- technically credible
- visually scannable

## 22.2 Avoid fake authority

Do not use phrases such as:

- “revolutionary”
- “game-changing”
- “cutting-edge”
- “powered by advanced AI”

unless they are actually justified.

## 22.3 Sources

Case studies require verifiable sources.

Source links should be stored as data, not hardcoded in random JSX locations.

---

# 23. Component Design Rules

## 23.1 Component size

A component is not bad merely because it is large, but extract a component when it has a distinct responsibility.

Examples:

```text
AtlasGlobe
AtlasFilters
AtlasCasePanel
CaseHero
CaseProblem
CaseInnovation
CaseImpact
SkillGraph
SkillNode
QuizQuestion
QuizResult
```

## 23.2 Reusable UI

Generic primitives belong in `components/ui`.

Examples:

- Button
- Input
- Select
- Dialog
- Tooltip
- Tabs
- Skeleton

Domain-specific components must not be forced into generic UI primitives.

## 23.3 Props

Prefer explicit props.

Avoid components receiving enormous configuration objects when a smaller API is clearer.

---

# 24. Styling Rules — Tailwind

Use Tailwind for application styling where it fits the project.

Use `clsx` + `tailwind-merge` for conditional class composition.

Avoid:

- long duplicated class strings everywhere
- arbitrary values without reason
- inline styles for static styling
- duplicated style variants

Create variants/primitives when the pattern is genuinely repeated.

Do not abstract every 3-line className into a component.

---

# 25. Naming Conventions

Use predictable naming.

### Files

```text
PascalCase.tsx     React component
kebab-case.ts      utilities/modules where appropriate
```

Follow the existing repository convention if already established.

### Variables/functions

Use descriptive camelCase.

### Local Content Entities

Keep entity and field naming consistent with `src/content/types.ts`.

### Routes

Use lowercase semantic URLs.

---

# 26. Constants & Configuration

Do not scatter magic numbers or strings.

Examples that should have a named constant/config:

- quiz scoring weights
- pagination limits
- animation durations
- map/globe configuration
- feature flags
- maximum upload size

Environment-specific configuration belongs in environment variables or a dedicated config layer.

Never expose server-only environment variables to client code.

---

# 27. Testing Strategy

Testing should prioritize business-critical behavior.

Minimum target:

```text
Unit tests
  → scoring engine
  → content integrity validation (assertContentIntegrity)
  → important domain query/projection functions

Integration tests
  → content store & bilingual localization mapping
  → static route generation (generateStaticParams)

E2E tests
  → atlas → case → quiz → path
```

Do not spend more testing effort on decorative animation than on business logic.

---

# 28. Git & Collaboration Rules

## 28.1 Branching

Prefer focused branches:

```text
feature/atlas-filter
feature/case-detail
feature/quiz-engine
fix/globe-marker
refactor/case-data
```

## 28.2 Commits

Commits should describe one logical change.

Good:

```text
feat(atlas): add case filtering
fix(globe): prevent marker interaction behind globe
refactor(paths): extract scoring rules
```

Bad:

```text
update stuff
fix everything
final final
```

## 28.3 Pull/merge discipline

Before merging:

- run type check
- run lint
- run relevant tests
- verify build when the change is architectural
- inspect the diff

---

# 29. Multi-Developer Rules

Before modifying a shared area, determine ownership.

Suggested responsibility split:

```text
Developer A
├── visual system
├── globe
├── motion
└── skill graph

Developer B
├── local content store (src/content/)
├── domain logic
├── quiz
└── content verification
```

These are ownership defaults, not permanent silos.

Do not modify another contributor's major feature without checking the current state first.

When integrating changes:

1. inspect current code
2. identify overlapping edits
3. preserve compatible work
4. resolve conflicts deliberately
5. run validation

Never replace an entire file merely because only one small section needs modification.

---

# 30. AI Coding Agent Constitution

This section is mandatory for every coding agent.

## 30.1 Before coding

The agent MUST:

1. inspect the repository structure
2. inspect `package.json`
3. inspect relevant configuration files
4. inspect the existing module before modifying it
5. inspect `src/content/types.ts` and `src/modules/content/store.ts` when touching data
6. inspect existing related components/hooks/services
7. identify current conventions
8. determine whether a new dependency is actually necessary

Never assume the repository matches the agent's preferred architecture.

## 30.2 Planning before implementation

For any non-trivial task, the agent should internally determine:

```text
Requirement
 ↓
Affected modules
 ↓
Data changes
 ↓
Server/client boundary
 ↓
UI states
 ↓
Performance implications
 ↓
Security implications
 ↓
Tests/verification
```

Then implement the smallest coherent change.

## 30.3 Minimal-diff principle

Modify only what is necessary.

Do not:

- reformat unrelated files
- rename unrelated variables
- rewrite working components
- migrate the whole architecture during a feature task
- remove code without understanding its purpose

## 30.4 No speculative features

Do not add features that were not requested merely because they “would be nice”.

Examples:

- unnecessary analytics
- notification systems
- extra authentication flows
- AI chatbot
- CMS
- complicated caching
- microservices

unless the project owner explicitly requests them.

## 30.5 Dependency discipline

Before installing a package, answer:

1. Is native functionality insufficient?
2. Is an existing dependency already capable of solving it?
3. Is the package maintained and appropriate?
4. What bundle/performance cost does it introduce?
5. Does it introduce architectural coupling?

Do not install duplicates of capabilities already present.

## 30.6 Generated code quality

AI-generated code must look like code maintained by a competent professional team.

Avoid:

- repetitive boilerplate
- redundant comments
- fake abstractions
- unnecessary interfaces
- excessive defensive checks with no value
- giant components
- giant hooks
- giant utility files
- duplicated literals
- placeholder data left in production paths

## 30.7 Comments

Comments should explain **why**, not restate **what** the code does.

Bad:

```ts
// Set loading to true
setLoading(true)
```

Good:

```ts
// Keep the previous result visible while recalculating recommendations
// to avoid a distracting blank state during the transition.
```

## 30.8 Do not silently make architectural decisions

The agent must flag changes involving:

- local content schema (`src/content/types.ts`) redesign
- public route contract
- major dependency replacement
- routing architecture
- state architecture
- deployment architecture
- destructive migration

These require explicit project-owner approval.

---

# 31. AI Agent Output Protocol

When asked to implement a feature, the agent should structure its work as:

```text
1. Understand
2. Inspect
3. Plan
4. Implement
5. Validate
6. Summarize
```

## 31.1 Understand

Restate the implementation target briefly and identify constraints.

## 31.2 Inspect

List the important existing files/modules examined.

## 31.3 Plan

Describe the minimal affected architecture.

## 31.4 Implement

Make focused changes.

## 31.5 Validate

At minimum, when applicable:

```text
npm run lint
npm run typecheck
npm run build
```

and relevant tests.

If a command is unavailable, do not pretend it was run.

## 31.6 Summarize

Report:

- files changed
- important behavior changes
- commands/tests executed
- known limitations
- follow-up risks

---

# 32. File Modification Safety Rules for AI Agents

Before overwriting a file:

- confirm it is the intended file
- read its current contents
- preserve unrelated existing logic

Never delete a file because it “looks unused” without checking imports/references.

Never rewrite an entire codebase to solve a local bug.

When a requested change can be implemented in a focused patch, prefer the focused patch.

---

# 33. Browser Compatibility

Target modern:

- Chrome/Chromium
- Firefox
- Safari

Do not rely on experimental browser APIs for essential functionality without fallback.

CSS Anchor Positioning may be used for the globe marker-label experience, but it must not be the only way users can discover or access cases.

---

# 34. Progressive Enhancement

The application must remain understandable when advanced effects fail.

Degraded states should still provide:

- content
- navigation
- case discovery
- readable text
- usable controls

Examples:

```text
WebGL unavailable
→ 2D/list atlas fallback

Anchor Positioning unavailable
→ case side panel/list

Animation unavailable
→ static transition

External AI service unavailable
→ deterministic core workflow continues
```

---

# 35. Accessibility of Data Visualization

The globe and graph are visual representations.

Every important data point must have a non-visual equivalent.

For cases:

```text
Globe marker
    ↕
Accessible case list
```

For skill paths:

```text
Graph node
    ↕
Semantic path/list representation
```

---

# 36. Observability & Debugging

Development code may have useful diagnostics, but production logs must remain intentional.

Do not log:

- passwords
- tokens
- API secrets
- private credentials
- unnecessary personal data

When diagnosing complex failures, include useful context such as:

- module
- operation
- safe identifier
- error category

---

# 37. Production Readiness Checklist

Before release:

## Architecture

- [ ] module boundaries are clear
- [ ] no circular dependencies
- [ ] no giant catch-all modules
- [ ] no accidental microservice-like complexity

## Local Content & Data Integrity

- [ ] `assertContentIntegrity()` passes with zero errors
- [ ] all `PUBLISHED` cases have complete `id`/`en` narratives and sources
- [ ] every metric has a verbatim `quote` and matching `sourceUrl`
- [ ] all path DAGs are acyclic and reference valid skill slugs

## Security

- [ ] secrets are not committed
- [ ] URL query inputs and `localStorage` state are validated
- [ ] no external database credentials or admin endpoints exist
- [ ] sensitive data is not leaked to client bundles

## UX

- [ ] loading / fallback states
- [ ] empty states
- [ ] error states
- [ ] success states
- [ ] mobile behavior
- [ ] keyboard navigation
- [ ] reduced motion
- [ ] accessible alternatives to globe/graph

## Performance

- [ ] unnecessary client components removed
- [ ] heavy interactive modules are lazy-loaded where appropriate
- [ ] image sizes are reasonable
- [ ] no unnecessary refetch loops
- [ ] animation loops are cleaned up
- [ ] no obvious layout thrashing

## Quality

- [ ] lint passes
- [ ] type check passes
- [ ] relevant tests pass
- [ ] production build passes
- [ ] manual critical-flow test completed

---

# 38. Critical User Journey

The primary journey must always remain coherent:

```text
Landing
  ↓
Atlas
  ↓
Filter/Search
  ↓
Select Case
  ↓
Case Detail
  ↓
Understand Problem & Innovation
  ↓
Become Part of the Solution
  ↓
Diagnostic Quiz
  ↓
Personalized Path
  ↓
Skill Graph
  ↓
Progress
```

Any future feature should be evaluated against this journey.

If a feature makes this journey harder, reconsider it.

---

# 39. Definition of Done

A feature is **not done** merely because the code compiles.

A feature is done when:

```text
Functional
+ Correct
+ Typed
+ Validated
+ Accessible
+ Responsive
+ Performant
+ Error-handled
+ Integrated
+ Tested
```

For major features, the UI must also be visually coherent with the KarsaLoka design language.

---

# 40. Decision Log

Keep architectural decisions here when they materially affect the project.

| Date | Decision | Reason | Owner |
|---|---|---|---|
| 2026-10-04 | Modular Monolith | Keep complexity proportional to project scope | Team |
| 2026-10-04 | cobe for globe | Lightweight globe visualization aligned with Atlas concept | Team |
| 2026-10-04 | Prisma + PostgreSQL | Structured relational data and maintainable server-side data access | Team |
| 2026-10-04 | Rule-based quiz first | Deterministic, reliable, demonstrable without external AI dependency | Team |
| 2026-10-04 | 10-table schema simplification | Reduced from 24 to 10 tables; native arrays for SDGs and tech; fewer forms and migrations | Team |
| 2026-10-04 | No end-user login; client progress | Visitors explore without accounts; progress/bookmarks in localStorage via Zustand persist | Team |
| 2026-10-04 | Quiz in code (`modules/quiz/`) | Static typed questions and pure scoring; zero DB queries; cross-validated against seed slugs | Team |
| 2026-10-04 | Minimal admin auth | `AdminUser` table + signed session cookie (`jose`); no Auth.js, no session tables | Team |
| 2026-10-04 | Globe uses `cobe` v2, not `react-globe.gl` | Lighter footprint; rAF rotation via `globe.update()`; logical CSS pixel dimensions | Team |
| 2026-10-25 | Full-local architecture (Zero DB, Zero Admin) | Removed PostgreSQL, Prisma, and `/admin/*`; all curated content lives in `src/content/` with build-time `assertContentIntegrity()` and verbatim metric quote audit trails | Team |
| 2026-11-13 | Cosmos Homepage (`Three.js r0.143.0` + `Lenis`) with self-hosted 3D assets | Upgraded `/` to deep-space (`#04060f`) & solid mint (`#5df0a8`) interactive Earth scene (`PlanetCanvas.tsx` + `CosmosViewport.tsx`) with self-hosted `public/globe/` + `public/draco/` assets, interactive SDG & Indonesia telemetry (`InteractiveTelemetryShowcase`), bilingual `CaseMetricData.unit`, and zero high-contrast gradient text, while keeping `/atlas` on `cobe@2.0.1` and `/cases/[slug]` on paper `#ECEEE2` | Team |

New architectural decisions should be appended rather than silently replacing old ones.

---

# 41. Change Log

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-10-04 | Initial project engineering/design constitution |
| 1.1.0 | 2026-10-04 | Sync with simplified, no-user-login design, 10-table database, and client-side progress per `docs/PROJECT_CONCEPT.md` |
| 2.0.0 | 2026-10-25 | Full migration to 100% local typed content (`src/content/`), removal of PostgreSQL/Prisma and admin panel, and production-ready `/atlas` 3D globe |
| 2.1.0 | 2026-11-13 | Cosmos homepage overhaul (`/` using `three@0.143.0`, `lenis`, self-hosted GLB/DRACO, solid mint accents without gradient text), interactive SDG & Indonesia telemetry showcase, localized `CaseMetricData.unit`, key-synced `/atlas` filters, bilingual loading/error/not-found routes, and `npm run test` unit suite |

---

# 42. Final Rule

**Do not optimize for code generation speed. Optimize for the long-term quality of the product and the team's ability to understand, maintain, test, and extend it.**

The best implementation is not the one with the most code, most libraries, or most effects.

It is the one that delivers the intended experience with:

```text
clear architecture
+ minimal complexity
+ strong content
+ excellent interaction design
+ resilient engineering
+ fast performance
+ accessible UX
+ predictable collaboration
```

That is the standard for KarsaLoka.
