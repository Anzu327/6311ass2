import {useEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
import {CheckCircle,Lightning,Warning,UserFocus} from '@phosphor-icons/react';
import {groupLabels,type FeedGroup} from './clips';
export type DemoProfile=FeedGroup;
const base=import.meta.env.BASE_URL;
const SCAN_MS=2000;
interface Props {profile:DemoProfile;camera:RefObject<HTMLVideoElement|null>;facePresent:boolean;cameraError:string;retry:()=>void;onContinue:()=>void;}
export default function ScanDemo({profile,camera,facePresent,cameraError,retry,onContinue}:Props){
 const [ready,setReady]=useState(false),[assetError,setAssetError]=useState(false),[help,setHelp]=useState(false),[complete,setComplete]=useState(false),[progress,setProgress]=useState(0),[suspended,setSuspended]=useState(document.visibilityState==='hidden');
 const canvas=useRef<HTMLCanvasElement>(null);
 const label=groupLabels[profile];
 const running=ready&&!assetError&&!suspended&&facePresent&&!complete;
 useEffect(()=>{let disposed=false;setReady(false);setAssetError(false);
  Promise.all(['terminal-texture.webp','scan-beam.webp','terminal-corners.webp','terminal-mark.webp','terminal-ruler.webp'].map(name=>{const image=new Image();image.src=base+'media/'+name;return image.decode();})).then(()=>{if(!disposed)setReady(true);}).catch(()=>{if(!disposed)setAssetError(true);});
  return()=>{disposed=true;};
 },[profile]);
 useEffect(()=>{const timer=setTimeout(()=>setHelp(true),8000);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{const visibility=()=>setSuspended(document.visibilityState==='hidden');const leave=()=>setSuspended(true);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',leave);return()=>{document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',leave);};},[]);
 useEffect(()=>{if(complete)return;if(!running){setProgress(0);return;}
  let frame=0;const started=performance.now();
  const tick=(time:number)=>{const next=Math.min(1,(time-started)/SCAN_MS);setProgress(next);if(next>=1)setComplete(true);else frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[running,complete]);
 useEffect(()=>{
  let frame=0;const c=canvas.current;if(!c)return;const ctx=c.getContext('2d')!;
  const paint=()=>{
   frame=requestAnimationFrame(paint);
   const rect=c.getBoundingClientRect(),pixelRatio=Math.min(devicePixelRatio||1,2);
   const width=Math.max(1,Math.round(rect.width*pixelRatio)),height=Math.max(1,Math.round(rect.height*pixelRatio));
   if(c.width!==width||c.height!==height){c.width=width;c.height=height;}
   ctx.clearRect(0,0,c.width,c.height);
   const v=camera.current,stream=v?.srcObject as MediaStream|null;
   if(suspended||!v||v.readyState<2||!v.videoWidth||!stream?.getVideoTracks().some(track=>track.readyState==='live'))return;
   const scale=Math.max(c.width/v.videoWidth,c.height/v.videoHeight),sourceWidth=c.width/scale,sourceHeight=c.height/scale;
   ctx.save();ctx.translate(c.width,0);ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;
   ctx.drawImage(v,(v.videoWidth-sourceWidth)/2,(v.videoHeight-sourceHeight)/2,sourceWidth,sourceHeight,0,0,c.width,c.height);ctx.restore();
  };frame=requestAnimationFrame(paint);return()=>{cancelAnimationFrame(frame);ctx.clearRect(0,0,c.width,c.height);};
 },[camera,suspended]);
 const sweep=progress<=.5?progress*2:(1-progress)*2;
 const status=complete?'扫描完成':running?'正在扫描':assetError?'素材加载失败':!ready?'加载中':cameraError?'摄像头不可用':'请对准摄像头';
 return <section className={'scan-demo terminal-scan '+(running?'running ':'')+(complete?'scan-complete':'')} aria-label="摄像头人脸扫描" data-demo-profile={profile} data-scan-state={complete?'complete':running?'scanning':'waiting'} style={{'--scan-sweep':(5+sweep*90)+'%','--terminal-texture':'url('+base+'media/terminal-texture.webp)'} as CSSProperties}>
  <header className="scan-brand"><img src={base+'media/terminal-mark.webp'} alt=""/><span>抖歪</span><small>LOCAL</small></header>
  <div className="scan-title" aria-hidden="true"><span className="scan-warning"><Warning weight="bold"/><Lightning weight="fill"/></span><span className="scan-title-word">SCAN</span><UserFocus className="scan-focus" weight="thin"/></div>
  <div className="scanner-camera"><div className="scan-video-window"><canvas ref={canvas} width={660} height={900} aria-label="实时摄像头预览"/>{ready&&<img className="scan-corners" src={base+'media/terminal-corners.webp'} alt=""/>}{running&&<img className="scan-beam" src={base+'media/scan-beam.webp'} alt=""/>}<span className="scan-camera-caption">本地实时摄像头</span></div><img className="scan-ruler" src={base+'media/terminal-ruler.webp'} alt=""/>{running&&<span className="scan-ruler-light" aria-hidden="true"/>}</div>
  <div className={'scan-controls '+((help||cameraError||assetError)&&!running&&!complete?'is-recovery':'')}>
   {complete?<><div className="scan-outcome"><h1 className="scan-sticker">{label}</h1><span><CheckCircle size={17}/>分区已锁定</span></div><button className="scan-enter" onClick={onContinue}>进入推荐</button></>:<>
    <div className="scan-progress-row"><span className="scan-percent" aria-hidden="true">{Math.round(progress*100)}<small>%</small></span><div className="scan-status-copy"><div className="scan-status" role="status">{status}</div><span className="scan-help-copy">{running?'保持面部在框内':assetError?'请刷新重试':cameraError?'允许摄像头，或跳过扫描':help?'靠近镜头，保持光线充足':'等待检测到人脸'}</span></div></div>
    <div className="scan-progress-area" aria-label="人脸扫描进度" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}>{Array.from({length:8},(_,i)=><span key={i} className={progress>i/8?'filled':''}/>)}</div>
    {!running&&(help||cameraError||assetError)&&<div className="scan-recovery">{cameraError&&<button onClick={retry}>重试摄像头</button>}<button onClick={onContinue}>跳过扫描进入推荐</button></div>}
   </>}
  </div>
  <footer className="scan-disclosure">本地人脸检测 · 分组为演示，非身份识别</footer>
 </section>;
}
