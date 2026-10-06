
import {useEffect,useRef,type RefObject} from 'react';
import {coverPoint} from './faceGeometry';
interface Props {video:RefObject<HTMLVideoElement|null>;active:boolean;onStatus:(s:string)=>void;}
export default function FaceTracking({video,active,onStatus}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  if(!active)return;
  let cancelled=false,frame=0,last=-1,lastRun=0,lastStatus='',tracker:import('@mediapipe/tasks-vision').FaceLandmarker|null=null;
  let bounds:{x:number;y:number;width:number;height:number}|null=null;
  const say=(s:string)=>{if(!cancelled&&s!==lastStatus){lastStatus=s;onStatus(s);}};
  const tick=(time:number)=>{
   if(cancelled)return;frame=requestAnimationFrame(tick);
   const c=canvas.current,v=video.current;if(!c||!v||v.readyState<2)return;
   const w=c.clientWidth,h=c.clientHeight,d=Math.min(window.devicePixelRatio,2);if(!w||!h)return;
   if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
   const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
   if(tracker&&time-lastRun>=80&&last!==v.currentTime){last=v.currentTime;lastRun=time;
    try{const f=tracker.detectForVideo(v,time).faceLandmarks[0];if(f){
     const x=Math.max(0,Math.min(f[234].x,f[454].x)-.025),y=Math.max(0,f[10].y-.025);
     bounds={x,y,width:Math.min(1-x,Math.abs(f[454].x-f[234].x)+.05),height:Math.min(1-y,Math.max(.02,f[152].y-f[10].y+.055))};say('LIVE · face tracked');
    }else{bounds=null;say('Move your face into the frame');}}catch{bounds=null;say('Tracking paused · move back into view');}
   }
   if(bounds){const a=coverPoint({x:bounds.x,y:bounds.y},v.videoWidth,v.videoHeight,w,h),b=coverPoint({x:bounds.x+bounds.width,y:bounds.y+bounds.height},v.videoWidth,v.videoHeight,w,h);ctx.strokeStyle='#53f5ed';ctx.lineWidth=1;ctx.strokeRect(Math.min(a.x,b.x),a.y,Math.abs(b.x-a.x),b.y-a.y);}
  };
  frame=requestAnimationFrame(tick);say('Loading face tracking…');
  void(async()=>{try{
   const {FaceLandmarker,FilesetResolver}=await import('@mediapipe/tasks-vision');
   const files=await FilesetResolver.forVisionTasks(import.meta.env.BASE_URL+'vision/wasm');if(cancelled)return;
   const model=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:import.meta.env.BASE_URL+'vision/face_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numFaces:1});
   if(cancelled){model.close();return;}tracker=model;say('Move your face into the frame');
  }catch{say('Tracking unavailable · camera preview still works');}})();
  return()=>{cancelled=true;cancelAnimationFrame(frame);tracker?.close();};
 },[active,video,onStatus]);
 return <canvas ref={canvas} className="face-tracking" aria-hidden="true"/>;
}
