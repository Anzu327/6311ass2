# Original-video head-overlay trial

The old rejected effect library remains removed. The user superseded the animation-only direction for this one approved original-video trial.

- `public/media/qinghai-original.mp4`: supplied source MP4,720×1166,30fps,533frames,17.77seconds. Original watermark and audio preserved.
- `public/media/qinghai-track.json`: offline central-character face trajectory,533frames, with position, size and angle. Source automatically detected525frames;8were interpolated, longest gap4frames.
- `public/media/qinghai-demo-head.webp`: entirely fictional adult male head, generated with built-in ImageGen. No user or video-subject identity. Sample only.
- Runtime head height uses the approved v2 factor2.5 compared to1.65 in v1, about52%larger linearly; chin anchored to source body.

When explicitly enabled, the webcam's current face/hair pixels replace the sample. Face Landmarker and selfie multiclass segmentation run locally. Frames, landmarks and cutouts are not saved or uploaded. Camera off restores demo; no detected face clears the last live head immediately. No gender or identity inference.

Limitations:2D collage, not a neural identity swap. This clip's white glove occlusion uses a brightness approximation outside the original face box, not a universal depth mask. Fast turns, hair edges and gloves across the original face can be imperfect. CPU inference is adaptively throttled180–500ms; actual mobile-camera performance still needs the creator's device trial.

Only one source clip is available; scrolling replays it. The approved splash and1.5-second entry are unchanged.
