# Douyin-style feed / comments design QA

final result: passed

## Scope and visual truth
- User-selected source feed: E:/微信/微信聊天记录/xwechat_files/bailing7935_a5eb/temp/RWTemp/2026-10/9e20f478899dc29eb19741386f9343c8/cffa4d36364957a272548f01b8cd0aa4.png
- User-selected source comments: same directory/a16c0342e31aee78a84b2336973ad9fe.png
- Both originals:1206×2622px. Native iOS status/home chrome excluded using crop(0,177,1206,2520), resized to390×758px.
- Implementation: real Chromium browser screenshots at390×758 CSS px, deviceScaleFactor1, branch capture commit9d394702f95e175a9ef57c2540c0c480d5649cd7.
- Browser evidence: https://github.com/Anzu327/6311ass2/actions/runs/37633406016
- Log/artifact labels: QA_SCREENSHOT_FEED_REFERENCE, QA_SCREENSHOT_COMMENTS_REFERENCE.
- Local implementation evidence: C:/Users/Administrator/Documents/ChatGPT/山寨/outputs/douyin-ui/implementation-feed.jpg and implementation-comments.jpg.
- Same interaction states: portrait recommendation feed; white unexpanded comment sheet with first replies collapsed and a later nested reply open. Feed capture includes active local like/save.
- Existing six supplied meme videos intentionally replace reference cat/basketball. Native device chrome is not recreated. No live Douyin data/backend is implied.

## Comparison history
### Iteration1 — blocked
Combined full images and focused header/rail/caption/sheet-top/rows/composer comparisons were opened together, not judged from separate screenshots.
Evidence preserved as outputs/douyin-ui/iteration-1-comparison-*.png.
- P2 feed rail approximately50px too high: reduced bottom inset111→66px.
- P2 oversized navigation and high caption: navigation65→48px; resized plus35×30; reduced caption minimum height/inset; expanded text button now separate from clamped paragraph.
- P2 video region too short: media bottom inset190→169px, preserving contain scaling.
- P2 comment heading/tab region too tall: heading52→42px, tabs44px, scroll top11px.
- P2 row density: smaller body/metadata spacing,19px row gap; two-line first mock comment and a nested later reply restore source rhythm.
- Composer bottom padding reduced; no pasted-image suggestion bubble duplicated.

### Iteration2 — matched reference states; responsive follow-up blocked
Revised capture from browser run37633406016 compared against normalized originals.
Full-view evidence:
- outputs/douyin-ui/comparison-feed.png
- outputs/douyin-ui/comparison-comments.png
Focused evidence, all opened and inspected:
- comparison-feed-header.png, comparison-feed-rail.png, comparison-feed-caption.png
- comparison-comments-sheet-top.png, comparison-comments-rows.png, comparison-comments-composer.png
Reference-state comparison resolved the original P2 findings. Additional1366×768 capture revealed a P2: the selected 推荐 tab could be partly clipped when resizing the portrait stage. The existing active-tab alignment effect now also handles window resize, and QA asserts full tab visibility at all three viewports.

### Iteration3 — final responsive confirmation
The following capture/check reruns the unchanged390×758 reference states and resized feed states. Final result requires all checks and capture inspection to pass. This is a matching interface anatomy, not a claim of pixel-exact reproduction of native Douyin.

## Required fidelity surfaces
- Fonts/typography: system sans stack preserves native PingFang SC/Microsoft YaHei on target devices; compact Chinese channels, heavier creator/navigation, lighter comment metadata and clear body hierarchy. No marketing display typography in the feed. Browser/OS CJK fallback rasterization differs slightly from native iOS (P3).
- Spacing/layout rhythm: full-view and focused checks confirm low text-led footer, complete side rail, contain video, in-stage white bottom sheet at28.5%, compact header/tabs, nested replies and fixed composer. Earlier P2 offsets fixed. Different source aspect ratios intentionally produce black contain margins.
- Colors/tokens: black feed, dark footer, white controls, muted inactive labels, pink follow/heart/unread, yellow active save; white comment surface, ink body, light gray names and composer. Active-state colors differ from the unliked reference intentionally.
- Images/assets: supplied video/audio preserved. Generated144px animal/landscape WebP avatars match circular photographic treatment, not fictional human face fallback. Standard icons from Phosphor, no hand-drawn replacements. No fake battery/time/home indicator. Mosaic fallback still masks source heads before video reveal.
- Copy/content: screenshot UI anatomy uses Chinese navigation/comments labels; 同城 avoids false location claims. Mock comments concern repeated recommendations and face appropriation, not copying real commenters. AI解析 is explicitly preset artwork explanation. Local comments/images and simulated counts are explained in artwork copy.
- Affordances/accessibility: labeled buttons, keyboard video toggle, arrows for feed, comment Escape/focus trap, selected/pressed states, reduced motion and safe-area spacing. Native mobile safe-area/keyboard rendering needs device-specific confirmation.

## Functional / regression checks
Run37633406016 passed:
-1.5-second existing intro; one automatic video-only camera request afterward.
-All six actual MP4/WebM clips, audio tracks, default audible attempt, autoplay hint, pause/play/replay and cyclic navigation.
-Comment sheet shrinks video without restarting camera pipeline; close/expand/AI tab; replies; votes; local posting and retained posted text across reopen; image picker local-only.
-390×844,320×568,1366×768 browser viewport checks; additional390×758 source comparison.
-Synthetic camera moving head, disappearance→mosaic, recovery, denied permission and pagehide cleanup.
-No browser runtime errors, missing local assets or frame-upload requests.
Check artwork run37633405882 passed typecheck/tests/build/test:sites.
Tests use isolated synthetic camera input, not a user's camera.
A final nonvisual stylesheet deduplication removes identical responsive rule repetitions without changing computed layout.

## Follow-up polish / residual gaps
- P3 native iOS vs Linux font antialiasing and icon optical differences.
- P3 compare physical-phone keyboard/safe area on the user's browser; synthetic Chromium does not verify actual camera permission prompts on every OS.
- Exact reference video/messages/avatars/native chrome intentionally not copied.
- Mock comments are local UI, not a real community service.

## Implementation checklist
- [x] Compare full and focused matched states; resolve all P0/P1/P2.
- [x] Preserve video/camera/audio/mosaic/splash and hosting files.
- [x] Verify primary interactions and browser runtime.
- [x] Remove duplicate style rules; reuse existing pipeline/components.
- [ ] Merge verified branch and verify production Pages deployment.
