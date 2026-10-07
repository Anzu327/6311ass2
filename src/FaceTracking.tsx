import {useEffect,useRef,type RefObject} from 'react';
import {containBox,sampleHead,headCrop,isHeadCategory,validHeadTrack,type HeadTrack} from './faceGeometry';
import type {FaceLandmarker,ImageSegmenter} from '@mediapipe/tasks-vision';
interface Props {video:RefObject<HTMLVideoElement|null>;clip:RefObject<HTMLVideoElement|null>;active:boolean;onStatus:(s:string)=>void;}
interface Cutout {image:HTMLCanvasElement;chinX:number;chinY:number;top:number;angle:number;}
const base=import.meta.env.BASE_URL;
export default function FaceTracking({video,clip,active,onStatus}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),liveHead=useRef<Cutout|null>(null),useCamera=useRef(active);useCamera.current=active;
 // One renderer for both sample mode and real camera mode; no legacy guide/collage.
 useEffect(()=>{
  let disposed=false,frame=0,lastStatus='',track:HeadTrack|null=null,demo:HTMLCanvasElement|null=null,lastVideo=-1;
  const gloves=document.createElement('canvas'),gctx=gloves.getContext('2d',{willReadFrequently:true})!;
  const say=(s:string)=>{if(!disposed&&s!==lastStatus){lastStatus=s;onStatus(s);}};
  const controller=new AbortController();
  void(async()=>{try{
   const response=await fetch(base+'media/qinghai-track.json',{signal:controller.signal});if(!response.ok)throw new Error('track');
   const data:unknown=await response.json();if(!validHeadTrack(data))throw new Error('track');
   const image=new Image();image.src=base+'media/qinghai-demo-head.webp';await image.decode();
   if(disposed)return;track=data;
   const sample=document.createElement('canvas');sample.width=image.width;sample.height=image.height;
   const sctx=sample.getContext('2d')!;sctx.drawImage(image,0,0);sctx.globalCompositeOperation='destination-in';
   const neck=sctx.createLinearGradient(0,sample.height*.877,0,sample.height*.924);neck.addColorStop(0,'#fff');neck.addColorStop(1,'#fff0');sctx.fillStyle=neck;sctx.fillRect(0,0,sample.width,sample.height);
   demo=sample;say('DEMO · sample face');
  }catch{if(!disposed)say('Clip assets unavailable · reload to retry');}})();
  const tick=()=>{
   if(disposed)return;frame=requestAnimationFrame(tick);
   const c=canvas.current,v=clip.current;if(!c||!v||v.readyState<2||!track||!demo)return;
   const width=c.clientWidth,height=c.clientHeight,dpr=Math.min(devicePixelRatio,2);if(!width||!height)return;
   if(c.width!==Math.round(width*dpr)||c.height!==Math.round(height*dpr)){c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);}
   const ctx=c.getContext('2d')!;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const [x,y,w,h,angle]=sampleHead(track,v.currentTime),box=containBox(track.width,track.height,width,height);
   const head=useCamera.current?liveHead.current:null;
   const image=head?.image??demo,chinX=head?.chinX??demo.width*.494,chinY=head?.chinY??demo.height*.838;
   const top=head?.top??demo.height*.048,sourceAngle=head?.angle??.0018;
   const scale=h*2.5/(chinY-top)*box.scale;
   ctx.save();ctx.translate(box.x+(x+w*.5)*box.scale,box.y+(y+h*1.035)*box.scale);
   ctx.rotate(Math.max(-.42,Math.min(.42,angle-sourceAngle)));ctx.scale(scale,scale);
   ctx.filter='saturate(65%) brightness(82%)';ctx.drawImage(image,-chinX,-chinY);ctx.restore();
   c.dataset.headSource=head?'live':'demo';
   if(!useCamera.current)say('DEMO · sample face');
   // This clip has white gloves. Restore only bright foreground around the face.
   // Excluding the original face prevents its highlights leaking through the cutout.
   const gx=Math.max(0,Math.floor(x-w*.85)),gy=Math.max(0,Math.floor(y+h*.15));
   const gw=Math.min(track.width-gx,Math.ceil(w*2.7)),gh=Math.min(track.height-gy,Math.ceil(h*1.6));
   if(lastVideo!==v.currentTime){
    lastVideo=v.currentTime;gloves.width=gw;gloves.height=gh;gctx.drawImage(v,gx,gy,gw,gh,0,0,gw,gh);
    const pixels=gctx.getImageData(0,0,gw,gh);
    for(let i=0;i<pixels.data.length;i+=4){
     const px=gx+(i/4)%gw,py=gy+Math.floor(i/4/gw),r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2],max=Math.max(r,g,b),min=Math.min(r,g,b);
     const inFace=px>=x-w*.1&&px<=x+w*1.1&&py>=y-h*.1&&py<=y+h*1.1;
     pixels.data[i+3]=!inFace&&max>155&&(max-min)/max<.15?255:0;
    }gctx.putImageData(pixels,0,0);
   }
   ctx.drawImage(gloves,box.x+gx*box.scale,box.y+gy*box.scale,gw*box.scale,gh*box.scale);
  };frame=requestAnimationFrame(tick);
  return()=>{disposed=true;controller.abort();cancelAnimationFrame(frame);liveHead.current=null;};
 },[clip,onStatus]);
 useEffect(()=>{
  liveHead.current=null;if(!active)return;
  let disposed=false,frame=0,last=-1,lastRun=0,interval=180,lastStatus='',tracker:FaceLandmarker|null=null,segmenter:ImageSegmenter|null=null;
  const input=document.createElement('canvas'),ictx=input.getContext('2d')!;
  const cut=document.createElement('canvas'),cctx=cut.getContext('2d')!;
  const mask=document.createElement('canvas'),mctx=mask.getContext('2d')!;
  const say=(s:string)=>{if(!disposed&&s!==lastStatus){lastStatus=s;onStatus(s);}};
  const tick=(time:number)=>{
   if(disposed)return;frame=requestAnimationFrame(tick);
   const v=video.current;if(!v||v.readyState<2||!tracker||!segmenter||time-lastRun<interval||v.currentTime===last)return;
   last=v.currentTime;lastRun=time;const started=performance.now();
   try{
    input.width=288;input.height=Math.round(288*v.videoHeight/v.videoWidth);ictx.drawImage(v,0,0,input.width,input.height);
    const face=tracker.detectForVideo(input,time).faceLandmarks[0];
    if(!face){liveHead.current=null;say('No face · showing demo');return;}
    const crop=headCrop(face,input.width,input.height);if(!crop){liveHead.current=null;say('Move closer · showing demo');return;}
    segmenter.segmentForVideo(input,time,result=>{
     if(disposed||!result.categoryMask)return;
     const category=result.categoryMask,data=category.getAsUint8Array();
     mask.width=category.width;mask.height=category.height;
     const pixels=mctx.createImageData(mask.width,mask.height);
     for(let i=0;i<data.length;i++){pixels.data[i*4]=255;pixels.data[i*4+1]=255;pixels.data[i*4+2]=255;pixels.data[i*4+3]=isHeadCategory(data[i])?255:0;}
     mctx.putImageData(pixels,0,0);
     cut.width=Math.max(1,Math.round(crop.width*256/crop.height));cut.height=256;
     const ratio=256/crop.height;
     // Mirror both pixels and matte together; keep the chin anchor in the same space.
     cctx.save();cctx.translate(cut.width,0);cctx.scale(-1,1);
     cctx.drawImage(input,crop.x,crop.y,crop.width,crop.height,0,0,cut.width,cut.height);
     cctx.globalCompositeOperation='destination-in';cctx.filter='blur(1px)';
     cctx.drawImage(mask,crop.x*mask.width/input.width,crop.y*mask.height/input.height,crop.width*mask.width/input.width,crop.height*mask.height/input.height,0,0,cut.width,cut.height);
     cctx.restore();cctx.filter='none';cctx.globalCompositeOperation='destination-in';
     const fade=cctx.createLinearGradient(0,235,0,256);fade.addColorStop(0,'#fff');fade.addColorStop(1,'#fff0');cctx.fillStyle=fade;cctx.fillRect(0,0,cut.width,cut.height);cctx.globalCompositeOperation='source-over';
     // Tighten the scale to the segmented hair, rather than magnify empty crop padding.
     const small=cctx.getImageData(0,0,cut.width,cut.height).data;let first=0;
     for(;first<cut.height;first++){let opaque=0;for(let col=0;col<cut.width;col++)if(small[(first*cut.width+col)*4+3]>180)opaque++;if(opaque>cut.width*.08)break;}
     const chinY=(crop.chin.y-crop.y)*ratio;
     if(first>=chinY-20){liveHead.current=null;say('Head cutout unavailable · showing demo');return;}
     liveHead.current={image:cut,chinX:cut.width-(crop.chin.x-crop.x)*ratio,chinY,top:first,angle:-crop.angle};
     say('LIVE · your face');
    });
   }catch{liveHead.current=null;say('Tracking paused · showing demo');}
   interval=Math.min(500,Math.max(180,(performance.now()-started)*1.5));
  };
  frame=requestAnimationFrame(tick);say('Loading local face cutout…');
  void(async()=>{try{
   const {FaceLandmarker,ImageSegmenter,FilesetResolver}=await import('@mediapipe/tasks-vision');
   const files=await FilesetResolver.forVisionTasks(base+'vision/wasm');if(disposed)return;
   const face=await FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:base+'vision/face_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numFaces:1});
   if(disposed){face.close();return;}tracker=face;
   const head=await ImageSegmenter.createFromOptions(files,{baseOptions:{modelAssetPath:base+'vision/selfie_multiclass.tflite',delegate:'CPU'},runningMode:'VIDEO',outputCategoryMask:true,outputConfidenceMasks:false});
   if(disposed){head.close();return;}segmenter=head;say('Look at the camera');
  }catch{say('Head tracking unavailable · showing demo');}})();
  return()=>{disposed=true;cancelAnimationFrame(frame);tracker?.close();segmenter?.close();liveHead.current=null;};
 },[active,video,onStatus]);
 return <canvas ref={canvas} className="face-tracking head-overlay" aria-label="Local head overlay"/>;
}
