# Terminal scanner design QA

## Evidence and normalization
- Source visual truth: selected third displayed ImageGen result exec-ac229e89-2199-4b09-a50a-00f09bd2143c.png,984x1598.
- Reference normalized to390x634 without semantic editing (rounding under1px); the actual generated mock is not390x844, so the matched comparison viewport is390x634.
- Browser implementation: qa-results/terminal-design-390x634.png from workflow37774677055, commit1465cc5cf9666dd06eec28fc507059404c0e4d08. Saved local inspected JPEG: outputs/scanner-terminal/implementation-final.jpg.
- CSS390x634, deviceScaleFactor1; active face-presence scan. Isolated QA camera input is fictional test fixture, centered for this capture. Only the test freezes RAF and normalizes displayed62%/blue-beam45% to compare same state; production2s scan, camera and reset behavior are unchanged.
- Combined evidence inspected: outputs/scanner-terminal/comparison-full.png, comparison-header.png, comparison-controls.png, comparison-camera.png and comparison-footer.png. No separate-image-only comparison.
- Additional completed/recovery/responsive states tested320x568,390x844,1366x768 for ALL FOUR current pools, including newest man巴out label. No physical-phone camera substitution for user testing.

## Comparison history
Iteration1 blocked, workflow37754936579:
- P1: display capitals and progress too tall, heading/warning too far right. Corrected with official OFL OswaldBold subset, source-matching title/percent sizes and18px warning bleed.
- P2: compact-height rule changed the primary390x634spacing. Compact rules now apply only to width350px/height580px; primary camera/frame proportions match.
- P2: generated outer frame too thick/doubled. Regenerated corner-only assetv2;1pxstandardcameraUIborder now replaces outer artwork rectangle.
- Functional check found shortened camera caption; restored explicit 本地实时摄像头.
- QA-only freeze had used RAF polling, causing timeout after it deliberately stopped RAF; timer polling now resolves. No production bypass/flag added.

Iteration2 passed:
- Compared actual browser image against exact selected visual in one combined full-view input, then focused header/controls/camera/footer inputs.
- Earlier type-size, alignment, compact-layout and doubled-border findings are resolved. No remaining P0/P1/P2.

## Required fidelity surfaces
- Fonts/typography: condensed display heading/progress and heavy Chinese status hierarchy retained; officialOFL OswaldBold and existingScanSans. Loaded font checked in actual browser. No clipping or unwanted wrapping.
- Spacing/layout: header, title, square-edged camera, status/progress and restrained footer retain selected hierarchy. Responsive taller view uses additional camera space rather than stretching pixels; camera buffer geometry checks pass.
- Colors/tokens: matte charcoal actual generated film texture, bone-white text/corners, orange warning accent, blue sweep/progress. No red-blue facial ghosting/green scan.
- Image quality/assets: actual ImageGen texture/corners/ruler; existing approved branded mark/blue beam. Real native camera canvas in production, no baked/mock face, no invented image/SVG/logo substitute. Four-result completion uses matching editable typography, not face-covering old stickers.
- Copy/content: real scan status/instruction, LOCAL indicator, explicit local-processing/nonidentity disclosure; latest groupLabels retained. No identity/gender/interest inference claims.

## Runtime verification
Typecheck, unit tests, build, Sites packaging tests and cloud browser QA pass. Four-pool delayed-media poster transitions pass; same player/camera, original sound, randomized engagement and Messages preserved.
Browser tests cover no premature result,2sface gate/loss reset, hidden-tab clear, denied-camera no false success/explicit skip, reduced motion, camera cleanup, source/pool wrap/replay/search, no runtime errors/missing assets or completed frame uploads.
Source privacy CSP and protected hosting files remain unchanged. No new framework/template, decoder or camera pipeline.

## Follow-up polish (P3 only)
Exact mock typeface/print grain is an illustration; selected free font is slightly lighter. Camera corner marks and approved small mascot variant differ subtly. Camera subject/crop depends on actual user/phone and is not judged as identity fidelity to a fictional mock. These are acceptable nonblocking variation, not fake production imagery.

## Implementation checklist
- Completed combined/focused comparison and required five-surface review.
- Completed core interaction and responsive verification.
- Preserve existing4pools, latest label, privacy and cloud-only project architecture.
- Ready for existing GitHub Pages publish; final production deployment status must be checked separately.

final result: passed

## Personal profile validation (2026-10-08)
Source: user-provided personal Douyin profile screenshot in this conversation, used as layout reference only. No source screenshot or private image/text is saved in the repository. Compared the reference anatomy with rendered mobile capture `qa-results/profile-nailong.png` at390×844: cover/overlapping round identity, white rounded statistics panel, bio/tags, five utility icons, content tabs, management cards and3-column portrait grid. Existing system Chinese font, ink text, pink accents and white navigation match the current app. Intentional substitutions: public sunset cover/cat avatar, fictional nickname/ID/stats/bio, public authorized source thumbnails and local demo disclosures; omit iOS status bar/system chrome and private draft/game content. Real likes/saves and session watch history replace invented account data. The grid remains limited to the active pool.

Browser fallback: desktop IAB/browser connector unavailable; ran isolated Playwright with system Chromium. Four pools passed scroll/image readiness, editing name/bio/avatar, like/save synchronization, daily preview, source search/select, profile↔messages↔feed navigation, one camera request and one source decoder.320×640 and1440×900 captures verify no horizontal overflow and centered portrait desktop presentation. Typecheck/build,26 unit tests and Sites hosting checks pass. Existing delayed-media transition regression is also rerun. Camera permission was denied in these local tests; actual tracking regression remains covered by the existing synthetic-camera GitHub workflow.

Profile design QA result: passed. No outstanding P0–P2 visual or interaction failures.
