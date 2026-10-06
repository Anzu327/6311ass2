# Design QA — bootleg meme feed
Date: 2026-10-07.
Source visual truth: approved three ImageGen directions, normalized from 853×1844 to 390×844, content-only. The user approves mixing all three and replacing demo content with their meme list. This is art-direction implementation, not an exact actor/scene clone.
Source evidence: creator outputs/for-you-redesign-assets/reference-{pirate,subtitles,infected}.png.
Implementation: creator outputs/for-you-redesign-assets/final-screenshot_{shadow,dragon,mahi,small,desktop,tracking}.jpg from cloud Chromium on commit a0e4d3.
Viewport: 390×844 CSS px, deviceScaleFactor1. Also 320×568 and 1366×768.
Full-view combined comparisons: comparison-{pirate,subtitles,infected}.png. Both source and implementation are in each input, each 390×844.
## Findings and history
- P2: small-phone fake popup overlapped real action rail. Fixed popup right inset70px and tested its rectangle and real dismiss action. Post-fix small screenshot confirms independent controls.
- P2: duplicated comic subtitle and main title overlapped. Fixed canvas subcaption to .57–.59h instead of .69–.72h; post-fix screenshots confirm separated baselines.
- P2: main meme lettering remained too restrained and external Chinese font could fail. Added self-hosted 40KB open-font subset and raised display scale; awaiting new capture.
- P2: both canvas and HTML showed a recommendation stamp in the same space. Removed canvas duplicate and separated interest popup from the status strip.
- Comparison state correction: recapture fresh-session clips after navigation checks so reference initial-feed state is not compared to the intentionally narrowed late-feed state or a transient like toast.
## Required fidelity surfaces
Typography: new local display font pending final capture.
Spacing/layout: persistent app controls fit; final title/popup spacing pending.
Colors: cyan/pink pirate, warm gold subtitle, lime/blue infected states present.
Imagery: generated photographic bodies/scenes, actual alpha, live face-strip mesh; actor/costume changes are user-requested and intentional.
Copy: short meme title and instruction, optional detail in caption/about; all variants have distinct copy.
Residual limits: physical webcams, Safari and Android hardware not tested. No original-video/neural-film-face-swap claim.
final result: blocked
