# HyperFrames Composition Brief: PunarChakra

## Objective
Create a polished 20-second landscape launch film that shows construction material entering PunarChakra's verified generator → collector → processor recovery workflow.

## Output
- Composition directory: `brag-output-2026-10-12-001806/composition/`
- Preview project name: `PunarChakra`
- Final video path (render only after review): `brag-output-2026-10-12-001806/brag.mp4`
- Format: landscape — 1920×1080
- Duration: 20 seconds

## Source Material
- Project root: PunarChakra repository checkout
- Primary files read: `README.md`, `app/globals.css`, `app/app-theme.css`, `app/layout.tsx`, `app/dashboard/page.tsx`, `app/dashboard/generator-waste-listing-form.tsx`, `app/dashboard/collector-discovery.tsx`, `app/dashboard/collector-active-recoveries.tsx`, `app/dashboard/processor-active-recoveries.tsx`, `app/dashboard/processor-discovery.tsx`, `types/domain.ts`
- Product name: PunarChakra
- Tagline / strongest claim: the site title “Waste Becomes Value”; README core idea: construction waste can become a recoverable resource
- Key UI moments: actual Generator listing form; Collector discovery match and acceptance; Processor facility recovery and receipt action
- Local project imagery: `public/images/problems/construction-waste.png`, `public/images/problems/waste-recovery-opportunity.png`, and `public/brand/punarchakra-logo.png`
- Copy to show verbatim: “List your recoverable material”; “Waste opportunities matched to you”; “Strong Match”; “Accept Listing”; “Pickup in Progress”; “Collected”; “In Transit”; “Facility recoveries”; “Reserved for your facility”; “Mark as Received”; “Received”; “Waste Becomes Value”

## Creative Direction
- Tone preset: polished
- Creative direction: quiet premium product film in an earth-toned palette
- Interpretation: cinematic opening image, readable role-specific interface close-ups, soft crossfades, and a still brand end card
- Angle: construction waste gets a visible next step through the existing PunarChakra workflow. The interface is the evidence: a Generator records material and pickup details, a Collector accepts a matched opportunity and records recovery states, and a Processor records receipt.
- Hook: the repository's construction-waste image with “Construction waste. Recoverable resource.”
- Outro: the existing logo with “Waste Becomes Value.”
- Avoid:
  - Generic SaaS language, invented environmental impact figures, or a claim that every load is recovered
  - Unimplemented payment processing, payment completion, route/GPS tracking, or automated transport
  - Real names, emails, account data, active records, or database content
  - Any changes to website or application source files

## Visual Identity
- Background: app workspace cream `#f5f3e8`; opening forest `#103823`
- Text: forest `#16442f`, deep forest `#103823`, warm paper `#fffdf7`
- Accent: green `#2f6947`, sage `#e8efe4`, orange `#ed6429`
- Display and body font: the website declares Archivo and Noto Sans Devanagari through `next/font`; the video uses system sans-serif fonts to avoid remote font loading
- References: actual C&D waste / recovery photographs, the light role-based app surfaces, and the existing forest/orange PunarChakra logo

## Storyboard
The sequence boundary times are 0.00, 3.82, 8.74, 13.11, and 20.00 seconds (3.82 + 4.92 + 4.37 + 6.89 = 20.00). Crossfades overlap adjacent picture clips by 0.58s.

1. **The material left behind — 3.82s** — actual construction-waste photograph; “Construction waste. Recoverable resource.”; forest treatment and slow image push.
2. **Generator lists material — 4.92s** — source-grounded Generator form with marked illustrative values; “Create listing” interaction.
3. **Collector accepts a match — 4.37s** — source-grounded discovery card and match reasons; “Accept Listing” interaction; actual pickup, collection, and transit states.
4. **Processor receives material — 6.89s** — actual Processor workspace pattern; “Mark as Received” becomes “Received”; existing logo and “Waste Becomes Value” close.

## Audio
- Audio role: warm, restrained cinematic support
- Audio arc: one steady music bed, three low-level accents for visible action/reception, then a short fade before the brand hold
- Music: local `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` at a restrained level
- Music cue guidance: local preset `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (109.96 BPM). Major reveals at 8.74s, 13.11s, and 17.47s. Collector status chips at 10.93s, 11.46s, and 12.02s. Cue times guide the motion; readability remains primary.
- Audio-reactive treatment: not implemented. The HyperFrames Creative extraction helper was attempted but cannot run because Python `numpy` is absent; HyperFrames Doctor also reports FFmpeg/FFprobe unavailable. No visualizer substitute is used.
- SFX: local `assets/sfx/interface/click_003.ogg` for the Generator action and Collector acceptance; local `assets/sfx/impact/impactSoft_medium_001.ogg` for the Processor receipt reveal. Kept quiet and sparse.
- Audio files are local to this composition. No voiceover, remote media, or runtime network fetches.

## HyperFrames Instructions
- Keep all work inside this timestamped output directory. Website, database, migrations, environment settings, and landing page are unchanged.
- Use the actual repository UI labels and controls. The 2.5-tonne Ghaziabad listing is clearly marked “Illustrative demo data” and is not represented as a live record.
- Build a single 20-second, seekable HyperFrames composition with a paused GSAP timeline, local assets, legible text, and no external font/CDN dependency.
- Run `npx hyperframes check` as the pre-preview gate. Fix reported errors and confirm the localhost Studio URL responds with HTTP 200.
- Open the Studio preview for review. Do not render, encode, publish, or create an MP4 until the user has reviewed and approved the preview.
