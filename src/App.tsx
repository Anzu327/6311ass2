import {useCallback,useEffect,useReducer,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent} from 'react';
import {Plus,ChatCircleDots,User,Heart,ShareFat,Star,MagnifyingGlass,List,X,CameraSlash,Check,Play,MusicNotes,CaretDown,Circle} from '@phosphor-icons/react';
import {INTRO_DURATION_MS,initialExperience,reducer,stopStream,entryProfile} from './experience';
import FaceTracking from './FaceTracking';
import ScanDemo,{type DemoProfile} from './ScanDemo';
import {feedFor,clipAt} from './clips';
import CommentsSheet,{initialComments,type Item} from './CommentsSheet';
const base=import.meta.env.BASE_URL;
export default function App(){
 const [demoProfile]=useState<DemoProfile|null>(()=>entryProfile(location.search,crypto.getRandomValues(new Uint8Array(1))[0]));
 const [scanFinished,setScanFinished]=useState(false);
 const panel=useRef<HTMLDivElement>(null),motion=useRef<Animation|null>(null),motionFrame=useRef(0),motionTimeout=useRef<ReturnType<typeof setTimeout>|null>(null),motionEpoch=useRef(0),motionBusy=useRef(false),motionLoading=useRef(false),suppressTap=useRef(0);
 const [moving,setMoving]=useState(false),[loadingClip,setLoadingClip]=useState(false);
 const drag=useRef<{id:number;x:number;y:number;dy:number;vertical:boolean}|null>(null);
 const [state,dispatch]=useReducer(reducer,initialExperience);const [stream,setStream]=useState<MediaStream|null>(null);const streamRef=useRef<MediaStream|null>(null);const video=useRef<HTMLVideoElement>(null);const clip=useRef<HTMLVideoElement>(null);const requestId=useRef(0);const mounted=useRef(true);const cameraStarted=useRef(false),cameraPending=useRef(false),playRequest=useRef(0),gestureNeeded=useRef(false);
 const [busy,setBusy]=useState(false),[cameraError,setCameraError]=useState(''),[tracking,setTracking]=useState('Loading head overlay…'),[toast,setToast]=useState(''),[modal,setModal]=useState<'about'|'profile'|'comments'|'explore'|'inbox'|'menu'|null>(null),[tab,setTab]=useState('推荐');
 const [needsGesture,setNeedsGesture]=useState(false),[paused,setPaused]=useState(false),[clipError,setClipError]=useState('');
 const [liked,setLiked]=useState<Record<string,boolean>>({}),[saved,setSaved]=useState<Record<string,boolean>>({}),[followed,setFollowed]=useState(false),[captionExpanded,setCaptionExpanded]=useState(false),[commentsExpanded,setCommentsExpanded]=useState(false),[commentTotals,setCommentTotals]=useState<Record<string,number>>({}),[commentStore,setCommentStore]=useState<Record<string,Item[]>>({});
 const imageURLs=useRef<string[]>([]);useEffect(()=>()=>{imageURLs.current.forEach(URL.revokeObjectURL);},[]);
 const [introReady,setIntroReady]=useState(false);const phase=state.phase;const scanVisible=!!demoProfile&&!scanFinished&&phase==='feed';const scanVisibleRef=useRef(scanVisible);scanVisibleRef.current=scanVisible;const activeClips=feedFor(scanFinished?demoProfile:null);const currentClip=clipAt(state.index,activeClips);const notify=useCallback((message:string)=>setToast(message),[]);const onTracking=useCallback((s:string)=>setTracking(s),[]);
 useEffect(()=>{if(phase!=='intro'||!introReady)return;const timer=setTimeout(()=>dispatch({type:'entered'}),INTRO_DURATION_MS);return()=>clearTimeout(timer);},[phase,introReady]);
 const releaseCamera=useCallback(()=>{requestId.current++;stopStream(streamRef.current);streamRef.current=null;setStream(null);cameraPending.current=false;setBusy(false);setTracking('MOSAIC · camera unavailable');},[]);
 useEffect(()=>{mounted.current=true;const release=()=>{releaseCamera();playRequest.current++;clip.current?.pause();};window.addEventListener('pagehide',release);return()=>{mounted.current=false;requestId.current++;stopStream(streamRef.current);window.removeEventListener('pagehide',release);};},[releaseCamera]);
 useEffect(()=>{const v=video.current;if(v&&stream){v.srcObject=stream;v.play().catch(()=>{releaseCamera();setCameraError('Camera feed could not start. Check browser permissions and retry.');});}return()=>{if(v)v.srcObject=null;};},[stream,phase,releaseCamera]);
 const playWithSound=useCallback(()=>{
  const v=clip.current;if(!v||scanVisibleRef.current||motionLoading.current)return;const token=++playRequest.current;v.muted=false;v.volume=1;
  void v.play().then(()=>{if(token!==playRequest.current||!mounted.current)return;gestureNeeded.current=false;setNeedsGesture(false);setPaused(false);}).catch(error=>{
   if(token!==playRequest.current||!mounted.current||error?.name==='AbortError')return;
   setPaused(true);if(error?.name==='NotAllowedError'){gestureNeeded.current=true;setNeedsGesture(true);}
  });
 },[]);
 useEffect(()=>{const v=clip.current;if(v&&phase==='feed'){v.load();setClipError('');if(!scanVisible)playWithSound();}},[state.index,phase,scanVisible,playWithSound]);
 useEffect(()=>{
  if(phase!=='feed')return;
  const unlock=(event:Event)=>{if(!gestureNeeded.current)return;if((event.target as Element)?.closest?.('button,input,a,dialog,.media-stage'))return;playWithSound();};
  window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);
  return()=>{window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);};
 },[phase,playWithSound]);
 useEffect(()=>{if(phase!=='feed')return;const alignActive=()=>document.querySelector('.feed-tabs .active')?.scrollIntoView({block:'nearest',inline:'nearest'});alignActive();window.addEventListener('resize',alignActive);return()=>window.removeEventListener('resize',alignActive);},[phase,tab]);
 const replay=()=>{const v=clip.current;if(v){v.currentTime=0;playWithSound();}};
 const togglePlayback=()=>{const v=clip.current;if(!v)return;if(v.paused)playWithSound();else{playRequest.current++;v.pause();setPaused(true);}};
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t);},[toast]);
 const enableCamera=async()=>{if(phase!=='feed'||cameraPending.current||streamRef.current)return;cameraPending.current=true;const token=++requestId.current;setBusy(true);setCameraError('');try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unavailable');const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:1280}},audio:false});if(token!==requestId.current||!mounted.current){stopStream(s);return;}stopStream(streamRef.current);streamRef.current=s;setStream(s);cameraPending.current=false;setBusy(false);}catch(e){if(token!==requestId.current||!mounted.current)return;cameraPending.current=false;setBusy(false);const name=e instanceof DOMException?e.name:'';setCameraError(name==='NotAllowedError'?'摄像头权限已拒绝，仍可继续观看视频。':'摄像头暂不可用，可以重试或继续观看。');}};
 useEffect(()=>{if(phase==='feed'&&!cameraStarted.current){cameraStarted.current=true;void enableCamera();}},[phase]);
 useEffect(()=>{
  if(!stream)return;const ended=()=>{releaseCamera();setCameraError('摄像头访问已结束，仍可继续观看视频。');};
  for(const track of stream.getTracks())track.addEventListener('ended',ended);
  return()=>{for(const track of stream.getTracks())track.removeEventListener('ended',ended);};
 },[stream,releaseCamera]);
 const gestureLock=useRef(0);
 const stopMotion=useCallback(()=>{
  motionEpoch.current++;motion.current?.cancel();motion.current=null;cancelAnimationFrame(motionFrame.current);
  if(motionTimeout.current)clearTimeout(motionTimeout.current);motionTimeout.current=null;
  motionBusy.current=false;motionLoading.current=false;drag.current=null;
  if(panel.current){panel.current.style.transform='';panel.current.dataset.motion='idle';}
  setMoving(false);setLoadingClip(false);
 },[]);
 useEffect(()=>{if(phase!=='feed'||modal||scanVisible)stopMotion();},[phase,modal,scanVisible,stopMotion]);
 useEffect(()=>{const leave=()=>{stopMotion();clip.current?.pause();};window.addEventListener('pagehide',leave);window.addEventListener('resize',stopMotion);
  return()=>{motionEpoch.current++;motion.current?.cancel();cancelAnimationFrame(motionFrame.current);if(motionTimeout.current)clearTimeout(motionTimeout.current);window.removeEventListener('pagehide',leave);window.removeEventListener('resize',stopMotion);};
 },[stopMotion]);
 const bounce=()=>{const p=panel.current;if(!p)return;
  const from=p.style.transform||'translateY(0px)';p.style.transform='';p.dataset.motion='idle';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!p.animate)return;
  const token=++motionEpoch.current;motionBusy.current=true;p.dataset.motion='bounce';
  const a=p.animate([{transform:from},{transform:'translateY(0px)'}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});motion.current=a;
  void a.finished.catch(()=>{}).then(()=>{if(token!==motionEpoch.current)return;motionBusy.current=false;motion.current=null;p.dataset.motion='idle';});
 };
 const step=useCallback((delta:number)=>{
  if(phase!=='feed'||modal||scanVisible||motionBusy.current)return;
  const direction=Math.sign(delta);if(!direction)return;
  if(direction<0&&state.index===0){const p=panel.current;if(p)p.style.transform='';return;}
  const now=performance.now();if(now-gestureLock.current<450)return;gestureLock.current=now;
  const p=panel.current,v=clip.current;
  if(!p||!v||matchMedia('(prefers-reduced-motion: reduce)').matches||!p.animate){if(p){p.style.transform='';p.dataset.motion='idle';}dispatch({type:'step',delta:direction});return;}
  const token=++motionEpoch.current,height=p.clientHeight,target=clipAt(state.index+direction,activeClips);
  motionBusy.current=true;motionLoading.current=true;setMoving(true);setPaused(true);playRequest.current++;v.pause();p.dataset.motion='exit';
  const from=p.style.transform||'translateY(0px)';
  const exit=p.animate([{transform:from},{transform:'translateY('+(-direction*height)+'px)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});motion.current=exit;
  void exit.finished.then(()=>{
   if(token!==motionEpoch.current)return;
   p.style.transform='translateY('+(direction*height)+'px)';exit.cancel();motion.current=null;p.dataset.motion='loading';setLoadingClip(true);
   dispatch({type:'step',delta:direction});
   motionTimeout.current=setTimeout(()=>{if(token!==motionEpoch.current)return;stopMotion();setClipError('视频加载较慢，请稍候或刷新重试');},8000);
   const expected=[new URL(base+target.mp4,location.origin).href,new URL(base+target.webm,location.origin).href];
   const ready=()=>{
    if(token!==motionEpoch.current)return;
    if(v.dataset.clipId!==target.id||v.readyState<2||!expected.includes(v.currentSrc)||p.closest<HTMLElement>('.stage')?.dataset.headReady!=='true'){motionFrame.current=requestAnimationFrame(ready);return;}
    if(motionTimeout.current)clearTimeout(motionTimeout.current);motionTimeout.current=null;
    motionLoading.current=false;setLoadingClip(false);p.dataset.motion='enter';playWithSound();
    const enter=p.animate([{transform:'translateY('+(direction*height)+'px)'},{transform:'translateY(0px)'}],{duration:190,easing:'cubic-bezier(0,0,.2,1)',fill:'forwards'});motion.current=enter;
    void enter.finished.then(()=>{if(token!==motionEpoch.current)return;p.style.transform='';enter.cancel();motion.current=null;motionBusy.current=false;p.dataset.motion='idle';setMoving(false);}).catch(()=>{});
   };motionFrame.current=requestAnimationFrame(ready);
  }).catch(()=>{});
 },[phase,modal,scanVisible,state.index,activeClips,playWithSound,stopMotion]);
 const beginDrag=(e:ReactPointerEvent<HTMLElement>)=>{
  if(!e.isPrimary||phase!=='feed'||modal||scanVisible||motionBusy.current||e.button!==0||(e.target as Element).closest('button,input,textarea,dialog,.comments-sheet,.scan-demo,.feed-tabs'))return;
  drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,dy:0,vertical:false};
 };
 const moveDrag=(e:ReactPointerEvent<HTMLElement>)=>{
  const d=drag.current,p=panel.current;if(!d||d.id!==e.pointerId||!p)return;
  const dy=e.clientY-d.y,dx=e.clientX-d.x;
  if(!d.vertical){if(Math.abs(dy)<10||Math.abs(dy)<Math.abs(dx)*1.2)return;d.vertical=true;try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}}
  d.dy=dy;const offset=dy>0&&state.index===0?dy*.23:dy;
  p.dataset.motion='drag';p.style.transform='translateY('+Math.max(-p.clientHeight*.55,Math.min(p.clientHeight*.55,offset))+'px)';
 };
 const endDrag=(e:ReactPointerEvent<HTMLElement>,cancelled=false)=>{
  const d=drag.current;if(!d||d.id!==e.pointerId)return;drag.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  if(!d.vertical)return;suppressTap.current=performance.now()+350;
  const threshold=Math.max(48,Math.min(90,(panel.current?.clientHeight??400)*.14));
  if(!cancelled&&Math.abs(d.dy)>=threshold&&!(d.dy>0&&state.index===0)&&performance.now()-gestureLock.current>=450)step(d.dy<0?1:-1);else bounce();
 };
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement).matches('input,textarea,select')||modal||scanVisible)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();step(e.key==='ArrowDown'?1:-1);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[step,modal,scanVisible]);
 useEffect(()=>{if(!modal)return;const previous=document.activeElement as HTMLElement;
 if(modal==='comments'){const sheet=document.querySelector<HTMLElement>('.comments-sheet');sheet?.querySelector<HTMLButtonElement>('button')?.focus();const guard=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setModal(null);setCommentsExpanded(false);}if(e.key==='Tab'&&sheet){const controls=[...sheet.querySelectorAll<HTMLElement>('button,input:not([type="file"])')].filter(x=>!x.hasAttribute('disabled'));if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};window.addEventListener('keydown',guard);return()=>{window.removeEventListener('keydown',guard);previous?.focus();};}
 const dialog=document.querySelector<HTMLDialogElement>('dialog');dialog?.showModal();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setModal(null);}};window.addEventListener('keydown',escape);return()=>{dialog?.close();previous?.focus();window.removeEventListener('keydown',escape);};},[modal]);
 const artworkURL=new URL(base,window.location.origin);if(demoProfile)artworkURL.searchParams.set('demo',demoProfile);
 const share=async()=>{try{await navigator.clipboard.writeText(artworkURL.href);notify('作品链接已复制');}catch{setModal('about');notify('可在作品说明中复制链接');}};
 const descriptions:Record<string,string>={qinghai:'手套一戴，谁都能摇。 #青海摇 #是谁在摇', 'blue-run':'跑得再快，也跑不出推荐。 #蓝色妖姬 #金色传说', 'social-dance':'下一条还是熟悉的节奏。 #社会摇 #一起摇', disney:'不是城堡，是小区健骑机。 #我要迪士尼 #diss', caoxian:'这一次，轮到你喊了。 #山东菏泽曹县 #网络热梗', retreat:'有些内容，越退越近。 #退退退 #推荐'};
 const tapVideo=()=>{if(motionBusy.current||performance.now()<suppressTap.current)return;if(gestureNeeded.current||clip.current?.paused)playWithSound();else togglePlayback();};
 const openComments=()=>{setCommentsExpanded(false);setModal('comments');};
 const closeComments=()=>{setModal(null);setCommentsExpanded(false);};
 const commentsCount=275+(commentTotals[currentClip.id]??0);
 if(phase==='intro')return <div className="app"><main className="stage-wrap"><section className="stage intro" aria-label="Opening transition" style={{'--intro-duration':`${INTRO_DURATION_MS}ms`} as CSSProperties}><img className={`intro-art ${introReady?'ready':''}`} src={base+'media/splash-douwai.webp'} alt="抖歪" fetchPriority="high" onLoad={()=>setIntroReady(true)} onError={()=>setIntroReady(true)}/></section></main></div>;
 return <div className="app">

 <main className="stage-wrap"><section className={`stage ${phase} ${scanVisible?'scan-open':''} ${modal==='comments'?'comments-open':''} ${modal==='comments'&&commentsExpanded?'comments-expanded':''}`} aria-label="Interactive artwork"
 onWheel={e=>{if(Math.abs(e.deltaY)>20)step(e.deltaY>0?1:-1);}} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={e=>endDrag(e)} onPointerCancel={e=>endDrag(e,true)}>
 <div className="media-stage" inert={scanVisible||moving} role="button" aria-label={paused?'播放视频':'暂停视频'} tabIndex={0} onClick={tapVideo} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();tapVideo();}}}>
  <div ref={panel} className="feed-motion" data-motion="idle"><div className="portrait-backdrop"><video ref={clip} className="meme-video" autoPlay={!scanVisible&&!moving} loop muted={false} playsInline preload="auto" aria-label={currentClip.title+' source video'} data-clip-id={currentClip.id}
  onError={e=>{if(e.target===e.currentTarget)setClipError('视频加载失败，请刷新重试');}} onCanPlay={()=>setClipError('')}><source src={base+currentClip.mp4} type='video/mp4; codecs="avc1.4D4029,mp4a.40.2"'/><source src={base+currentClip.webm} type='video/webm; codecs="vp9,opus"'/></video></div>
  <FaceTracking video={video} clip={clip} source={currentClip} active={!!stream&&(scanVisible||!!currentClip.track)} onStatus={onTracking}/>
  {paused&&!needsGesture&&!moving&&<Play className="paused-symbol" size={52} weight="fill" aria-hidden="true"/>}
  </div>
  {loadingClip&&<div className="clip-loading" role="status">正在加载视频…</div>}
 </div>
 <video ref={video} className="camera-source" autoPlay muted playsInline aria-label="Local camera input"/>
 <header className="stage-header" inert={scanVisible}><button aria-label="打开菜单" className="header-menu" onClick={()=>setModal('menu')}><List size={25}/></button>
 <div className="feed-tabs">{['精选','团购','同城','商城','直播','关注','推荐'].map(name=><button key={name} className={tab===name?'active':''} onClick={()=>{setTab(name);if(name!=='推荐')notify('课程作品中的模拟频道');}}>{name}{['商城','关注'].includes(name)&&<Circle className="channel-dot" size={7} weight="fill"/>}</button>)}</div>
 <button aria-label="搜索视频" className="header-search" onClick={()=>setModal('explore')}><MagnifyingGlass size={26}/></button></header>
 {modal==='comments'&&<button className="compact-search" aria-label="搜索视频" onClick={()=>setModal('explore')}><MagnifyingGlass size={25}/></button>}
 <div className="sr-only" role="status">{tracking}</div>
 {needsGesture&&!scanVisible&&<div className="playback-hint" role="status">轻触画面开始有声播放</div>}{clipError&&!scanVisible&&<div className="feed-empty" role="alert">{clipError}</div>}
 <div className="post-caption" inert={scanVisible}><div className="author-name">@抖歪放映员 <span className="post-kind">{currentClip.group?'专属':'换脸'}</span></div><div className="caption-description"><p className={captionExpanded?'expanded':'collapsed'}>{currentClip.caption??descriptions[currentClip.id]}</p><button className="caption-expand" onClick={()=>setCaptionExpanded(v=>!v)}>{captionExpanded?'收起':'展开'}</button></div><small className="sound-line"><MusicNotes size={13}/>{currentClip.title} · 原声</small><span className="sr-only">{currentClip.title} {state.index%activeClips.length+1}/{activeClips.length}</span></div>
 <div className="action-rail" inert={scanVisible}><button className="avatar" aria-label={followed?'已关注放映员':'关注放映员'} onClick={()=>setFollowed(v=>!v)}><img src={base+'media/avatar-cat.webp'} alt="放映员头像"/><span>{followed?<Check size={13} weight="bold"/>:<Plus size={14} weight="bold"/>}</span></button>
 <button aria-label="点赞视频" aria-pressed={!!liked[currentClip.id]} className={liked[currentClip.id]?'liked':''} onClick={()=>setLiked(v=>({...v,[currentClip.id]:!v[currentClip.id]}))}><Heart size={33} weight="fill"/><span>{24+(liked[currentClip.id]?1:0)}</span></button>
 <button aria-label="打开评论区" onClick={openComments}><ChatCircleDots size={33} weight="fill"/><span>评论</span></button>
 <button aria-label="收藏视频" aria-pressed={!!saved[currentClip.id]} className={saved[currentClip.id]?'saved':''} onClick={()=>setSaved(v=>({...v,[currentClip.id]:!v[currentClip.id]}))}><Star size={33} weight="fill"/><span>{1+(saved[currentClip.id]?1:0)}</span></button>
 <button aria-label="分享作品" onClick={()=>void share()}><ShareFat size={32} weight="fill"/><span>分享</span></button>
 <button className="remix-button" aria-label="拍同款" onClick={()=>setModal('about')}><img src={base+'media/avatar-sunset.webp'} alt=""/><span>拍同款</span></button></div>
 <nav inert={scanVisible} className="bottom-nav" aria-label="底部导航"><button className="active" onClick={()=>{setTab('推荐');setModal(null);}}>首页</button><button onClick={()=>setModal('explore')}>朋友</button><button className="create-button" aria-label="视频合集" onClick={()=>setModal('explore')}><Plus size={27} weight="bold"/></button><button onClick={()=>setModal('inbox')}>消息<span className="notification-count">59</span></button><button onClick={()=>setModal('profile')}>我</button></nav>
 {modal==='comments'&&<CommentsSheet title={currentClip.title} count={commentsCount} items={commentStore[currentClip.id]??initialComments} onItemsChange={items=>setCommentStore(v=>({...v,[currentClip.id]:items}))} onImageURL={url=>imageURLs.current.push(url)} onClose={closeComments} onExpand={setCommentsExpanded} onPost={()=>setCommentTotals(v=>({...v,[currentClip.id]:(v[currentClip.id]??0)+1}))}/>}
 {toast&&<div className="toast" role="status"><Check size={15}/>{toast}</div>}
 {scanVisible&&demoProfile&&<ScanDemo profile={demoProfile} camera={video} facePresent={!!stream&&tracking==='LIVE · your face'} cameraError={cameraError} retry={()=>void enableCamera()} onContinue={()=>{setScanFinished(true);setCameraError('');scanVisibleRef.current=false;playWithSound();}}/>}
 </section></main>
 {cameraError&&!scanVisible&&<div className="camera-error" role="alert"><CameraSlash size={20}/><p>{cameraError}</p><button onClick={()=>{setCameraError('');}}>继续观看</button><button onClick={()=>void enableCamera()} disabled={busy}>重试摄像头</button><button aria-label="关闭摄像头提示" onClick={()=>setCameraError('')}><X/></button></div>}
 {modal&&modal!=='comments'&&<dialog className="dialog" onCancel={()=>setModal(null)} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}><button className="dialog-close" onClick={()=>setModal(null)} aria-label="关闭弹窗"><X size={23}/></button>
 {modal==='menu'&&<><h2>抖歪</h2><div className="clip-list"><button onClick={()=>{setModal(null);replay();}}>重新播放当前视频</button><button onClick={()=>setModal('explore')}>视频合集</button><button onClick={()=>setModal('about')}>作品说明</button></div></>}
 {modal==='about'&&<><span className="mono">课程概念作品 · 非官方应用</span><h2>推荐给谁？</h2>{demoProfile?<p>当前分区：{demoProfile==='lulu'?'噜噜':'奶龙／奶蛙'}，共{activeClips.length}条原视频。只循环本组，合集也不提供其他分组。卡通角色和原声保留，不叠加摄像头头像。标签来自随机分组或固定演示链接，不是对身份或兴趣的识别。</p>:<p>FOR YOU is a fictional platform and interactive artwork inspired by TikTok / Douyin. This version uses the supplied original meme videos and an exaggerated head overlay. There are six supplied meme clips. Swipe to change the video; Explore lists them. The catalog cycles after the sixth clip.</p>}<p>Camera frames and face landmarks stay in your browser. Face tracking positions effects; it does not identify you or infer personality. No identity is assigned or inferred.</p><p>The original video supplies the body, movement and sound. Camera frames are cropped and composited locally; they are never uploaded. The page requests the camera after the opening transition, but access always requires browser permission. There are no in-page camera or mute switches. Browser/system controls remain available, and leaving the page releases capture. Without a detected camera face, the central source-video head is mosaicked. No fictional avatar is substituted. This is a playful 2D collage, not a seamless neural face swap.</p><label>Share the artwork<input readOnly value={artworkURL.href} onFocus={e=>e.target.select()}/></label><span className="mono">ARTWORK / NOT A CLAIM ABOUT TIKTOK’S FACE ANALYSIS</span></>}
 {modal==='profile'&&<><span className="mono">本地体验</span><h2>我</h2><p>No account or assigned identity. Camera frames stay on your device.</p><p>Camera: {stream?'on':'off'}</p></>}
 {modal==='explore'&&<><span className="mono">{demoProfile&&scanFinished?(demoProfile==='lulu'?'噜噜分区':'奶龙／奶蛙分区'):'抖歪'} · {activeClips.length}条视频</span><h2>视频合集</h2><div className="clip-list">{activeClips.map((item,i)=><button key={item.id} className={item.id===currentClip.id?'selected':''} onClick={()=>{setModal(null);dispatch({type:'select',index:i});}}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}</div></>}
 {modal==='inbox'&&<><span className="mono">模拟消息</span><h2>暂时没有新消息</h2><p>未读数字是作品界面的一部分，不代表真实账号消息。</p></>}
 </dialog>}
 </div>;
}
