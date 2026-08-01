# Tsaritsa — Session Plan (plan2.md)

## Purpose

Implementation plan for the Tsaritsa countdown page, plus session-restore context.
`plan.md` holds the design spec; this file holds decisions made in this session.

## Current Project State

| Item | Status |
|------|--------|
| `plan.md` | exists (design spec) |
| `index.html`, `css/style.css`, `js/main.js` | **not created yet** |
| `img/bg.jpg`, `media/video.mp4`, `media/music.mp3`, `favicon.ico` | present |
| `.opencode/skills/frontend-design` | **installed** (from `anthropics/skills`), valid for opencode |
| `opencode.json` | not needed (`.opencode/skills` is the default project skill path) |

## Decisions Made (Session)

- Full scaffold to be built: `index.html`, `css/style.css`, `js/main.js`.
- Additions beyond `plan.md` base features:
  - Timeline patch + snow effect are part of base plan (confirmed)
  - **Design must fit the Snezhnaya theme** (dark, elegant, frost)
- Removed: progress bar (was proposed, dropped by user).
- Recommended skill installed: `frontend-design` (Anthropic) → `.opencode/skills/frontend-design/`.
  - Installed via: `npx skills add anthropics/skills@frontend-design -a opencode --copy -y`
  - CLI installed to `.agents\skills\`; copied to `.opencode\skills\`, duplicate removed.
  - Load it via the `skill` tool when doing design work.
- Not selected: frost click/cursor effects, zero-reveal, reduced-motion, share button, PWA, server-time sync.

## Implementation Plan

### Files
| File | Purpose |
|------|---------|
| `index.html` | Full page structure per `plan.md` |
| `css/style.css` | Snezhnaya frost theme, glassmorphism, responsive, animations |
| `js/main.js` | All logic: countdown, progress, crossfade, quotes, timeline, snow, controls |

### Features
1. **Countdown** — real-time to Dec 16 2026 04:00 UTC, update every 200ms, flip animation on digit change, JetBrains Mono 700, "She has arrived" at zero.
2. **Background crossfade** — `img/bg.jpg` first (positioned center 20% so her head is in frame), video fades in (1.8s) when playable (canplaythrough/playing + play() retry), image dims; video error falls back to image.
3. **Quote cycling** — 7 Tsaritsa lore quotes, shuffled, crossfade every 7s, floating centered text, directly below the release date line.
4. **Patch road (timeline)** — compact horizontal "road" at the bottom: 5 evenly-spaced stops on a line (6.7 → 7.3), each with version + date; past stops dimmed, current stop pulsing accent dot, 7.3 is the destination (accent dot + snowflake glyph, "Dec 16, 2026"). No scrolling — the whole page fits one viewport (body is a centered flex column: countdown → quote → road). Statuses refresh every 60s.
5. **Snow particles** — canvas, ~80 flakes with drift, occasional cross-sparkles, count scales with viewport.
6. **Controls** — two glass buttons top-right: music (`#bg-music` play/pause), video (`#bg-video` toggle).
7. **Text visibility** — vignette overlay (`rgba(0,0,0,0.7)`) + text-shadows.

### Structure
```
#bg-layer → #bg-overlay → #bg-video → #snow-canvas → #controls → <body> (flex column, centered, one viewport)
  #main-content
  (#countdown-section: heading, #countdown, .countdown-target)
  (#quotes-section: #quote-text, #quote-attribution)
  (#timeline-section: #timeline patch-road — line + 5 stops, bottom) → #bg-music (hidden audio)
```

### Design tokens (from plan.md)
`--bg-deep:#03050a`, `--bg-surface:rgba(8,12,20,.85)`, `--accent:#7ec8e3`,
`--text-primary:#eef4f8`, fonts: Cinzel / Plus Jakarta Sans / JetBrains Mono (Google Fonts).

## How to Restore This Session

In a new opencode session:
1. Read `plan.md` and `plan2.md`.
2. Load the skill: use the `skill` tool with name `frontend-design`.
3. Check `.opencode/skills/frontend-design/SKILL.md` is present.
4. Build the scaffold per the Implementation Plan above.
5. Verify in a browser; check console for errors.

## Changelog

| Date | Change |
|------|--------|
| Session | Read plan.md; chose additions (progress bar, timeline, snow, Snezhnaya fit); installed frontend-design skill; wrote this file |
| Session | Built scaffold; fixed renderQuote crash; video triggers on canplay/playing; bg position 60% → 20% (head visible); redesigned timeline as one-screen patch-road (no scroll); progress bar caption added |
| Session | Removed progress bar entirely; order is now countdown → quote → timeline (timeline pinned at bottom) |
| Session | Replaced fabricated `QUOTES` in `js/main.js` with real canon voicelines (verbatim, from Genshin wiki / HoYoLAB): Tartaglia, The Wanderer, Arlecchino, Columbina, Sandrone, Flins + "Laws of the Bitter Frost" teaser line. Dropped fan-made "gentlest of the Seven / Venti" line (not canon). Verified via headless Edge `file://` dump: 0 errors, countdown 137d, timeline 5 stops. |
| Session | Fixed long-quote layout: `.quote-text` now a fixed 3-line box (`height:5.1em`, `-webkit-line-clamp:3`, `overflow:hidden`) so quotes never grow and push the fixed bottom timeline; trimmed Tartaglia quote to 3 sentences. Verified via CDP computed styles: no scroll, no overlap. |
