# Approved blue scanner UI demo QA

final result: passed

## Scope / source / normalization
User explicitly selected interface demonstration first, not identity registration/matching. Two query URLs preset the result; default feed unchanged.
- Visual truth: C:/Users/Administrator/.codex/generated_images/01a08ab6-32cd-75a3-b91b-d68df815ca9c/exec-36082f1a-10e2-4866-a4f7-051ce4322d72.png
- Board1448×1086px, three app-content states. Crop(0,0,483,1086), (483,0,965,1086), (965,0,1448,1086); preserve aspect when fitting390×844, center-pad black by approximately7px. No OS/browser chrome in source or implementation.
- Implementation: Chromium390×844 CSS viewport, deviceScaleFactor1, screenshots exactly390×844. Additional320×568 and1366×768 viewport captures check the existing portrait-stage layout.
- Final runtime capture commit5eb77502f5500b79fc1c24207838f80ed6a70543.
- Browser evidence: https://github.com/Anzu327/6311ass2/actions/runs/37665465889 (job112943424529). QA_SCAN_ACTIVE_NAILONG, QA_SCAN_RESULT_NAILONG_390, QA_SCAN_RESULT_LULU_390.
- Local screenshots: outputs/scanner-ui/implementation-active-nailong.jpg, implementation-result-nailong.jpg, implementation-result-lulu.jpg.
- Shared selected states: active scan; complete奶龙; complete噜噜. Real synthetic-camera mosaic intentionally differs from anonymous mock mosaic; no identifiable user/sample face appears in the scanner display.

## Comparison history
### Iteration1 — blocked
Atab2958f03618f64638e6bb7342b17a9fb8a1932f, build37663958353 and browser37663958497 passed functionality. Main opened full combined source/implementation and focused header/camera/controls/stickers comparisons.
Evidence preserved as outputs/scanner-ui/iteration-1-comparison-*.png.
- P2 typography: browser CJK fallback was thin/serif instead of bold sans. Fixed by a scanner-only self-hosted Noto Sans SC400/700/900 subset, with SIL OFL license. No external runtime font request.
- P2 blue scan-light clarity: beam was too faint. Fixed its display height/opacity and mesh opacity without changing animation timing.

### Iteration2 — passed
Re-captured runtime commit5eb77502f5500b79fc1c24207838f80ed6a70543; browser37665465889 and build37665465768 both successful.
Opened combined full-view images:
- outputs/scanner-ui/comparison-active-nailong.png
- outputs/scanner-ui/comparison-result-nailong.png
- outputs/scanner-ui/comparison-result-lulu.png
Opened focused comparison-active-nailong-header/camera/controls.png; comparison-result-nailong-sticker/controls.png; comparison-result-lulu-sticker.png.
Earlier P2 findings resolved. No actionable P0/P1/P2 remains for the approved UI-demo scope, not a claim of biometric recognition or completed classified video feeds.

## Required fidelity surfaces
- Fonts/typography: Noto Sans SC subset matches clean Chinese sans hierarchy; bold抖歪/CTA/lock row, regular scan status/caption/disclosure. Exact label text remains inside generated raster stickers, with accessible hidden headings. Body/UI fallback no longer renders serif.
- Spacing/layout rhythm: black full stage, camera at14.5% height and82% width, oversized tilted torn label overlaps lower camera, controls remain below, footer readable. Source aspect normalization is recorded; a few-pixel optical offsets and thicker corner legs remain P3.
- Colors/tokens: ice-blue#5cbcff scanning/mesh/corner/progress/completion, black backdrop, grayscale camera mosaic, yellow奶龙 paper, ivory/blue噜噜 paper, solid existing pink action. No green or red/blue chromatic glitch.
- Image quality/assets: independently generated transparent sticker/mesh/beam/corner WebPs placed and inspected. RGBA transparency verified; full text and torn borders unclipped. Standard check/lock/progress use Phosphor icons, no handcrafted SVG substitutes. No IP character invented and no fictional human fallback.
- Copy/content: labels exactly重度奶龙用户 / 噜噜资深粉. Truthful footer预设偏好 · 界面演示，非身份识别. Lock row intentionally says预设标签已锁定 instead of recommending-range locked, since classified content is not implemented yet. Manual mode says未使用人脸判断. Enter returns to existing feed.
- Interaction/accessibility: hidden feed controls inert during demo; visible CTA keyboard operable; live status/progress labels; reduced-motion beam fixed, animation-free label reveal; responsive320×568 controls within viewport.

## Functional / privacy verification
Final browser run passed:
- Original1.5s selected splash and default direct feed.
- Two explicit demo profiles; label never appears before scan.
- Blue beam actually changes position; two-second active scan before result; loss of valid face resets progress.
- Camera denied/no-input path requires explicit播放界面样例 and is labeled, no repeated permission request.
- No source video audio behind scanner.
- Same single camera stream and same face/segmentation model loads after进入推荐; comments still work.
- Three viewports; reduced motion; invaliddemo value preserves original feed.
- Existing six-video catalog, audio, replay, head overlay, loss→mosaic/recovery/revocation/pagehide cleanup regression checks passed.
- No runtime errors, missing assets/fonts or completed frame-upload requests; self-only connect-src preserved.
- No identity/gender/interest inference, enrollment, biometric template/database or capture persistence introduced.

Build/typecheck/unit tests/test:sites successful at37665465768. Protected hosting files unchanged. Source changes kept in cloud; local files are only raster assets/QA artifacts. ImageGen used for image assets; existing camera pipeline reused (Ponytail scope check).

## Residual P3 / intentional limits
- Progress icon is closest library segmented spinner rather than exact generated segments.
- Generated paper silhouette, corner thickness and minor optical spacing differ slightly.
- Camera content is dynamic and not the mock pixels.
- Real phone permission prompts/native camera compatibility still require user trial; browser tests use isolated synthetic camera only.
- Only demo interface/animation is delivered. Identity matching and奶龙/噜噜 classified source videos remain explicitly out of scope.

## Checklist
- [x] Selected visual unambiguously resolved, independent image assets installed.
- [x] Full and focused normalized comparison; earlier P2s fixed and recaptured.
- [x] Primary demo flow and original feed/camera/audio/privacy regression verified.
- [x] No unrequested classifiers or storage added.
- [ ] Merge and confirm actual Pages deployment before user handoff.

## Personal profile validation (2026-10-08)
Source: user-provided personal Douyin profile screenshot in this conversation, used as layout reference only. No source screenshot or private image/text is saved in the repository. Compared the reference anatomy with rendered mobile capture `qa-results/profile-nailong.png` at390×844: cover/overlapping round identity, white rounded statistics panel, bio/tags, five utility icons, content tabs, management cards and3-column portrait grid. Existing system Chinese font, ink text, pink accents and white navigation match the current app. Intentional substitutions: public sunset cover/cat avatar, fictional nickname/ID/stats/bio, public authorized source thumbnails and local demo disclosures; omit iOS status bar/system chrome and private draft/game content. Real likes/saves and session watch history replace invented account data. The grid remains limited to the active pool.

Browser fallback: desktop IAB/browser connector unavailable; ran isolated Playwright with system Chromium. Four pools passed scroll/image readiness, editing name/bio/avatar, like/save synchronization, daily preview, source search/select, profile↔messages↔feed navigation, one camera request and one source decoder.320×640 and1440×900 captures verify no horizontal overflow and centered portrait desktop presentation. Typecheck/build,26 unit tests and Sites hosting checks pass. Existing delayed-media transition regression is also rerun. Camera permission was denied in these local tests; actual tracking regression remains covered by the existing synthetic-camera GitHub workflow.

Profile design QA result: passed. No outstanding P0–P2 visual or interaction failures.
