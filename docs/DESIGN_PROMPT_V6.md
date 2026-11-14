# Design prompt — V6 "Dark Technical" (2026-11-13)

This is the brief every page follows. It replaces the editorial/academic V4–V5 look.

## Prompt

> Redesign the bilingual (Arabic RTL / English LTR) portfolio of Dr. Eng. Alaa A. AbuZaiter —
> Assistant Professor and Dean of the Faculty of Software Engineering & AI, University of Palestine —
> as a **dark, technical, simple** site, closer to an engineering product site (Vercel, Linear,
> GitHub profile, Brittany Chiang) than an academic journal.
>
> **Surface.** One dark navy canvas on every page (`#0E1622`) with a fine engineering grid
> (32 px minor, 128 px major lines), and a soft amber glow at the top of each page. No paper/cream
> sections, no random light bands. Raised panels are one step lighter (`#131E2D`) with 1 px borders.
>
> **Type.** Sans and mono only, no serif. English: Archivo (display) + IBM Plex Sans (text) +
> IBM Plex Mono (data, labels, numbers). Arabic: Noto Kufi Arabic (display) + IBM Plex Sans Arabic (text).
> Short labels in mono, written like paths or tags (`~/research`, `[MEMS]`).
>
> **Simplicity.** Each page = one dark header (path, title, one-line summary) + the data.
> Cut narrative paragraphs, figure captions and editorial taglines. Prefer lists, tables, cards,
> tags and numbers. One idea per section. Never more than one short paragraph.
>
> **Homepage.** (1) Hero: his real photo in a technical frame (corner brackets, coordinates),
> name, role, institution, field tags, two buttons. (2) Four key figures. (3) An animated dot map:
> a pin in **Gaza, Palestine** and a pin in **Johor, Malaysia**, an arc drawn between them, with the
> degrees and appointments attached to each pin. (4) Three selected papers. (5) Contact.
> No research "story" on the homepage.
>
> **Places.** Always write the country with the city: "Gaza, Palestine", "Johor, Malaysia",
> "Johor Bahru, Malaysia", "Deir al-Balah, Palestine" — foreign readers may not know the city.
>
> **Motion.** Calm and precise: staggered fade-up on scroll, map arc drawing + pulsing pins,
> card spotlight border following the cursor, count-up figures. No library; CSS + small client
> components; everything off under `prefers-reduced-motion`.
>
> **Integrity.** Content stays exactly as verified from the CV 2026 (docs/CONTENT_AUDIT.md).
> No new claims, numbers, quotes or roles. Dashed amber border still means "awaiting confirmation".
> Print/PDF of the CV stays black-on-white.

## Tokens

Colours are CSS variables (`src/app/globals.css`), so the whole site switches in one place and
`@media print` swaps to a light palette for the CV PDFs.

| token | role | dark value |
|---|---|---|
| `ink` | foreground text | `#E6EAEE` |
| `vellum` | page background | `#0E1622` |
| `vellum-deep` | raised panel | `#131E2D` |
| `plate` | strong borders | `#344254` |
| `nickel` | muted text | `#8C9AAB` |
| `temper` / `temper-text` / `temper-light` | amber accent (current, links) | `#E0A852` / `#E8B45F` / `#F0C47A` |
| `anneal` | blue (past, DOIs) | `#7D9BF0` |

Token names were kept from V4 so existing markup keeps working: `ink` = foreground, `vellum` = surface.

## Critique of V5 (why it changed)

- Dark hero on a cream page read as two websites; the cream body still felt like paper.
- The serif text and narrative headlines ("From the material to machine intelligence")
  read as a journal, not as engineering.
- Too many sections and too much prose; no photo of him on the homepage.
- The Gantt trajectory was precise but hard to read at a glance; a map tells "Gaza → Johor → Gaza" instantly.
