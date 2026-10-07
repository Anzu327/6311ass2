import {useCallback,useEffect,useReducer,useRef,useState,type CSSProperties} from 'react';
import {Plus,ChatCircleDots,User,Heart,ShareFat,Star,MagnifyingGlass,List,X,CameraSlash,Check,Play,MusicNotes,CaretDown,Circle} from '@phosphor-icons/react';
import {INTRO_DURATION_MS,initialExperience,reducer,stopStream} from './experience';
import FaceTracking from './FaceTracking';
import {feedClips,clipAt} from './clips';
import CommentsSheet,{initialComments,type Item} from './CommentsSheet';
const base=import.meta.env.BASE_URL;
export default function App(){
 const [state,dispatch]=useReducer(reducer,initialExperience);const [stream,setStream]=useState<MediaStream|null>(null);const streamRef=useRef<MediaStream|null>(null);const video=useRef<HTMLVideoElement>(null);const clip=useRef<HTMLVideoElement>(null);const requestId=useRef(0);const mounted=useRef(true);const cameraStarted=useRef(false),cameraPending=useRef(false),playRequest=useRef(0),gestureNeeded=useRef(false);
 const [busy,setBusy]=useState(false),[cameraError,setCameraError]=useState(''),[tracking,setTracking]=useState('Loading head overlay…'),[toast,setToast]=useState(''),[modal,setModal]=useState<'about'|'profile'|'comments'|'explore'|'inbox'|'menu'|null>(null),[tab,setTab]=useState('推荐');
 const [needsGesture,setNeedsGesture]=useState(false),[paused,setPaused]=useState(false),[clipError,setClipError]=useState('');
 const [liked,setLiked]=useState<Record<string,boolean>>({}),[saved,setSaved]=useState<Record<string,boolean>>({}),[followed,setFollowed]=useState(false),[captionExpanded,setCaptionExpanded]=useState(false),[commentsExpanded,setCommentsExpanded]=useState(false),[commentTotals,setCommentTotals]=useState<Record<string,number>>({}),[commentStore,setCommentStore]=useState<Record<string,Item[]>>({});
 const imageURLs=useRef<string[]>([]);useEffect(()=>()=>{imageURLs.current.forEach(URL.revokeObjectURL);},[]);
 const [introReady,setIntroReady]=useState(false);const phase=state.phase;const currentClip=clipAt(state.index);const notify=useCallback((message:string)=>setToast(message),[]);const onTracking=useCallback((s:string)=>setTracking(s),[]);
 useEffect(()=>{if(phase!=='intro'||!introReady)return;const timer=setTimeout(()=>dispatch({type:'entered'}),INTRO_DURATION_MS);return()=>clearTimeout(timer);},[phase,introReady]);
 const releaseCamera=useCallback(()=>{requestId.current++;stopStream(streamRef.current);streamRef.current=null;setStream(null);cameraPending.current=false;setBusy(false);setTracking('MOSAIC · camera unavailable');},[]);
 useEffect(()=>{mounted.current=true;const release=()=>{releaseCamera();playRequest.current++;clip.current?.pause();};window.addEventListener('pagehide',release);return()=>{mounted.current=false;requestId.current++;stopStream(streamRef.current);window.removeEventListener('pagehide',release);};},[releaseCamera]);
 useEffect(()=>{const v=video.current;if(v&&stream){v.srcObject=stream;v.play().catch(()=>{releaseCamera();setCameraError('Camera feed could not start. Check browser permissions and retry.');});}return()=>{if(v)v.srcObject=null;};},[stream,phase,releaseCamera]);
 const playWithSound=useCallback(()=>{
  const v=clip.current;if(!v)return;const token=++playRequest.current;v.muted=false;v.volume=1;
  void v.play().then(()=>{if(token!==playRequest.current||!mounted.current)return;gestureNeeded.current=false;setNeedsGesture(false);setPaused(false);}).catch(error=>{
   if(token!==playRequest.current||!mounted.current||error?.name==='AbortError')return;
   setPaused(true);if(error?.name==='NotAllowedError'){gestureNeeded.current=true;setNeedsGesture(true);}
  });
 },[]);
 useEffect(()=>{const v=clip.current;if(v&&phase==='feed'){v.load();setClipError('');playWithSound();}},[state.index,phase,playWithSound]);
 useEffect(()=>{
  if(phase!=='feed')return;
  const unlock=(event:Event)=>{if(!gestureNeeded.current)return;if((event.target as Element)?.closest?.('button,input,a,dialog,.media-stage'))return;playWithSound();};
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);
  return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);};
 },[phase,playWithSound]);
 useEffect(()=>{if(phase==='feed')document.querySelector('.feed-tabs .active')?.scrollIntoView({block:'nearest',inline:'nearest'});},[phase,tab]);
 const replay=()=>{const v=clip.current;if(v){v.currentTime=0;playWithSound();}};
 const togglePlayback=()=>{const v=clip.current;if(!v)return;if(v.paused)playWithSound();else{playRequest.current++;v.pause();setPaused(true);}};
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t);},[toast]);
 const enableCamera=async()=>{if(phase!=='feed'||cameraPending.current||streamRef.current)return;cameraPending.current=true;const token=++requestId.current;setBusy(true);setCameraError('');try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unavailable');const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:1280}},audio:false});if(token!==requestId.current||!mounted.current){stopStream(s);return;}stopStream(streamRef.current);streamRef.current=s;setStream(s);cameraPending.current=false;setBusy(false);}catch(e){if(token!==requestId.current||!mounted.current)return;cameraPending.current=false;setBusy(false);const name=e instanceof DOMException?e.name:'';setCameraError(name==='NotAllowedError'?'Camera permission was declined. You can still explore the artwork with the source face mosaicked.':'No camera is available. Try again or continue with the source face mosaicked.');}};
 useEffect(()=>{if(phase==='feed'&&!cameraStarted.current){cameraStarted.current=true;void enableCamera();}},[phase]);
 useEffect(()=>{
  if(!stream)return;const ended=()=>{releaseCamera();setCameraError('Camera permission or device access ended. You can keep watching with a mosaic.');};
  for(const track of stream.getTracks())track.addEventListener('ended',ended);
  return()=>{for(const track of stream.getTracks())track.removeEventListener('ended',ended);};
 },[stream,releaseCamera]);
 const gestureLock=useRef(0),touchStart=useRef<number|null>(null);const step=useCallback((delta:number)=>{if(phase!=='feed'||modal)return;const now=performance.now();if(now-gestureLock.current<450)return;gestureLock.current=now;dispatch({type:'step',delta});},[phase,modal]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement).matches('input,textarea,select')||modal)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();step(e.key==='ArrowDown'?1:-1);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[step,modal]);
 useEffect(()=>{if(!modal)return;const previous=document.activeElement as HTMLElement;
 if(modal==='comments'){const sheet=document.querySelector<HTMLElement>('.comments-sheet');sheet?.querySelector<HTMLButtonElement>('button')?.focus();const guard=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setModal(null);setCommentsExpanded(false);}if(e.key==='Tab'&&sheet){const controls=[...sheet.querySelectorAll<HTMLElement>('button,input:not([type="file"])')].filter(x=>!x.hasAttribute('disabled'));if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};window.addEventListener('keydown',guard);return()=>{window.removeEventListener('keydown',guard);previous?.focus();};}
 const dialog=document.querySelector<HTMLDialogElement>('dialog');dialog?.showModal();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setModal(null);}};window.addEventListener('keydown',escape);return()=>{dialog?.close();previous?.focus();window.removeEventListener('keydown',escape);};},[modal]);
 const share=async()=>{try{await navigator.clipboard.writeText(new URL(base,window.location.origin).href);notify('作品链接已复制');}catch{setModal('about');notify('可在作品说明中复制链接');}};
 const descriptions:Record<string,string>={qinghai:'手套一戴，谁都能摇。 #青海摇 #是谁在摇', 'blue-run':'跑得再快，也跑不出推荐。 #蓝色妖姬 #金色传说', 'social-dance':'下一条还是熟悉的节奏。 #社会摇 #一起摇', disney:'不是城堡，是小区健骑机。 #我要迪士尼 #diss', caoxian:'这一次，轮到你喊了。 #山东菏泽曹县 #网络热梗', retreat:'有些内容，越退越近。 #退退退 #推荐'};
 const tapVideo=()=>{if(gestureNeeded.current||clip.current?.paused)playWithSound();else togglePlayback();};
 const openComments=()=>{setCommentsExpanded(false);setModal('comments');};
 const closeComments=()=>{setModal(null);setCommentsExpanded(false);};
 const commentsCount=275+(commentTotals[currentClip.id]??0);
 if(phase==='intro')return <div className="app"><main className="stage-wrap"><section className="stage intro" aria-label="Opening transition" style={{'--intro-duration':`${INTRO_DURATION_MS}ms`} as CSSProperties}><img className={`intro-art ${introReady?'ready':''}`} src={base+'media/splash-douwai.webp'} alt="抖歪" fetchPriority="high" onLoad={()=>setIntroReady(true)} onError={()=>setIntroReady(true)}/></section></main></div>;
 return <div className="app">

 <main className="stage-wrap"><section className={`stage ${phase} ${modal==='comments'?'comments-open':''} ${modal==='comments'&&commentsExpanded?'comments-expanded':''}`} aria-label="Interactive artwork"
 onWheel={e=>{if(Math.abs(e.deltaY)>20)step(e.deltaY>0?1:-1);}} onTouchStart={e=>{touchStart.current=e.touches[0].clientY;}} onTouchEnd={e=>{if(touchStart.current===null)return;const d=touchStart.current-e.changedTouches[0].clientY;if(Math.abs(d)>50)step(d>0?1:-1);touchStart.current=null;}}>
 <div className="media-stage" role="button" aria-label={paused?'播放视频':'暂停视频'} tabIndex={0} onClick={tapVideo} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();tapVideo();}}}>
  <div className="portrait-backdrop"><video ref={clip} className="meme-video" autoPlay loop muted={false} playsInline preload="auto" aria-label={currentClip.title+' source video'} data-clip-id={currentClip.id}
  onError={e=>{if(e.target===e.currentTarget)setClipError('视频加载失败，请刷新重试');}} onCanPlay={()=>setClipError('')}><source src={base+currentClip.mp4} type='video/mp4; codecs="avc1.4D4029,mp4a.40.2"'/><source src={base+currentClip.webm} type='video/webm; codecs="vp9,opus"'/></video></div>
  <FaceTracking video={video} clip={clip} source={currentClip} active={!!stream} onStatus={onTracking}/>
  {paused&&!needsGesture&&<Play className="paused-symbol" size={52} weight="fill" aria-hidden="true"/>}
 </div>
 <video ref={video} className="camera-source" autoPlay muted playsInline aria-label="Local camera input"/>
 <header className="stage-header"><button aria-label="打开菜单" className="header-menu" onClick={()=>setModal('menu')}><List size={25}/></button>
 <div className="feed-tabs">{['精选','团购','同城','商城','直播','关注','推荐'].map(name=><button key={name} className={tab===name?'active':''} onClick={()=>{setTab(name);if(name!=='推荐')notify('课程作品中的模拟频道');}}>{name}{['商城','关注'].includes(name)&&<Circle className="channel-dot" size={7} weight="fill"/>}</button>)}</div>
 <button aria-label="搜索视频" className="header-search" onClick={()=>setModal('explore')}><MagnifyingGlass size={26}/></button></header>
 {modal==='comments'&&<button className="compact-search" aria-label="搜索视频" onClick={()=>setModal('explore')}><MagnifyingGlass size={25}/></button>}
 <div className="sr-only" role="status">{tracking}</div>
 {needsGesture&&<div className="playback-hint" role="status">轻触画面开始有声播放</div>}{clipError&&<div className="feed-empty" role="alert">{clipError}</div>}
 <div className="post-caption"><div className="author-name">@抖歪放映员 <span className="post-kind">换脸</span></div><p className={captionExpanded?'expanded':'collapsed'}>{descriptions[currentClip.id]} <button className="caption-expand" onClick={()=>setCaptionExpanded(v=>!v)}>{captionExpanded?'收起':'展开'}</button></p><small className="sound-line"><MusicNotes size={13}/>{currentClip.title} · 原声</small><span className="sr-only">{currentClip.title} {state.index%feedClips.length+1}/{feedClips.length}</span></div>
 <div className="action-rail"><button className="avatar" aria-label={followed?'已关注放映员':'关注放映员'} onClick={()=>setFollowed(v=>!v)}><img src={base+'media/avatar-cat.webp'} alt="放映员头像"/><span>{followed?<Check size={13} weight="bold"/>:<Plus size={14} weight="bold"/>}</span></button>
 <button aria-label="点赞视频" aria-pressed={!!liked[currentClip.id]} className={liked[currentClip.id]?'liked':''} onClick={()=>setLiked(v=>({...v,[currentClip.id]:!v[currentClip.id]}))}><Heart size={33} weight="fill"/><span>{24+(liked[currentClip.id]?1:0)}</span></button>
 <button aria-label="打开评论区" onClick={openComments}><ChatCircleDots size={33} weight="fill"/><span>评论</span></button>
 <button aria-label="收藏视频" aria-pressed={!!saved[currentClip.id]} className={saved[currentClip.id]?'saved':''} onClick={()=>setSaved(v=>({...v,[currentClip.id]:!v[currentClip.id]}))}><Star size={33} weight="fill"/><span>{1+(saved[currentClip.id]?1:0)}</span></button>
 <button aria-label="分享作品" onClick={()=>void share()}><ShareFat size={32} weight="fill"/><span>分享</span></button>
 <button className="remix-button" aria-label="拍同款" onClick={()=>setModal('about')}><img src={base+'media/avatar-sunset.webp'} alt=""/><span>拍同款</span></button></div>
 <nav className="bottom-nav" aria-label="底部导航"><button className="active" onClick={()=>{setTab('推荐');setModal(null);}}>首页</button><button onClick={()=>setModal('explore')}>朋友</button><button className="create-button" aria-label="视频合集" onClick={()=>setModal('explore')}><Plus size={27} weight="bold"/></button><button onClick={()=>setModal('inbox')}>消息<span className="notification-count">59</span></button><button onClick={()=>setModal('profile')}>我</button></nav>
 {modal==='comments'&&<CommentsSheet title={currentClip.title} count={commentsCount} items={commentStore[currentClip.id]??initialComments} onItemsChange={items=>setCommentStore(v=>({...v,[currentClip.id]:items}))} onImageURL={url=>imageURLs.current.push(url)} onClose={closeComments} onExpand={setCommentsExpanded} onPost={()=>setCommentTotals(v=>({...v,[currentClip.id]:(v[currentClip.id]??0)+1}))}/>}
 {toast&&<div className="toast" role="status"><Check size={15}/>{toast}</div>}
 </section></main>
 {cameraError&&<div className="camera-error" role="alert"><CameraSlash size={20}/><p>{cameraError}</p><button onClick={()=>{setCameraError('');}}>继续观看</button><button onClick={()=>void enableCamera()} disabled={busy}>重试摄像头</button><button aria-label="关闭摄像头提示" onClick={()=>setCameraError('')}><X/></button></div>}
 {modal&&modal!=='comments'&&<dialog className="dialog" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}><button className="dialog-close" onClick={()=>setModal(null)} aria-label="关闭弹窗"><X size={23}/></button>
 {modal==='menu'&&<><h2>抖歪</h2><div className="clip-list"><button onClick={()=>{setModal(null);replay();}}>重新播放当前视频</button><button onClick={()=>setModal('explore')}>视频合集</button><button onClick={()=>setModal('about')}>作品说明</button></div></>}
 {modal==='about'&&<><span className="mono">课程概念作品 · 非官方应用</span><h2>推荐给谁？</h2><p>FOR YOU is a fictional platform and interactive artwork inspired by TikTok / Douyin. This version uses the supplied original meme videos and an exaggerated head overlay. There are six supplied meme clips. Swipe to change the video; Explore lists them. The catalog cycles after the sixth clip.</p><p>Camera frames and face landmarks stay in your browser. Face tracking positions effects; it does not identify you or infer personality. No identity is assigned or inferred.</p><p>The original video supplies the body, movement and sound. Camera frames are cropped and composited locally; they are never uploaded. The page requests the camera after the opening transition, but access always requires browser permission. There are no in-page camera or mute switches. Browser/system controls remain available, and leaving the page releases capture. Without a detected camera face, the central source-video head is mosaicked. No fictional avatar is substituted. This is a playful 2D collage, not a seamless neural face swap.</p><label>Share the artwork<input readOnly value={new URL(base,window.location.origin).href} onFocus={e=>e.target.select()}/></label><span className="mono">ARTWORK / NOT A CLAIM ABOUT TIKTOK’S FACE ANALYSIS</span></>}
 {modal==='profile'&&<><span className="mono">本地体验</span><h2>我</h2><p>No account or assigned identity. Camera frames stay on your device.</p><p>Camera: {stream?'on':'off'}</p></>}
 {modal==='explore'&&<><span className="mono">抖歪 · 6条视频</span><h2>视频合集</h2><div className="clip-list">{feedClips.map((item,i)=><button key={item.id} className={item.id===currentClip.id?'selected':''} onClick={()=>{setModal(null);dispatch({type:'select',index:i});}}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}</div></>}
 {modal==='inbox'&&<><span className="mono">模拟消息</span><h2>暂时没有新消息</h2><p>未读数字是作品界面的一部分，不代表真实账号消息。</p></>}
 </dialog>}
 </div>;
}
