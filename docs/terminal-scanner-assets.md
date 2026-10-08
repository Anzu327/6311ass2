# Terminal scanner assets

Selected visual: third displayed ImageGen preview exec-ac229e89-2199-4b09-a50a-00f09bd2143c.png. Existing app source preserved.

- public/media/terminal-texture.webp: built-in ImageGen charcoal analog substrate,15.7KiB compressed.
- public/media/terminal-corners.webp: built-in ImageGen transparent corner-only guide; no baked photo.
- public/media/terminal-ruler.webp: built-in ImageGen transparent tick overlay.
- public/media/terminal-mark.webp: reused approved 抖歪 mascot, not an official logo.
- public/media/scan-beam.webp: reused original blue sweep.
- public/media/terminal-display.ttf: officialGoogleFonts OswaldBold, glyph subset; license terminal-display-OFL.txt.

No mock/test/user portrait bundled by this change. Camera remains local and dynamic. ImageGen prompt set follows (texture and two transparent guide assets):

# Terminal texture

Built-in ImageGen; style-reference generation, not a UI edit.

Use case: stylized-concept. Asset type: blank analog-film texture for a minimalist mobile terminal background. Reference image is style only; generate ONLY the nearly black charcoal substrate behind its interface, no interface itself. Tall portrait approximately 1024x1664. Uniform near-black charcoal centered on #090d0f, extremely subtle fine analog film grain, faint microscopic irregular speckle and very sparse hairline scratches, tiny dark-gray variation only. Flat evenly dark surface, understated worn printed-film quality, low contrast and low texture amplitude, no focal point. No text, letters, symbols, frames, borders, faces, people, UI, scene, architecture, gradients, blue scanning lines, red labels, prominent scratches, bright dots or vignette. Full-bleed opaque rectangular texture suitable for CSS background cover. Reference is not edit target; discard all its semantic elements.

Inspected: blank charcoal film-grain texture, no semantic UI elements or text. Saved PNG is 984x1599; retain native aspect ratio and use cover if needed.
# Corner-only registration overlay

Built-in ImageGen edit. Genuine alpha transparency preserved.

Use case: precise-object-edit. Input image is edit target, a transparent registration guide overlay. Change only by removing EVERY outer gray rectangle, border, hairline, outline, doubled frame, tiny colored edge speckle, shadow and stray pixel. Keep exactly FOUR clean off-white L-shaped corner marks in the same four corner positions, same thickness, same orientation, with same approximately 4 percent inset layout and same canvas/empty center. All pixels except the four off-white marks must be genuinely transparent. Corners must be pure clean flat solid #eeeae0 with straight uniform strokes, squared ends and no outlines/shadows/texture. Do not add anything. No surrounding rectangle at all. No background, face, grid, glow, text, photo, UI or color speckles. Preserve alpha transparency.
# Terminal ruler

Built-in ImageGen; inspected final transparent overlay. Center alpha verified 0. Native 1254x1254.

Create a pristine transparent square UI ruler overlay: ONLY 17 perfect flat horizontal short line strokes down the far right edge, x96%, y5–95%, each width2%ofcanvaswidth, stroke3px at1024. All strokes pure neutral off-white #d5d4cc. No beveled edges, outlines, chrome, shadows, glow, dashes within each mark, colored red/yellow pixels or artifacts. Absolutely empty actual transparent alpha elsewhere. Geometrically clean simple flat two-dimensional ruler, no text or frames. Canvas1024x1024.

Generated variant 2 selected; variant 1 had visible colored artifacts and was discarded.
