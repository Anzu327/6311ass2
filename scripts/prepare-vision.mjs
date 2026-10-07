import { mkdir,copyFile,readdir,access,writeFile } from 'node:fs/promises';
const root=new URL('../public/vision/',import.meta.url);
await mkdir(new URL('wasm/',root),{recursive:true});
const source=new URL('../node_modules/@mediapipe/tasks-vision/wasm/',import.meta.url);
for(const file of await readdir(source))await copyFile(new URL(file,source),new URL(`wasm/${file}`,root));
const model=new URL('face_landmarker.task',root);
try{await access(model);}catch{
 console.log('Downloading official MediaPipe face landmark model…');
 const response=await fetch('https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',{signal:AbortSignal.timeout(120000)});
 if(!response.ok)throw new Error(`Face model download failed: ${response.status}`);
 await writeFile(model,new Uint8Array(await response.arrayBuffer()));
}

const headModel=new URL('selfie_multiclass.tflite',root);
try{await access(headModel);}catch{
 console.log('Downloading official MediaPipe head segmentation model…');
 const response=await fetch('https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite',{signal:AbortSignal.timeout(120000)});
 if(!response.ok)throw new Error(`Head model download failed: ${response.status}`);
 await writeFile(headModel,new Uint8Array(await response.arrayBuffer()));
}
