import {useEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
import {CheckCircle,CircleDashed,LockSimple} from '@phosphor-icons/react';
export type DemoProfile='nailong'|'lulu';
const base=import.meta.env.BASE_URL;
const SCAN_MS=2000;
interface Props {profile:DemoProfile;camera:RefObject<HTMLVideoElement|null>;facePresent:boolean;cameraError:string;retry:()=>void;onContinue:()=>void;}
export default function ScanDemo({profile,camera,facePresent,cameraError,retry,onContinue}:Props){
 const [ready,setReady]=useState(false),[assetError,setAssetError]=useState(false),[help,setHelp]=useState(false),[complete,setComplete]=useState(false),[progress,setProgress]=useState(0),[suspended,setSuspended]=useState(document.visibilityState==='hidden');
 const canvas=useRef<HTMLCanvasElement>(null);
 const label=profile==='nailong'?'重度奶龙用户':'噜噜资深粉';
 const running=ready&&!assetError&&!suspended&&facePresent&&!complete;
 useEffect(()=>{let disposed=false;setReady(false);setAssetError(false);
  Promise.all(['scan-mesh.webp','scan-beam.webp','scan-corners.webp',profile+'-sticker.webp'].map(name=>{const image=new Image();image.src=base+'media/'+name;return image.decode();})).then(()=>{if(!disposed)setReady(true);}).catch(()=>{if(!disposed)setAssetError(true);});
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
 return <section className={'scan-demo '+(running?'running ':'')+(complete?'scan-complete':'')} aria-label="摄像头人脸扫描" data-demo-profile={profile} data-scan-state={complete?'complete':running?'scanning':'waiting'} style={{'--scan-sweep':(5+sweep*90)+'%'} as CSSProperties}>
  <header className="scan-brand">抖歪</header>
  <div className="scan-status" role="status">{complete?<><CheckCircle size={25} className="scan-blue"/><span>扫描完成</span></>:<span>{running?'正在扫描':assetError?'素材加载失败':!ready?'正在加载演示':cameraError?'摄像头不可用':'请将脸对准摄像头'}</span>}</div>
  <div className="scanner-camera"><canvas ref={canvas} width={660} height={900} aria-label="实时摄像头预览"/>{ready&&<img className="scan-corners" src={base+'media/scan-corners.webp'} alt=""/>}{running&&<><img className="scan-mesh" src={base+'media/scan-mesh.webp'} alt=""/><img className="scan-beam" src={base+'media/scan-beam.webp'} alt=""/></>}</div>
  <p className="scan-camera-caption">本地实时摄像头 · 画面不上传</p>
  {complete?<><h1 className="sr-only">{label}</h1><img className="scan-sticker" src={base+'media/'+profile+'-sticker.webp'} alt="" aria-hidden="true"/><div className="scan-outcome"><LockSimple size={34}/><span>预设标签已锁定</span></div><button className="scan-enter" onClick={onContinue}>进入推荐</button></>:<div className="scan-progress-area">{!assetError&&<CircleDashed className="scan-spinner scan-blue" size={60} aria-label="人脸扫描进度" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}/>}<span className="scan-help-copy">{running?'请保持面部在画面中':assetError?'请刷新重试':cameraError?'请允许摄像头，或跳过扫描':help?'未检测到人脸，请靠近镜头并保持光线充足':''}</span>{!assetError&&!running&&(help||cameraError)&&<div className="scan-recovery">{cameraError&&<button onClick={retry}>重试摄像头</button>}<button onClick={onContinue}>跳过扫描进入推荐</button></div>}{assetError&&<button onClick={onContinue}>跳过扫描进入推荐</button>}</div>}
  <footer className="scan-disclosure">人脸检测 · 分组为演示，非身份识别</footer>
 </section>;
}
