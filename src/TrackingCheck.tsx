// Development-only diagnostic: a virtual camera made from the fictional portrait.
// Never exported by a production build.
import {useEffect,useRef,useState} from 'react';
import FaceEffects from './FaceEffects';
import {demoPortrait,type IdentityId} from './content';
export default function TrackingCheck(){const video=useRef<HTMLVideoElement>(null);const source=useRef<HTMLCanvasElement>(null);const [active,setActive]=useState(false),[status,setStatus]=useState('Starting virtual camera'),[identity,setIdentity]=useState<IdentityId>('soft'),[blank,setBlank]=useState(false);const blankRef=useRef(blank);blankRef.current=blank;
 useEffect(()=>{const canvas=source.current!;const ctx=canvas.getContext('2d')!;const img=new Image();img.src=demoPortrait;let stream:MediaStream|null=null,frame=0,disposed=false;
 img.onload=()=>{if(disposed)return;const render=(time:number)=>{ctx.fillStyle='#181818';ctx.fillRect(0,0,canvas.width,canvas.height);if(!blankRef.current){ctx.save();ctx.translate(Math.sin(time/1800)*20,0);ctx.drawImage(img,0,0,canvas.width,canvas.height);ctx.restore();}frame=requestAnimationFrame(render);};frame=requestAnimationFrame(render);stream=canvas.captureStream(15);video.current!.srcObject=stream;video.current!.play().then(()=>{if(!disposed)setActive(true);});};
 return()=>{disposed=true;cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());};},[]);
 return <div style={{padding:20}}><h1>Face tracking diagnostic</h1><p role="status">{status}</p><select aria-label="Effect identity" value={identity} onChange={e=>setIdentity(e.target.value as IdentityId)}><option value="soft">Soft Dreamer</option><option value="tech">Tech Optimizer</option><option value="culture">Culture Curator</option></select><button onClick={()=>setBlank(x=>!x)}>{blank?'Restore face':'Remove face'}</button><div style={{position:'relative',width:390,height:650}}><video ref={video} autoPlay muted playsInline style={{width:'100%',height:'100%',objectFit:'cover',transform:'scaleX(-1)'}}/><FaceEffects video={video} active={active} identity={identity} onStatus={setStatus}/></div><canvas ref={source} width={720} height={1280} hidden/></div>;
}
