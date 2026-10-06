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
