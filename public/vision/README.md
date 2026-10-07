# Local face tracking assets

MediaPipe tasks-vision WASM files copied from the installed npm package (Apache-2.0; see accompanying notice).
Face Landmarker model downloaded from Google's official sample model URL:
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task

Used only for browser-local position/landmark detection, not identity or personality inference. Model/runtime failures disable tracking without blocking the artwork.


The approved head-overlay trial also bundles Google's official selfie multiclass model:
https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
Categories: background0, hair1, body-skin2, face-skin3, clothes4, accessories5.
It is downloaded during installation and processed only on-device. No gender, identity or personality classification is performed. Both camera models are closed when the camera is switched off. Inference is throttled adaptively; older mobile hardware can update the live cutout more slowly than the playing clip.
