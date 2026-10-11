# Brag Plan: PunarChakra

## What is this app?
PunarChakra is a role-based marketplace that coordinates construction and demolition material recovery from generator listings through collection and processor receipt.

## The angle
A construction site's leftovers are shown as a material with a documented next step. The film moves through PunarChakra's actual generator, collector, and processor workspaces, letting the interface carry the story. Sample listing values are explicitly labeled as illustrative demo data; no real user, account, or active listing is shown.

## Hook (first 2-3 seconds)
Open on PunarChakra's own construction-waste photograph. A restrained forest-green treatment and a slow camera push bring in the source-grounded thought: “Construction waste. Recoverable resource.” The shift in wording sets up a real recovery flow rather than an abstract sustainability claim.

## Key moments (the middle)
- Generator form: the actual material, quantity, condition, pickup location, and readiness fields appear as a sample Concrete & Rubble listing, followed by the actual “Create listing” action.
- Collector discovery: the real “Waste opportunities matched to you” workspace shows a “Strong Match,” concrete match reasons, and “Accept Listing.” The accepted recovery advances through the actual pickup, collection, and transit states.
- Processor workspace: an in-transit recovery marked “Reserved for your facility” reaches the actual “Mark as Received” action and changes to “Received.”

## Outro / punchline
The product's existing wordmark resolves on warm cream with the site's existing page-title line, “Waste Becomes Value.” The close stays quiet and confident.

## User flow worth showing
Generator creates a material listing → collector discovers and accepts a suitable opportunity, then records pickup / collection / transit states → processor records receipt. The video illustrates workflow states; it does not depict real transport automation or payments.

## Tone
- Preset: polished
- Creative direction: quiet premium product film in an earth-toned palette
- Interpretation: a dramatic source-image hook, clear role-specific UI, one grounded interaction at a time, soft transitions, and restrained motion without unverified impact claims.

## Format: landscape — 1920x1080
## Duration: 20 seconds

## Visual identity (from the project)
- Background: warm cream `#f5f3e8` for the app-workspace scenes; deep forest `#103823` for the opening image treatment
- Accent: living green `#2f6947` and restrained orange `#ed6429`
- Text: forest / ink `#16442f` and warm paper `#fffdf7`
- Display font: Archivo is declared by the website; the video uses the local system sans fallback so the composition has no remote font dependency
- Body font: same local system sans fallback (website includes Archivo and Noto Sans Devanagari)
- Strongest visual element: the project's construction-waste and recovery-opportunity photographs, framed with its role-based dashboard UI and forest/orange wordmark

## Share copy (draft)
PunarChakra connects generator listings, collector handoffs, and processor receipt in one material-recovery workflow. Waste Becomes Value.

## Audio direction
- Role: warm cinematic support with sparse interface accents
- Music: bundled `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`, a steady, clean business bed
- Music treatment: begin quietly, rise to a restrained level under the UI, and fade before the final frame; three-second-equivalent smoothness is not needed, use a short 0.6s entrance and 0.8s close
- Music cue guidance: bundled preset `.agents/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, estimated 109.96 BPM. Major reveal targets: 8.74s (collector), 13.11s (processor), 17.47s (brand close). Collector state chips follow the preset beat grid at 10.93s, 11.46s, and 12.02s, then hold together for readability.
- Audio-reactive treatment: attempted via the HyperFrames Creative extraction helper; unavailable here because Python `numpy` and FFmpeg/FFprobe are missing. Keep the visuals editorial and do not fake a music visualizer.
- SFX posture: sparse, quiet, and tied to real UI actions / receipt
- Audio-coupled moments: listing button tap, collector acceptance, processor receipt; status chips arrive on the beat grid and stay visible
- Restraint rule: no alarm-like or celebratory effects, no narration, and no sound that implies payment or automated pickup

## Storyboard

### Scene 1 — The material left behind — 3.82s
A full-bleed frame uses the repository's construction-waste image, darkened toward deep forest while its natural color remains visible. The phrase “Construction waste” settles first; “Recoverable resource” follows over a warm orange hairline. A slow push on the actual image creates motion without inventing a new product claim.

Sequential/interaction: two short text lines arrive in order and remain together on screen.
Audio intent: the warm bed opens gently; a low, soft transition accent supports the image reveal.
Audio-coupled idea: the second line settles on the phrase's visual handoff, not a rapid text beat.
Music: steady and understated.
Transition mood: soft crossfade → Scene 2

### Scene 2 — Generator lists material — 4.92s
An actual-style Generator workspace fills the frame in the app's cream / forest palette. The form recreates source fields and labels: “Material,” “Condition,” “Quantity,” “Pickup location,” and “Pickup readiness.” The visible illustrative record is “Concrete & Rubble,” “Clean & Sorted,” “2.5 tonnes,” “Ghaziabad, UP,” “Ready for pickup now,” and the real “Create listing” button. A visible “Illustrative demo data” badge prevents the example values from reading as a live account or listing.

Sequential/interaction: the form panel arrives first; its static fields are then held together; a cursor presses “Create listing.”
Audio intent: quiet UI texture under the music.
Audio-coupled idea: one soft click lands with the listing action at 7.64s.
Music: steady and understated.
Transition mood: soft crossfade → Scene 3

### Scene 3 — Collector accepts a match — 4.37s
The actual Collector discovery pattern appears with “Waste opportunities matched to you,” “Strong Match,” “Ready for pickup now,” “Concrete & Rubble,” and supported reasons such as “Material accepted” and “Within operating area.” The “Accept Listing” control changes to “Accepted.” The actual recovery states then arrive as three chips: “Pickup in Progress,” “Collected,” and “In Transit.” A second “Illustrative demo data” badge labels the sample record.

Sequential/interaction: cursor presses “Accept Listing”; the three state chips appear in order at 10.93s, 11.46s, and 12.02s, then hold together through the scene end.
Audio intent: a soft action click; status changes feel deliberate, not automated.
Audio-coupled idea: the status chip reveals snap to the preset beat grid and stay readable as a set.
Music: steady and understated.
Transition mood: soft crossfade → Scene 4

### Scene 4 — Processor receives material — 6.89s
The actual Processor workspace pattern shows “Facility recoveries,” an “In Transit” sample recovery, “Reserved for your facility,” and the real “Mark as Received” control. The action is pressed; the status changes to “Received.” After a clear hold, the sample UI recedes and the existing PunarChakra logo and “Waste Becomes Value” line land on a warm cream end card.

Sequential/interaction: press “Mark as Received,” change the status to “Received,” hold, then reveal the existing logo and closing line at 17.47s.
Audio intent: a low, warm reveal accent supports receipt; music fades beneath the final logo.
Audio-coupled idea: logo landing locks to the 17.47s strong cue; final lockup remains still and readable.
Music: fade out over the final 0.8s.
Transition mood: soft crossfade → end card

**Music mood for this video:** steady, warm, quietly cinematic.
**Audio summary:** a single calm bed supports three interface beats, then steps away for the brand close.

## Inspection rubric
1. **What is the app?** A role-based C&D material recovery marketplace with generator, collector, processor, and admin workspaces.
2. **Most impressive claim?** The README's core idea: turn construction waste from a disposal problem into a recoverable resource.
3. **Visual hook?** PunarChakra's actual construction-waste photograph and its forest/orange circular wordmark.
4. **Actual UI to show?** Generator listing form, collector discovery and accepted states, processor facility recoveries and receipt action.
5. **Shortest satisfying video?** 20 seconds covers the three roles and leaves a readable brand close.
6. **Tone?** Polished; quiet, cinematic, nature-inspired product storytelling.
7. **Audio feel?** A steady warm bed with three restrained, motion-matched UI/recovery accents.
8. **Share caption?** “PunarChakra connects generator listings, collector handoffs, and processor receipt in one material-recovery workflow. Waste Becomes Value.”
9. **User flow?** Generator lists material → collector discovers/accepts and records pickup, collection, and transit → processor records receipt.
