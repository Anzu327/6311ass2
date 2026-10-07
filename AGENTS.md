# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Product preference (2026-10-05)
Keep only the TikTok-style app interface. Do not restore side navigation, editorial concept rails, or outside technical captions. Desktop uses a centered portrait stage; mobile fills the viewport with safe-area spacing.

## Collaboration preference (2026-10-05)
Do not assign fixed roles to the two collaborators. Both may edit content, UI, interactions, and effects according to the current request.

## Cloud editing and delivery preference (2026-10-05)
Prefer the local Codex desktop client connected to this repository's cloud workspace. Edit project files in the cloud; do not clone or edit a local computer copy. Explain the required account, repository authorization, and cloud environment selection steps to the collaborator when needed.
After every completed edit, run checks appropriate to the change, fix failures, then proactively commit the relevant changes and push them to remote `main`. Do not wait for another reminder or leave a feature branch or unmerged PR as the final delivery. Read the latest remote `main` before editing and check again before publishing; preserve and integrate collaborators' changes, resolve conflicts, and rerun affected checks. Never force-push over others' work. Verify the remote update and report a real commit link. If permissions, networking, or branch protection block completion, report the actual blocker without claiming synchronization succeeded.



## Rejected effects / rebuild preference (2026-10-07)
The user rejects ALL existing effect templates and the 48-clip collage extension. Delete their runtime catalog, renderers, audio and body/scene/animal assets; do not restore them from history or call variants separate new effects. Keep the app shell, local camera tracking and navigation. The user explicitly prefers new animated characters and scenes where each supplied meme is recognizable from its costume, signature action and setting. New effects need distinct animation, not the same photographic body with different text. Old Git history remains recoverable. Clearing the old library is not completion of the new animated effects.

## Simple entry preference (2026-10-07)
Opening the page shows a 1.5-second typographic transition, then automatically enters the portrait short-video interface. Remove welcome/scan/identity/denial/outro screens; do not replace them with another onboarding sequence. Camera stays opt-in and must not be requested at entry. Feed reset is immediate and stays in the feed. This change does not restore the rejected effect library.

## Splash exploration (2026-10-07)
User wants three counterfeit-Douyin splash directions to choose from. All use1.5 seconds, then automatically enter the existing feed. Timing update is independent; do not implement an unselected proposed design. Make shanzhai recognizable through a deliberately fake note/wordmark and mismatched print, not just generic glitch. Preserve the feed and cleared effects.

## Selected splash (2026-10-07)
Use the googly-eyed cartoon-note 抖歪 design. The user's exact requested removals identify this image: remove the whole 纯属山寨 sticker and the bottom 滑进去，就算你爱看 sentence/marks. Preserve the note, eyes, palette and main title. This specific visual/text reference resolves numeric-option ambiguity. Keep the revised artwork whole with contain scaling, light entrance/fade,1500ms visible timing after artwork ready, then the unchanged feed. Do not add new slogans or restore old effects.

## Approved original-video head overlay (2026-10-07)
The user now chooses their supplied original dance footage over the generated cartoon scenes. This supersedes the earlier animation-only preference for this trial, not permission to restore the rejected old effects. They approved the v2 exaggerated head, about52% larger than v1, then explicitly approved website integration with live webcam face pixels. Use the supplied Qinghai dance MP4, replacing only the central gray-trouser dancer. Preserve back-row dancers, choreography, source watermark and sound; no invented gender classification or body switching. Align with the chin, preserve hair via segmentation, avoid circular photo badges. Keep camera opt-in, microphone off, processing on-device,1.5-second selected splash and existing portrait shell. Before camera access, use a clearly labeled fictional sample head. There is only one source clip: don't market replays as additional videos. Full source footage uses contain scaling, not cropping. Play/pause, mute/unmute and replay are available. Model failure or missing face must show an explicit status and labeled demo, not freeze the last user's face.

Runtime privacy: retain the self-only connect-src CSP. The current MediaPipe runtime attempts vendor logging; CSP blocks that endpoint while permitting same-origin model/WASM loading. Do not weaken privacy assertions to allow external telemetry.

## No-fictional-face fallback / mobile QR (2026-10-07)
The user rejects the fictional face fallback. Supersedes the earlier sample-head preference: camera off, missing face, too-small face, model loading or tracking failure all use a6×8block mosaic of the central dancer's actual source-video head. A detected user's face still uses the approved exaggerated live cutout. No frozen previous face, no sample-face substitution and no fictional portrait in the profile circle. Keep source video hidden until the trajectory and first protected overlay are ready, so loading does not expose the central source face. Test portraits may live under docs/test-fixtures for synthetic-camera QA only; never package or request them in the production app. QR links to the existing public HTTPS artwork address and never auto-requests camera access.

## Supplied six-video collection (2026-10-07)
User provided five additional files and authorized preparing and uploading them:我要迪士尼 recording,蓝色妖姬跑步,社会摇,山东菏泽曹县,退退退. Together with青海摇 there are six actual source clips, not variants of one clip. Preserve original audio; default mute because of browser autoplay restrictions, explicit sound button, choice persists through switching. Scrolling changes video; Explore selects one; Replay restarts the current clip, not an unrelated first clip. Keep a single camera/segmentation pipeline running across switches; tracks and videos change together and async old loads are aborted. Mosaic fallback remains, no fictional faces; hide unprotected frames while each trajectory loads. Blank source frames must not show floating heads. Cap live head size for close-ups and draw a source mosaic beneath live cutouts so the original face cannot compete at the edges. White-glove restoration applies only to the actual glove clip. Source recording was cropped below800px and starts2.5seconds later to remove transient player controls, then resized without changing aspect; other clip framing is retained. Retrait/back-facing shot uses manually calibrated target head, not background-person face detection. Existing HTTPS URL and QR remain stable.
