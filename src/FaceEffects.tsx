
import {useEffect,useRef,type RefObject} from 'react';
import type {IdentityId} from './content';
import {coverPoint} from './faceGeometry';
import {paintMeme,type FaceSignal,type MemeImages} from './memeRenderer';
import type {MemeEffect} from './memes';
interface Props {video:RefObject<HTMLVideoElement|null>;active:boolean;identity:IdentityId|null;onStatus:(s:string)=>void;effect?:MemeEffect|null;demo?:boolean;index?:number;}
export default function FaceEffects({video,active,identity,onStatus,effect=null,demo=false,index=0}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);const current=useRef({effect,identity,index});current.current={effect,identity,index};
 useEffect(()=>{
  if(!active)return;
  let cancelled=false,failed=false,frame=0,last=-1,lastRun=0,lastStatus='',tracker:import('@mediapipe/tasks-vision').FaceLandmarker|null=null,face:FaceSignal|null=null;
  const say=(s:string)=>{if(!cancelled&&s!==lastStatus){lastStatus=s;onStatus(s);}};
  const portrait=new Image();portrait.src=import.meta.env.BASE_URL+'media/demo-portrait.jpg';
  const images:MemeImages={};for(const id of ['cat','hood','dino','hybrid','duck'] as const){const image=new Image();image.src=import.meta.env.BASE_URL+'media/meme-'+id+'.webp';images[id]=image;}
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick=(time:number)=>{
   if(cancelled)return;frame=requestAnimationFrame(tick);
   const c=canvas.current,v=video.current,source=demo?portrait:v;if(!c||!source||(demo?!portrait.naturalWidth:!v||v.readyState<2))return;
   const w=c.clientWidth,h=c.clientHeight,d=Math.min(window.devicePixelRatio,2);if(!w||!h)return;if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
   const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
   if(demo){face={x:.30,y:.11,width:.40,height:.31,smile:reduced ? .35:.35+Math.sin(time/900)*.25,mouth:reduced ? .12:.12+Math.max(0,Math.sin(time/430))*.25,tilt:reduced?0:Math.sin(time/1300)*.10};say('DEMO · sample face');}
   else if(tracker&&v&&time-lastRun>=80&&last!==v.currentTime){
    last=v.currentTime;lastRun=time;
    try{const r=tracker.detectForVideo(v,time),f=r.faceLandmarks[0];if(f){
     const x=Math.max(0,Math.min(f[234].x,f[454].x)-.025),y=Math.max(0,f[10].y-.025);
     const width=Math.min(1-x,Math.abs(f[454].x-f[234].x)+.05),height=Math.min(1-y,Math.max(.02,f[152].y-f[10].y+.055));
     const b=r.faceBlendshapes[0]?.categories||[];const score=(name:string)=>b.find(x=>x.categoryName===name)?.score||0;
     face={x,y,width,height,smile:(score('mouthSmileLeft')+score('mouthSmileRight'))/2,mouth:score('jawOpen'),tilt:Math.atan2((f[263].y-f[33].y)*v.videoHeight,(f[263].x-f[33].x)*v.videoWidth)*-1};
     say('LIVE · face tracked');
    }else{face=null;say('Move your face into the frame');}}catch{face=null;say('Tracking paused · move back into view');}
   }
   const mode=current.current;
   if(mode.effect){
    if(face){paintMeme({ctx,source,face,images,effect:mode.effect,width:w,height:h,time,index:mode.index,mirror:!demo,reduced});}
    else{ctx.fillStyle='#101013';ctx.fillRect(0,0,w,h);if(v?.videoWidth){const scale=Math.max(w/v.videoWidth,h/v.videoHeight);ctx.save();ctx.translate(w,0);ctx.scale(-1,1);ctx.globalAlpha=.7;ctx.drawImage(v,(w-v.videoWidth*scale)/2,(h-v.videoHeight*scale)/2,v.videoWidth*scale,v.videoHeight*scale);ctx.restore();}ctx.fillStyle='#fff';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(failed?'Tracking unavailable. Tap LIVE for sample mode.':tracker?'Move your face into view':'Face tracking is loading…',w/2,h*.55);}
   }else if(face&&!demo&&v){const a=coverPoint({x:face.x,y:face.y},v.videoWidth,v.videoHeight,w,h),b=coverPoint({x:face.x+face.width,y:face.y+face.height},v.videoWidth,v.videoHeight,w,h);ctx.strokeStyle='#53f5ed';ctx.lineWidth=1;ctx.strokeRect(Math.min(a.x,b.x),a.y,Math.abs(b.x-a.x),b.y-a.y);}
  };
  frame=requestAnimationFrame(tick);
  if(!demo){say('Loading face tracking…');void(async()=>{try{
   const {FaceLandmarker,FilesetResolver}=await import('@mediapipe/tasks-vision');
   const files=await FilesetResolver.forVisionTasks(import.meta.env.BASE_URL+'vision/wasm');if(cancelled)return;
   const model=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:import.meta.env.BASE_URL+'vision/face_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:true});
   if(cancelled){model.close();return;}tracker=model;say('Move your face into the frame');
  }catch{failed=true;say('Tracking unavailable · switch to sample mode');}})();}
  return()=>{cancelled=true;cancelAnimationFrame(frame);tracker?.close();};
 },[active,demo,video,onStatus]);
 return <canvas ref={canvas} className="face-effects" aria-hidden="true"/>;
}
