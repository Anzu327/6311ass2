# Design QA — bootleg meme feed
Date: 2026-10-07
final result: passed

## Source and evidence
Source visual truth: three approved ImageGen directions, content-only, each853×1844. The user explicitly accepts all three and requests new meme families; this is an approved mixed art-direction adaptation, not an exact actor, phrase or movie scene clone.
Source references are retained in creator outputs/for-you-redesign-assets/reference-{pirate,subtitles,infected}.png.
Implementation screenshots: docs/wip/remix-{shadow,dragon,mahi}.jpg, plus creator outputs/for-you-redesign-assets/final-screenshot_{small,desktop,tracking}.jpg.
Full combined comparisons: docs/wip/remix-comparison-{pirate,subtitles,infected}.png. Source and rendered implementation occupy equal390×844 regions in each image.
CSS viewport390×844, deviceScaleFactor1, capture390×844; source downsampled to390×844. Also checked320×568 and1366×768.
State: fresh sample-mode feed, respectively SHADOW CLONE1 / DRAGON LORD2 / FACE KARAOKE3; dynamic content intentionally differs. The three reference layouts correspond to pirate / wild subtitle / infected-browser skins.
Browser evidence: existing cloud Chromium QA run37499997576 on commit231975eb461a82ee7dac3f3dab29b47bc1381943. Native in-app browser timed out; physical device/camera validation is not claimed.

## Findings and comparison history
1. P2 small-phone fake popup overlapped the real action rail. Moved popup70px from right at short heights; post-fix bounds assertion and actual close click pass. Final small capture shows no DOM popup over rail.
2. P2 canvas comic subtitles collided with HTML title. Moved canvas subtitles from .69–.72h to .57–.59h. Combined final views show distinct subtitle, headline and caption baselines.
3. P2 headline font was restrained and depended on external Chinese-font delivery. Added a self-hosted40KB ZCOOL KuaiLe subset under SIL OFL1.1 and enlarged headline. Final browser checks confirm font loaded; combined views show larger playful lettering. Microcopy remains a plain readable UI face.
4. P2 duplicate canvas/HTML recommendation messages shared a region. Removed the canvas duplicate and placed the pirate interest popup below metadata. Capture uses a fresh session so the source initial-feed state is not compared against the intentionally narrowed late-feed state.
No actionable P0/P1/P2 issues remain. Source grain/brush distress is stronger than the runtime's intentionally restrained intermittent signal tearing; this is P3 art-direction polish, not a broken interaction.

## Five required fidelity surfaces
- Typography: local playful Chinese display face; short meme titles, compact English control text. Typeface/copy are coherent with mixed bootleg intent; not an exact raster-lettering replica.
- Spacing/layout: portrait composition, whole central bodies, persistent right rail and five-item bottom navigation. App fits at390×844,320×568 and centered desktop1366×768. Real controls have focus states and touch targets. Long captions wrap without hiding navigation.
- Colors/tokens: cyan/pink pirate, warm amber/gold fansub, acidlime/blue/gray infected states. Core icons remain readable despite distortion; no full-screen strobe. Reduced motion freezes canvas warps/noise.
- Image quality: genuine generated photographic backgrounds and transparent human bodies. WebP alpha preserved; no rejected animal-filter rendering path except the requested dino family. Webcam crops are deliberately visible collage masks, not advertised as seamless neural face swaps. Costumes/scenes differ by user-requested content.
- Copy/content:48 distinguishable clips across16 families, with distinct titles/instructions/variants; fictional counts/popups and privacy explanation identified in About.

Focused checks: header/nav icons and title/caption regions checked from the full390px combined comparison at readable scale; small-phone popup bounds and dismiss interaction checked separately. No unavailable icon substitutes or rasterized full-page UI.

## Verification
Typecheck, unit tests, production build and Sites-runtime test passed (run37499997371).
Browser checks passed:48 unique clip names, continuous advance/back, mobile swipe, likes,48 Explore entries, seven selected animated canvases, real dismiss, reduced motion, small phone and desktop fit, restart/reset, synthetic camera through the real MediaPipe landmark model, camera track cleanup. No page errors or missing local assets.
Residual limits: actual phones/laptops, Safari, hardware webcam and audible OS speech quality need user trial. Automated evidence is not a physical-camera certification.

## Follow-up polish
P3: optional rougher paper masks and raster brush typography, if the user wants closer-to-mock distressed lettering. Current adaptation keeps an actually usable feed and distinct meme content.
