# Design QA

final result: passed

## Source and evidence

- Source visual truth: `/Users/fred/.codex/generated_images/01a10b43-d4aa-7a43-944e-502543a709f3/exec-d92d7aa5-cc33-4563-8f2e-e50c9968c4cd.png` (853 × 1844).
- Render: `docs/wip/02-identity.jpg` (390 × 844), Codex In-app Browser. Main comparison state: Soft Dreamer identity reveal.
- Source resampled to 390 × 844 for density normalization; combined source/render comparison at `/private/tmp/foryou-comparison.jpg` (780 × 844), inspected with view_image. Same portrait-screen framing, no device bezel.
- Additional renders: welcome, feed overload, ending at 390 × 844; desktop at 1440 × 1024. Tracking diagnostic uses only a fictional AI-generated adult at 1280 × 720.

## Iteration history

1. P2: heading was oversized and started roughly 45 px above the reference. Reduced identity heading from 57 px to 43 px, preserving lower metadata and controls. Recaptured identity; heading now follows the reference's visual rhythm.
2. P2: static face frame was an uninterrupted rectangle. Changed to sparse tracking corners; live frame comes from actual detected landmarks.
3. P2: demo scan text incorrectly implied real tracking. Changed demo status to state that scanning is simulated; live mode separately reports detection status.
4. Recaptured corrected state, compared together with normalized reference and inspected full-size assets. No actionable P0/P1/P2 remains within the user-requested product plan.

## Fidelity surfaces

- Typography: two fonts, DM Sans for bold interface/display and Space Mono for system metadata. Source hierarchy preserved; headings remain editable code, not a screenshot. Identity uses monospace rather than generated decorative letter shapes.
- Layout: full-screen portrait, top tabs, right action stack, lower identity, denial action and bottom navigation. Desktop adds the plan's sidebar and concept rail. Native-size mobile capture matches 390 × 844.
- Color: black/white with cyan #53f5ed and red #fe2858; two other identities deliberately vary effect accents. No early full-screen glitch; repetition escalates in later posts.
- Assets: dedicated generated photographic portrait and transparent cheek texture; no flattened UI image. Source/render focal point and dark lower torso were directly compared. Standard Phosphor icons substitute vector equivalents for the reference's TikTok icon silhouettes.
- Copy: WE KNOW YOU, SOFT DREAMER, ALGORITHMIC IDENTITY, denial CTA and top feed tabs retained. Approved plan adds camera/demo controls, a feed-entry action and artwork explanation. Search renamed Explore to match the category browser. Generated pseudo-analysis labels replaced with honest demo/live statuses.

## Intentional deviations

- Larger denial target and extra feed-entry action support the full interaction flow.
- Equivalent generated portrait rather than the mock's exact person, because the mock includes flattened UI.
- Identity font and share icon are close equivalents, not pixel-identical TikTok branding.
- Source's red heart depicts selected liking; initial application state is unliked, toggling makes it red.
- Browser-responsive web implementation follows the explicit React/Vite/Pages plan, without a phone-shell runtime.

## Focused comparison

Heading, identity label, CTA, tracking corners and navigation are readable at native 390 × 844; inspected in the combined source/render input. Full-view layout and color were compared in the same input. Latest individual identity, feed and ending screenshots inspected with view_image.

## Interaction checks and limits

Browser-tested demo flow, denial, keyboard posts, comment dialog, like, share feedback, reset, same identity, restart. Real detector tested with a fictional portrait video, no-face and restoration plus all three effects. Main experience console errors: none. Physical webcam permission workflow and two real Codespaces remain user-device verification gaps, recorded in `docs/VALIDATION.md`; this report does not claim those passed.
