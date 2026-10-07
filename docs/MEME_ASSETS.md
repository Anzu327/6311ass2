# Original-video head-overlay trial

The old rejected effect library remains removed. The user superseded the animation-only direction for this one approved original-video trial.

- `public/media/qinghai-original.mp4`: supplied source MP4,720×1166,30fps,533frames,17.77seconds. Original watermark and audio preserved.
- `public/media/qinghai-track.json`: offline central-character face trajectory,533frames, with position, size and angle. Source automatically detected525frames;8were interpolated, longest gap4frames.
- `docs/test-fixtures/qa-head.webp`: fictional head for synthetic-camera tests only; excluded from production static assets.
- Runtime head height uses the approved v2 factor2.5 compared to1.65 in v1, about52%larger linearly; chin anchored to source body.

When explicitly enabled, the webcam's current face/hair pixels replace the source-head mosaic. Face Landmarker and selfie multiclass segmentation run locally. Frames, landmarks and cutouts are not saved or uploaded. Camera off restores a6×8block mosaic of the source head; no detected face clears the last live head immediately and renders the mosaic. No gender or identity inference.

Limitations:2D collage, not a neural identity swap. This clip's white glove occlusion uses a brightness approximation outside the original face box, not a universal depth mask. Fast turns, hair edges and gloves across the original face can be imperfect. CPU inference is adaptively throttled180–500ms; actual mobile-camera performance still needs the creator's device trial.

Only one source clip is available; scrolling replays it. The approved splash and1.5-second entry are unchanged.

Browser compatibility: the supplied HEVC clip is transcoded to H.264 Main/yuv420p with its AAC audio copied and MP4 faststart. Runtime file keeps all533frames and original dimensions/rate; not an untouched binary copy. The supplied original remains unchanged outside this repository.

A VP9/Opus WebM alternative is also included for browsers without MP4 codec support. The browser selects one compatible source; both preserve the full source choreography, framing and audio content.

Privacy: a connect-src self CSP blocks the runtime library's external logging endpoint. Browser QA requires this policy and checks there are no completed non-GET/upload requests. This is separate from camera compositing, which never serializes or submits frames.

The profile circle now uses a neutral user icon. Source video is hidden until the first protected overlay is ready. No production fictional face fallback remains.


## Six-clip expansion (2026-10-07)
The user supplied five additional video files. Runtime catalog now contains six distinct source clips:
- 青海摇: original supplied17.77-second clip; central gray-trouser dancer.
- 蓝色妖姬跑步:7.73s; blue suit and golden shoes, target runner; ten black/fade frames suppress pasted heads.
- 社会摇:9.83s; target center NY-print-shirt dancer, not the two side dancers.
- 我要迪士尼:26.57s from the29.07s screen recording, removing initial2.5s transient controls and lower player toolbar, retaining performance scenes/subtitles. Landscape720×370 is contained, not forced into a portrait crop.19 detected scene transitions reset smoothing.
- 山东菏泽曹县:5.93s, close-up. Manually stabilized head/neck bounds avoid detector size jumps.
- 退退退:6.07s, manually calibrated foreground red-shirt head. Back/side-facing body means a frontal webcam head remains an intentionally comic2D collage, not a natural3D face swap.
Every source has an audio stream. Both H.264/AAC MP4 and VP9/Opus WebM are included. Original source files remain unchanged. Codec conversion and resizing affect delivered bytes; do not call them untouched originals.
The head scale retains2.5 when it fits, with width/top caps on close-ups. Mosaic always underlies live heads; unused bright foreground restoration is disabled except for青海摇. Test real phone/camera hair edges and motion separately.

When a camera face is present, the source-head base is heavily softened before the live head is composited; hard6×8mosaic blocks remain only for missing-camera-face mode. This avoids huge square blocks surrounding close-up cutouts. The UI has a transparent top/bottom shade for readability on bright outdoor footage; source video files are not darkened.
