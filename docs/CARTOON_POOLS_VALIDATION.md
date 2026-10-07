# Two original-cartoon pools —2026-10-08

## Delivered behavior
- Explicit ?demo=lulu: original blue scan and preset噜噜资深粉 result →8supplied original cartoon clips.
- Explicit ?demo=nailong: original blue scan and preset重度奶龙用户 result →7supplied奶龙／奶蛙 clips together.
- One current-catalog selector governs wheel/swipe/arrows/replay, source counters, Explore/search/friends/plus. Catalog cannot switch to the other group within the session.
- Default URL retains original6human-meme clips and approved camera-head/mosaic system.
- Cartoon sources have no head track and no visible overlay canvas; no camera head, mosaic or synthetic avatar is drawn on them. Unused cutout processing stops after scan.
- Group comes from preset URL. No photo-based identity/gender/interest matching. Personal photographs are not uploaded/published.

## Media preparation
Local evidence: C:/Users/Administrator/Documents/ChatGPT/山寨/outputs/ip-video-batch/
- All15source files readable and include sound; source duration300.17seconds.
- Sources HEVC. Full-duration, full-framing derivatives use H.264/AAC MP4 with faststart and VP9/Opus WebM fallback. Equal-aspect576px width,30fps.
- MP4 AAC stream-copied; raw ADTS SHA256 identical between every source/output.
- WebM Opus is a standard original-sound format conversion, no new voice/gain/creative processing.
- Original files unmodified. No content, watermarks or promotional endings removed.
- Git blob hashes of all30uploaded media match local bytes.
- Source-to-output mapping: docs/cartoon-media.json. Alternate encodings count as15clips, not30.

## Failure analysis / repairs
- Initial browser run37671476275 failed loading first new MP4. Run37672293552 captured actual canPlayType result: empty support for declared H.264/AAC, while uploaded bytes matched local hashes. Existing videos had WebM fallback; add equivalent fallback for all15newclips rather than weakening tests.
- Run37673289925 was cancelled at the6-minute limit during APT/Ubuntu browser-dependency download, before running app tests. Retry with next commit; no bypass of checks.
- Restore required dual-format media contract, remove now-unused optional-WebM rendering branch, and hide the overlay immediately for untracked sources.

## Successful runtime verification
Runtime commit71e9b4c6fadaae8f6863646c2c9f787ea84d377c.
- Build/typecheck/unit/test:sites: https://github.com/Anzu327/6311ass2/actions/runs/37674538650 —success.
- Browser: https://github.com/Anzu327/6311ass2/actions/runs/37674538544 —success, job112974514836.
- Every15clip decoded with original sound, correct group/id/counter, complete contain framing and zero overlay alpha.
-7/8catalog counts, wrap to own first clip, replay/current source, search/friends restricted, comments usable.
- Scan has no premature result, beam moves, two-second delay, face-loss reset, same camera request, no model restart, denied-camera labeled manual example/reduced motion/invalid URL.
-390×844/320×568/1366×768 scanner viewport checks and original feed/comment regression.
- Existing6clips, camera loss/recovery/revocation/pagehide cleanup, original audio, source mosaic/segmentation regression all passed.
- No runtime errors, missing media/fonts or completed frame-upload requests.
- Actual browser screenshots QA_POOL_LULU_0/7 and QA_POOL_NAILONG_0/3/6 opened and inspected: characters and embedded source content intact; no added head/face/mosaic, footer/buttons readable. Expected letterboxing for square/landscape footage, no forced crop.
- Final follow-up only makes camera-recovery copy truthful for either raw or overlay feeds and records this report; not a visual redesign.

## Publication
Merge only after final checks. Verify Pages deployment and actual production asset/index responses before handing off. Demo labels are preset, not evidence of recognizing the supplied private photos.
