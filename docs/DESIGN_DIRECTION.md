# DESIGN_DIRECTION.md — Homepage redesign (V4)

Date: 4 November 2026 · Scope: homepage (`/ar`, `/en`) only. Navbar, footer and inner pages are unchanged in this pass.
Content rule: every fact on the page is read from `src/content/*` (CV 2026, verified in `CONTENT_AUDIT.md`). No new claims, numbers or roles were introduced.

---

## 1. Audit of the previous design

**What worked (kept):** clean data layer in `src/content`, honest handling of unverified items, correct RTL/LTR switching, separation of academic rank from administrative role, privacy rules, 0 overflow on mobile.

**What held it back:**

| # | Problem | Evidence |
|---|---|---|
| 1 | **No visual identity.** Navy + teal + Inter + white bordered cards is the default look of a SaaS dashboard; nothing on the page could only belong to a MEMS / shape-memory-alloy researcher. | Every section is `bg-white border rounded p-6`. |
| 2 | **One composition repeated seven times.** Each section = mono eyebrow `— 0N / LABEL` + bold heading + "view all →" + card grid. The numbering encodes nothing. | Sections 2–8 of the old `page.tsx`. |
| 3 | **Weak typographic hierarchy.** Hero name is plain Inter bold; body text mostly `text-xs`/`text-sm` (12–14px), below a comfortable reading size. Arabic had no display face at all. | Hero, research index, publication cards. |
| 4 | **Decoration that looks like data.** The hero "Transducer schematic" printed `RES: 13.56 MHz` and `100 µm` — invented technical values on a site whose core promise is verification. The "AA" monogram ring read as a logo placeholder. | `MemsTransducerSchematic.tsx`. |
| 5 | **Research presented as a list, not a body of work.** Six pillars as rows of text with keyword chips; no relation between pillars, no link to the papers behind them. | Section 3. |
| 6 | **The homepage tried to be the whole site.** All 15 courses, a software-tools strip, three education cards and two leadership boxes — the page had volume but no story. | Sections 5–7. |
| 7 | **Motion absent or generic.** No load moment; only hover colour swaps. | — |
| 8 | **Mobile:** hero chips stack awkwardly, the schematic takes a full screen of decoration before any research content appears. | `homepage-mobile.png`. |

---

## 2. Three creative directions

### A. "Shape Memory" — the material as the metaphor *(recommended)*
The subject's own world: NiTi shape-memory alloy, which deforms when cool and **recovers its remembered shape when heated**, tracing a hysteresis loop. The hero is a real scientific figure (Fig. 1, schematic SMA hysteresis) that draws itself, while the name settles from a compressed width into its final form. Palette taken from **titanium heat-tint** (temper bronze for heating / current, anneal blue for cooling / past). Pages read like a well-typeset research paper: figures, captions, marginalia, a record of works.
*Risk:* a variable-width name animation — justified because it is literally the behaviour the research is about.

### B. "Yellow Room" — the cleanroom and the photomask
Photolithography bays are lit amber; wafers are tiled with dies. The page becomes a mask plate: sections as dies on a wafer grid, amber safelight accent on near-black, alignment marks as section markers.
*Why not chosen:* striking, but dark-dominant and tech-forward — drifts toward the "software company" look the brief forbids, and amber-on-black hurts long Arabic reading.

### C. "Proceedings" — the journal article as layout
Homepage typeset like the first page of a paper: title, author block with affiliation superscripts, abstract, keywords, numbered references.
*Why not chosen:* strongly academic but static and close to the generic broadsheet look; it explains the scholar, not the science. Its best devices (figure captions, marginalia, author block) are folded into direction A.

---

## 3. Design system (direction A)

### Colour — "heat-tint"
| Token | Hex | Role |
|---|---|---|
| `ink` | `#0F1D2E` | Text, dark research band. Continues the brief's deep navy. |
| `vellum` | `#F3F4F0` | Page background — cool engineering-vellum, not cream. |
| `plate` | `#E2E5E0` | Rules, secondary surfaces. |
| `nickel` | `#566170` | Secondary text (≥ 5:1 on vellum). |
| `temper` | `#B5761C` / text `#8A5410` | Heating branch, **current** role, active states. |
| `anneal` | `#2F4FA8` | Cooling branch, **past** roles, links on dark. |

Colour carries meaning: warm = heating / present, cool = cooling / past. The same rule is used in Fig. 1 and in the trajectory timeline.

### Type
| Role | Latin | Arabic |
|---|---|---|
| Display / UI | **Archivo** (variable `wdth` 62–125) | **Noto Kufi Arabic** (variable `wght`) |
| Reading prose | **Source Serif 4** | **Noto Naskh Arabic** |
| Data (DOIs, dates, axis labels) | **IBM Plex Mono** | IBM Plex Mono (Latin digits) |

The cross-script mapping is deliberate: grotesk ↔ Kufi for structure, serif ↔ Naskh for reading. Arabic is never letter-spaced; the shape-memory animation uses `wght` for Arabic and `wdth` for Latin.

Scale (fluid): display `clamp(3.25rem, 7.5vw, 7rem)` · h2 `clamp(2rem, 4vw, 3.5rem)` · lede 22–26px serif · body 17–18px · data 12–13px mono.

### Layout & motion
- 12-column grid, 1280px max, generous vertical rhythm (96–160px between sections).
- Each section has its own composition (see §4) — no repeated card template.
- One orchestrated load moment (Fig. 1 draws heating then cooling; name width settles). Scroll reveals are short (500ms) opacity/translate; timeline bars grow from the inline-start side (RTL-aware). All motion disabled under `prefers-reduced-motion`.

---

## 4. Homepage concept

```
┌───────────────────────────────────────────────────────────────┐
│ MEMS · SMA MICROACTUATORS · MECHATRONICS                      │
│ Dr. Eng.                              ┌───────────────────┐   │
│ Alaa A.                               │ Fig.1 hysteresis   │   │  1. THESIS — name + figure
│ AbuZaiter                             │ heating ⟶ cooling  │   │
│ Rank ……… Assistant Professor          └───────────────────┘   │
│ Role ……… Dean, Faculty of SE & AI     caption + linked paper  │
│ serif bio · [Publications] [CV] contact                      │
├───────────────────────────────────────────────────────────────┤
│ big serif lede (8 col)           │ marginalia: PhD / Dean /   │  2. PROFILE — lede + margin notes
│                                  │ record / languages         │
├═══════════════ dark ink band ═════════════════════════════════┤
│ From alloy to algorithm                                       │  3. RESEARCH — six-step ladder
│ |—Material—|—Mechanism—|—Manipulation—|                       │     material → intelligence,
│ |—Devices——|—Control———|—Intelligence—|  + linked-paper count │     each with linked papers
├───────────────────────────────────────────────────────────────┤
│ Selected works: 3 editorial entries (year · serif title · DOI)│  4. WORKS — entries + record strip
│ record strip 2013 ─●○◇──●●○──●●●○──●○──●──·──●○──●──●── 2025   │
├───────────────────────────────────────────────────────────────┤
│ Trajectory 2005 → now  (Study lane / Appointments lane)       │  5. TRAJECTORY — two-lane timeline
│ ▬BSc▬   ▬MSc▬▬PhD▬    ▬PTC▬▬Head BME▬▬Dean ICS▬▬AP▬▬DEAN▬     │
├───────────────────────────────────────────────────────────────┤
│ Taught: run-in course list by field │ Honours: 3 awards       │  6. TEACHING & HONOURS
├───────────────────────────────────────────────────────────────┤
│ Correspondence — email set large · CV · contact page          │  7. CORRESPONDENCE
└───────────────────────────────────────────────────────────────┘
```

Mobile: figure follows the name block (not before it); the timeline becomes two vertical lanes; the research ladder becomes a single ruled column.

### Shell (pass 2 — done)
Navbar and footer now use the V4 tokens and fonts site-wide (fonts load in `src/app/[locale]/layout.tsx`; page background is `vellum`).
- Navbar: hysteresis mark + wordmark, short group labels on one line (xl+), temper underline for the active group, vellum dropdowns, full-screen drawer below xl with Escape-to-close and scroll lock, skip-to-content link.
- Footer: ink colophon with the name set large, rank/role/institution as separate facts, link index with counts derived from data, correspondence column.
- Captures: `node scripts/capture_shell_v4.js` → `docs/visual-review/v4/shell-*.png`.

### Publications page (pass 3 — done)
- Header: title + serif standfirst, with three facts derived from the data (span, first-authored works, works with a DOI).
- Explorer: underline search field with match highlighting, type filter whose symbols match the homepage record strip (● journal, ○ conference, ◇ chapter), and the record strip itself as an interactive **year filter** (marks fade when filtered out).
- Catalogue grouped by year (sticky year column on desktop), English bibliographic data kept LTR inside Arabic pages.
- Citation dialog: `role="dialog"`, focus moves to Close, Escape closes, focus returns to the triggering button, page scroll locked.
- Removed: the "Featured landmark article" card (an editorial label not found in the CV; the same paper remains in the list). Abstract toggles now say "Read summary", because the stored texts are short guides rather than the original published abstracts.
- Preserved for QA scripts: `input[type="text"]`, one `<article>` per work, dictionary tab labels, "APA 7th Edition" / "BibTeX" in the dialog.
- Captures: `node scripts/capture_publications_v4.js` → `docs/visual-review/v4/pubs-*.png`.

### Research page (pass 4 — done)
- Header reuses the homepage thesis line ("From alloy to algorithm."); pillar order comes from `src/content/research-ladder.ts`, now shared with the homepage.
- Fig. 2 (md+): a real `<table>` mapping each pillar to its linked papers by year, using the record-strip symbols; the caption states the counts (14 linked works, 3 shared between areas) computed from the data.
- Six dossiers with anchors (`/research#mems-microactuators` …), each listing every linked paper with DOI links; the homepage pillar titles now link to these anchors. Mobile shows a mini year strip per pillar instead of the table.
- The AI pillar shows what the CV actually supports (dean role, AI course, 2025 AI-in-education workshop) and says plainly that no papers are linked.
- Only `summary` texts are shown; the longer `description` texts in research-areas.ts make claims beyond the CV (e.g. resolutions, surgical tools) and stay unpublished.
- Captures: `node scripts/capture_page_v4.js research` (generic script for any route).

### Academic Journey page (pass 5 — done)
- Title "Gaza, Johor, Gaza." with an overview ruler linking to three chapters by place: Gaza 2005–2011, Johor 2011–2016, Gaza 2017–present.
- Each chapter: sticky heading (place, years, factual summary, honours from that period) and every CV entry in date order, each with a span bar on the chapter's own year axis so overlaps stay visible.
- All 13 entries from academic-journey.ts are shown (3 degrees, 10 posts), dates as written in the CV. The two open-ended part-time posts carry a hatched bar and a dashed "awaiting confirmation" note; only the deanship is marked as the current role.
- Entry types encode the rank/role split: degree, research, academic appointment, administrative role, part-time appointment, engineering work.
- Fixed site-wide: short year labels (’14) are wrapped in `<bdi dir="ltr">` so they no longer flip to 14’ in Arabic.
- Captures: `node scripts/capture_page_v4.js academic-journey journey`.

### Leadership page (pass 6 — done)
- Title "Three offices at the University of Palestine." with a factual standfirst.
- Fig.: one tenure track 2017→now — past offices in anneal, the current deanship in temper, and the 11/2022–02/2025 interval hatched and labelled "No administrative office: Assistant Professor, Faculty of Applied Engineering & Urban Planning" (from academic-journey.ts). Total tenure is the union of the office intervals (7 years).
- One entry per office, newest first: period, computed duration, title, institution, the source line from leadership.ts, and a single "Awaiting institutional documentation" line instead of the V3 placeholder boxes.
- Research Council / curriculum note shown in a dashed "awaiting confirmation" box. V3 labelled it "Verified", which contradicted CONTENT_AUDIT.md.
- Captures: `node scripts/capture_page_v4.js leadership`.

### Teaching page (pass 7 — done)
- Title "From the circuit to the robot." The standfirst states that titles follow the CV and that the CV gives no dates per course.
- Fig.: the 15 courses as a layer stack, like a MEMS process cross-section — six fields from electrical foundations (dark, bottom) to applications (light, top), each layer's thickness proportional to its course count. The caption says the order is editorial.
- English shows CV titles verbatim (trailing full stops removed); Arabic shows the Arabic title with the original CV designation beneath it.
- Tools and skills from the CV in two ruled lists, with the note that they are not tied to specific courses.
- Content fix (approved by the user): four English skill labels in `src/content/courses.ts` were trimmed to the CV's wording — "MEMS fabrication", "SMA microactuators", "Microcontroller programming", "CNC machining" (they had added cleanroom processing, bimorph actuation, embedded interfacing and Micro-EDM).
- Captures: `node scripts/capture_page_v4.js teaching`.

### About page (pass 8 — done)
- Header: formal name, the other-script name, rank / administrative role / institution as three separate facts, and a portrait placeholder with the dashed "awaiting confirmation" border (no monogram, no "VERIFIED" badge).
- Biography: the three `bioFull` paragraphs as a long-form essay, each with margin notes derived from the data (current office, graduate degrees, publication counts, research areas, courses, earlier offices) and links to the matching pages.
- Languages as plain text (CV wording); a note that date of birth, address and personal phone are not published.
- Removed from V3: a pull-quote attributed to Dr. AbuZaiter that has no source in the CV or content files, and the 100% / 90% language-proficiency bars (the brief forbids percentage bars).
- `AcademicPersonaFrame.tsx` and `MemsTransducerSchematic.tsx` are now unused.
- Captures: `node scripts/capture_page_v4.js about`.

### Conferences page (pass 9 — done)
- Title counts the papers from the data ("Six papers in conference proceedings."); the standfirst says the cities are venues and that a proceedings paper does not by itself show attendance or presentation.
- Fig.: the six papers as proceedings volumes on a shelf (acronym on the spine, publisher, year), each linking to its entry. No venue map: a travel map would imply attendance.
- Entries: acronym + year, venue (labelled "Venue"), publisher, authorship position ("Author 2 of 5"), title, authors, full conference name, pages, DOI.
- Attendance, talks and committee roles in a dashed "Not yet documented" box. Removed V3's "IEEE & Elsevier Indexed Proceedings" label (indexing was not verified).
- Captures: `node scripts/capture_page_v4.js conferences`.

### CV page (pass 10 — done)
- The page is the public CV: a print-ready document (masthead, profile, education, all experience entries with † on the two unconfirmed part-time posts, all 19 publications in APA with DOIs, 15 courses, training, awards, skills, languages), built only from `src/content`.
- The downloadable PDFs are printed from this page: `node scripts/build_public_cv.js` (server on :3000) writes `public/documents/Alaa_AbuZaiter_CV_Public.pdf` (EN) and `…_AR.pdf` (AR), A4, 5 pages each. Print CSS hides the site navbar/footer and the scrollbar and keeps entries unsplit.
- Fixed: the previous public PDF was a damaged 1.1 KB stub (broken xref, 8 lines of text), not a CV. It is kept at `docs/archive/Alaa_AbuZaiter_CV_Public_v3_stub.pdf`.
- Checked in both PDFs: no date of birth / address / personal phone, no JESTEC 2022 entry, 14 DOIs.
- Re-run `build_public_cv.js` after any content change so the PDFs stay in step with the site.

### Awards page (pass 11 — done)
- Title counts the honours from the data ("Three honours, 2013–2021."); standfirst says categories, citations and certificates will be added when documents arrive.
- Fig.: the honours as markers on the career chapters (Johor / Gaza bands, as on the Journey page).
- Each honour: large year, title, conferring body, place, source, and a dashed "Certificate: not yet provided" line.
- The PhD Certificate of Excellence year is shown as inferred (hollow marker, asterisk, note): the CV gives no date; 2016 in the data is derived from the PhD period.
- Removed V3's "Verified in CV 2026" seals, "HONOR 0x" numbering and "UTM & International Conference Recognition" label.
- Content fixes (approved by the user): `AwardItem.yearInferred` added and set on the PhD certificate; every page that lists awards (home, Journey, Awards, CV and both PDFs) now shows "2016*" with the note from `yearInferredNote`. Arabic medal title trimmed to the CV wording ("الميداليتان الفضية والبرونزية (Silver & Bronze Medals)"; "للابتكار الصناعي" removed).
- Captures: `node scripts/capture_page_v4.js awards`.

### Contact page (pass 12 — done)
- The institutional email is the headline, set large, with a dashed note that its use as the public contact still awaits confirmation (CONTENT_AUDIT.md §2).
- Three topics the CV supports (research collaboration, student projects, faculty matters), each with a "Write" button that opens a mailto with a localized subject line, plus a link to the related page.
- Side column: institutional address only (faculty, university, city), languages, scholarly profiles marked "added once confirmed", privacy note (no form, no tracking).
- Corrected V3 wording: "graduate supervision" became "student projects" (the CV mentions graduation projects), and the page metadata matches.
- Captures: `node scripts/capture_page_v4.js contact`.

### Activities page (pass 13 — done)
- Title "Five training courses: lab, classroom, institution." The five CV training items grouped by where they apply (lab: MEMS fabrication, CNC; classroom: teaching methods, AI in education; institution: project management), each group linking to the related page.
- Only CV details are shown (title, organizer, year where given; "Year not given" otherwise). The `type` descriptors in awards.ts are not displayed.
- Research Council / curriculum development shown in the dashed "awaiting confirmation" box, linking to Leadership.
- Removed V3's "PROG-0x" numbering, "Verified in CV 2026" badges and "Professional Development Passport" label.
- Content fixes (approved by the user): in `src/content/awards.ts` the invented `type` descriptors were removed from all five training items (field dropped from `ProfessionalWorkshop`), the AI-in-Education placeholder organizer ("Specialized Training Workshop" / "برنامج تدريب متخصص") was removed (`organizer` is now optional; pages say "Organizer not given in the CV"), and the Arabic labels "شبكة المنظمات الأهلية الفلسطينية (PNGO)" and "شركة MicroTools" were trimmed to "PNGO، غزة" and "MicroTools، ماليزيا". CV PDFs rebuilt.
- Captures: `node scripts/capture_page_v4.js activities`.

### Supervision page (pass 14 — done)
- Title "Graduation projects and student research."; standfirst says the CV gives no titles, students or years, and that names appear only with consent.
- "What the CV records": the three CV lines, worded as in CV 2026 (profile summary; skills: academic; skills: innovation).
- "Final-year projects in print": the two UTM *Progression of SEI & SEM Final Year Projects* chapters as co-authored work, stating that the CV does not give his role.
- "Project register": the fields each confirmed project will carry (title, students, year, institution, role), with a dashed "No projects confirmed yet" row.
- Removed V3's four invented "supervision domains" (PLC integration, robotic arms, microfluidics, embedded AI), which have no source in the CV.
- Captures: `node scripts/capture_page_v4.js supervision`.

### Site-wide check (5 Nov 2026)
- All 13 public pages × EN/AR × 1440/390 px (52 views): no horizontal overflow, correct `dir`/`lang`, exactly one `<h1>`, no broken in-page anchors, no JavaScript errors.
- `test_all_routes.js` 100% (incl. both CV PDFs); `run_qa_suite.js` passes; publication search verified (Sensors 3, Stewart 1, SMA 2, DOI prefix 10.1109 → 6, empty → 19). `test_search.js` now waits for hydration before typing.

### Gallery (pass 15 — 7 Nov 2026, requested by Dr. AbuZaiter)
- `/gallery`: photos laid out like a contact sheet — 4:3 frames numbered in date order, caption, date and place in mono, category filters (only categories present). Full-screen viewer: solid ink background, counter ("2 من 7" in Arabic), prev/next that follow reading direction, ← → keys (reversed in Arabic), swipe, Escape, focus moved to Close and returned, scroll lock.
- Data: `src/content/gallery.ts` (`GalleryPhoto` in types.ts). Only `approved: true` photos are shown; `alt` is required in both languages.
- Until a photo is approved the page shows the requirements (PendingSection), is `noindex`, and has no menu/footer link; links appear automatically under Activities and in the footer once the first photo is approved.
- Tested with 7 temporary abstract sample images (EN/AR, 1440/390): grid, filter, viewer, keyboard, focus return, no overflow, 0 JS errors. Samples were removed afterwards.
- How to add photos: `docs/GALLERY.md`.
- 2026-11-09: Dr. AbuZaiter supplied 12 photos. Portrait (grey suit) wired into About via `profileData.photo`; the dashed placeholder now shows only if `photo` is unset. 10 photos added to `gallery.ts` (approved); the gallery is now live, indexable and linked under Activities + footer. Dates set only for ISMS 2014 (2014-01, Langkawi) and the 2021 UP graduation; others left undated/uncaptioned-generic pending the doctor's details. Originals re-encoded via PIL (EXIF/GPS stripped) into public/gallery and public/portrait. Not changed: the ISMS 2014 group photo is strong but not conclusive evidence he presented, so the Conferences page attendance note was left as-is pending his confirmation. (2026-11-09: user confirmed — ISMS 2014 now shows an "Attended — documented by a photograph" note linking to the gallery; a per-id `ATTENDED` map drives it, presenting is not inferred, other papers unchanged.)

### Palette warm-up (2026-11-09, user feedback "colours not comfortable")
- Warmed the paper and softened the dark bands, all via tokens in `tailwind.config.ts`:
  - `vellum` #F3F4F0 → **#F4F2EA** (warm off-white), `vellum.deep` #EAECE6 → **#ECE7DC**, `plate` → **#DCD6C9**.
  - `ink.soft` #1A2B40 → **#223241** (softer, warmer slate) and repointed the two big dark masses to it: homepage research band and the sitewide footer (`bg-ink` → `bg-ink-soft`). `ink.DEFAULT` stays near-black (#152331) for text and crisp controls, so reading contrast is unchanged.
- Buttons, conference spines and the gallery lightbox keep `bg-ink` (crisp). Checked: 64 views, 0 overflow/contrast/JS problems; text on the softer band stays ~11:1.
- If still not warm/light enough, next lever is reducing dark area further (option "lighten it").

### Labels softened site-wide (2026-11-09, "technical+formal but comfortable")
- Grounded in how Distill / Tufte / the Swiss style keep the technical feel in the grid, figures and mono **numerals**, not in shouting micro-labels ("mono = data, not decoration").
- Removed `uppercase` + wide `tracking` from every small label across all 13 pages + Navbar, Footer, Trajectory, PendingSection, GalleryGrid, PublicationsExplorer (and the two teaching figure annotations + the research dossier type tag). They now read as quiet sentence-case captions in mono (e.g. `Academic rank`, `Span`, `Fig. 1`).
- Kept technical/formal: the 12-col grid, hairline rules, scientific figures, and mono for DOIs, years, axis ticks and the record strip. Checked: 64 views, 0 overflow/JS problems, routes 100%.
- Note: the `src/app/[locale]` folder's literal brackets break naive globs — use `glob('src/app/**/*.tsx', recursive=True)`.

### Technical paper texture (2026-11-09, "background feels formal not technical")
- Added a faint "plotting-paper" grid to the page background that echoes Fig. 1 (so the paper reads as a lab/graph notebook, not a flat formal sheet) while keeping the warm vellum.
- Implemented as `.bg-paper` in globals.css (vellum colour + a 112px major + 28px minor grid at ~0.07/0.03 ink) and applied to every page root (the `bg-vellum text-ink` wrappers). It is on the roots, not `body`, because each root paints an opaque vellum. Dark bands, the CV sheet and the trajectory band stay flat (opaque). Grid is removed in print.
- Checked: 64 views, 0 overflow/contrast/JS problems, routes 100%. Strength is intentionally gentle; bump the two alpha values in `.bg-paper` to make it more present.

### Still to do
All 15 routes are on V4, including the hidden scaffolds `/community` and `/media` (shared `PendingSection` component; still `noindex`, not linked from any page; they list the details each entry needs before publication). The two unused V3 components were moved to `docs/archive/v3-components/` (renamed `.tsx.txt` so they are out of the build). The unused `lucide-react` dependency was uninstalled (approved by the user). `npm audit` still reports 2 pre-existing findings in the PostCSS copy bundled inside Next.js 15 (build-time only on this static site); npm's only fix is a forced upgrade to Next 16, which is a breaking change and has not been made.

Final sweep (5 Nov 2026): 15 routes × EN/AR × 1440/390 px = 60 views, 0 problems, 0 JS errors; route test 100%. Content still needing Dr. AbuZaiter's approval: the biography paragraphs in `profile.ts`, the Arabic name's preferred form, the email as public contact, the two open-ended part-time posts, the Research Council title and dates, award certificates, a portrait, and scholarly profile links.

## V5 homepage — "Instrument" pass (2026-11-12)

User request: remove Fig. 1 and its caption, make the homepage simpler and more technical than academic, change the background, add premium motion.

- Structure: dark hero (status line, name, research tagline, short bio, CTAs, 4 measured figures) → 01 Research index (6 rows) → 02 Selected work + record strip → 03 Trajectory → 04 Contact. Profile lede, teaching run-in and honours left the homepage (still on their pages).
- Background: homepage uses `.bg-dots` (24px dot lattice, major dot every 96px). Inner pages keep `.bg-paper` grid.
- Hero: `DotField` canvas — pointer acts as a probe (dots brighten, turn amber, lean away); slow scan band from the inline-start side; paused off-screen/hidden tab; static under reduced motion.
- Motion (no new dependencies): masked name rise, staggered hero entrance, `Decode` scramble on the Latin tagline (Arabic is not scrambled), `CountUp` figures, section rules draw in, row hover sweep, record-strip marks pop by column, email underline, scroll-driven reading-progress bar (CSS `animation-timeline`, hidden where unsupported).
- Fig. 1 component archived to docs/archive/v4-components/HysteresisFigure.tsx.
- Verified: build OK; sweep 64 views 0 problems, 0 JS errors; screenshots docs/visual-review/v4/home-v5-*.

## V6 — "Dark Technical" (2026-11-13)

User feedback on V5: not technical, background not changed on every page, still complex, no research story on the homepage, add his photo, keep it simple and organised, show Johor/Gaza as an animated map with pins, and always write the country ("Gaza, Palestine", "Johor, Malaysia"). User chose **full dark** for the whole site.

Spec: docs/DESIGN_PROMPT_V6.md. Summary:
- Colours are CSS variables (globals.css `:root`); tokens kept (`ink` = foreground, `vellum` = surface) so every page switched at once. `@media print` swaps to the light palette, so the CV PDFs stay black-on-white.
- One background everywhere: navy + 32/128px grid + amber glow (`.bg-paper`, also on the layout root).
- Serif removed: IBM Plex Sans / IBM Plex Sans Arabic for text, Archivo / Noto Kufi for display, Plex Mono for data.
- `PageHeader` (mono `~/path`, plain title, one line) on every inner page; editorial taglines and "Fig." labels removed.
- Homepage: photo in a corner-bracket frame, facts strip, four count-up figures, `JourneyMap` (dot map generated once from Natural Earth via `dotted-map`, data in src/content/journey-map-dots.ts; arc draws, pins pulse, a dot travels the route), three paper cards, contact panel.
- Teaching layer stack → field panels; conference "shelf" → tag index; academic journey gets the map and chapter tags.
- `.panel` cards have a cursor-following amber border (`Spotlight.tsx`).
- Place names in content now carry the country (academic-journey.ts, awards.ts, gallery.ts).
- Archived: V5 DotField, V4 Trajectory and HysteresisFigure (docs/archive/v4-components/).
- Verified: build OK, sweep 64 views / 0 problems / 0 JS errors, CV PDFs regenerated.
- 2026-11-13 About (V6): large photo + formal name + current office chip + one bio paragraph (bioFull[0]) + CV/contact buttons; then four cards: Education, Academic offices, Research (counts + focus tags from bioFull[1]), Teaching & languages (+ privacy note). The two longer bio paragraphs were dropped; their facts are in the cards.
- 2026-11-13 Academic Journey (V6): map + chapter tags + legend, then one panel per place (Gaza, Palestine / Johor, Malaysia / Gaza, Palestine) with a vertical timeline (node colour = kind, hatched = ongoing awaiting confirmation) and that chapter's honours. Mini Gantt bars, chapter axis and narrative summaries removed.
- 2026-11-13 Research (V6): the area × year table and its long caption were removed. Six area cards (2 columns): step tag, paper count, title, one-line summary, up to 4 keyword tags, a mini year strip (2014–2025), and the papers inside a native <details> fold. The AI area (no papers) shows its CV links instead.
- 2026-11-13 Publications (V6): search, type filters and the year strip sit in one console panel (boxed search field, active filter = amber outline). Results grouped under a mono year rule with a count; each work is a panel card (sans title, authors, venue, DOI/publisher/cite in a side column). Citation dialog on the raised surface with an amber top rule. QA: test_search 3/1 results, run_qa_suite passes.
- 2026-11-13 Short pages (V6 consistency pass): Leadership offices, Awards, Activities columns, Supervision blocks, Conference papers, Contact topics/aside and Teaching skill lists are now `.panel` cards with spacing; heavy 2px ink rules removed; oversized editorial years/titles scaled down; scroll reveals added. The CV sheet is unchanged (it is the printed document).
- 2026-11-13 Teaching tools (V6): software shown as 3×3 logo tiles (src/components/teaching/ToolsAndSkills.tsx, data in src/content/tool-logos.ts). Marks for COMSOL, AutoCAD, ANSYS, Proteus and LabVIEW come from Simple Icons (CC0 path data; trademarks of their owners). MATLAB, SolidWorks, SPSS and ICDL have no freely licensed mark there and are shown as text monograms — replace with official files if the owner's press-kit logos are supplied. Motion: tiles boot in (blur→sharp, staggered), logo takes its brand colour + glow on hover, an amber scan line sweeps the grid (from the right in Arabic), specialisation line icons draw their strokes. Reveals site-wide now use an animation with `--rd` delay so hover effects are never delayed.
