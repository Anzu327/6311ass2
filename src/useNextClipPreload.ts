import {useEffect,type RefObject} from 'react';
import {clipAt,type FeedClip} from './clips';

// Warm compressed source assets, never camera pixels or another video decoder.
export default function useNextClipPreload(player:RefObject<HTMLVideoElement|null>,catalog:readonly FeedClip[],index:number,enabled:boolean){
 useEffect(()=>{
  const video=player.current;if(!enabled||!video||document.hidden)return;
  const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;
  if(connection?.saveData)return;
  const next=clipAt(index+1,catalog),controller=new AbortController(),base=import.meta.env.BASE_URL;
  const poster=next.track?null:new Image();if(poster)poster.src=base+'media/posters/'+next.id+'.webp';
  const warm=async()=>{
   const source=video.canPlayType('video/mp4; codecs="avc1.4D4029,mp4a.40.2"')?next.mp4:next.webm;
   try{
    // Let current playback buffer first. Do not download a very large next clip whole.
    const head=await fetch(base+source,{method:'HEAD',signal:controller.signal});
    const bytes=Number(head.headers.get('content-length'));
    if(!head.ok||!bytes||bytes>12*1024*1024)return;
    const response=await fetch(base+source,{cache:'force-cache',signal:controller.signal,priority:'low'});
    if(response.ok)await response.arrayBuffer();
   }catch{/* Speculation is optional; the real player still handles loading/errors. */}
  };
  const timer=setTimeout(()=>{void warm();if(next.track)void fetch(base+next.track,{cache:'force-cache',signal:controller.signal}).catch(()=>{});},650);
  const cancel=()=>{if(document.hidden)controller.abort();};
  const leave=()=>controller.abort();document.addEventListener('visibilitychange',cancel);window.addEventListener('pagehide',leave);
  return()=>{clearTimeout(timer);controller.abort();document.removeEventListener('visibilitychange',cancel);window.removeEventListener('pagehide',leave);};
 },[player,catalog,index,enabled]);
}
