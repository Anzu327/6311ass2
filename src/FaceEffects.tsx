import {useEffect,useRef,useState,type RefObject} from 'react';
import type {IdentityId} from './content';
import {coverPoint} from './faceGeometry';
export default function FaceEffects({video,active,identity,onStatus}:{video:RefObject<HTMLVideoElement|null>;active:boolean;identity:IdentityId|null;onStatus:(s:string)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null);const [retry,setRetry]=useState(0);
 useEffect(()=>{
 if(!active)return;
 let cancelled=false,frame=0,last=-1,lastRun=0;let tracker:import('@mediapipe/tasks-vision').FaceLandmarker|null=null;
 const sticker=new Image();sticker.src=`${import.meta.env.BASE_URL}media/cheek-effect.png`;
 onStatus('Loading face tracking…');
 const run=async()=>{try{
 const {FaceLandmarker,FilesetResolver}=await import('@mediapipe/tasks-vision');
 const files=await FilesetResolver.forVisionTasks(`${import.meta.env.BASE_URL}vision/wasm`);
 const model=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:`${import.meta.env.BASE_URL}vision/face_landmarker.task`,delegate:'CPU'},runningMode:'VIDEO',numFaces:1});
 if(cancelled){model.close();return;}tracker=model;
 const tick=(time:number)=>{
 if(cancelled)return;frame=requestAnimationFrame(tick);const v=video.current,c=canvas.current;if(!v||!c||v.readyState<2||last===v.currentTime||time-lastRun<80)return;
 last=v.currentTime;lastRun=time;const w=c.clientWidth,h=c.clientHeight;const d=Math.min(window.devicePixelRatio,2);if(c.width!==w*d||c.height!==h*d){c.width=w*d;c.height=h*d;}
 const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 try{const result=tracker!.detectForVideo(v,time);const face=result.faceLandmarks[0];if(!face){onStatus('Move your face into the frame');return;}onStatus('Face tracked · effects follow you');
 const p=(i:number)=>coverPoint(face[i],v.videoWidth,v.videoHeight,w,h);
 const left=p(234),right=p(454),top=p(10),bottom=p(152);const faceWidth=Math.abs(right.x-left.x);
 const color=identity==='tech'?'#b7ff66':identity==='culture'?'#ff9ece':'#53f5ed';
 ctx.strokeStyle=color;ctx.lineWidth=1.4;const x=Math.min(left.x,right.x)-12,y=top.y-12,bw=faceWidth+24,bh=bottom.y-top.y+24,edge=18;
 [[x,y,1,1],[x+bw,y,-1,1],[x,y+bh,1,-1],[x+bw,y+bh,-1,-1]].forEach(([a,b,sx,sy])=>{ctx.beginPath();ctx.moveTo(a+edge*sx,b);ctx.lineTo(a,b);ctx.lineTo(a,b+edge*sy);ctx.stroke();});
 if(identity){
 if(identity==='soft'&&sticker.complete&&sticker.naturalWidth){[50,280].forEach(i=>{const point=p(i),size=faceWidth*.28;ctx.drawImage(sticker,point.x-size/2,point.y-size/2,size,size);});}
 else {const a=p(33),b=p(263);const angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.save();ctx.translate((a.x+b.x)/2,(a.y+b.y)/2);ctx.rotate(angle);ctx.strokeStyle=color;ctx.lineWidth=2;const width=Math.hypot(b.x-a.x,b.y-a.y);ctx.strokeRect(-width*.67,-faceWidth*.075,width*1.34,faceWidth*.15);ctx.restore();}
 const forehead=p(10);ctx.font='600 10px monospace';ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(identity==='soft'?'DREAMER':identity==='tech'?'OPTIMIZED':'CURATED',forehead.x,forehead.y-20);
 }
 }catch{onStatus('Tracking paused · keep your face in view');}
 };frame=requestAnimationFrame(tick);
 }catch{if(!cancelled){onStatus('Face tracking unavailable · camera preview still works');setRetry(1);}}};run();
 return()=>{cancelled=true;cancelAnimationFrame(frame);tracker?.close();};
 },[active,identity,video,onStatus]);
 return <><canvas ref={canvas} className="face-effects" aria-hidden="true"/>{retry>0&&<span className="tracking-fallback">Effects unavailable on this device</span>}</>;
}
