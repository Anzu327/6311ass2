
import {useEffect,useRef} from 'react';
import type {MemePost} from './memes';
export function useMemeSound(post:MemePost|null,enabled:boolean){
 const audio=useRef<AudioContext|null>(null);
 useEffect(()=>()=>{void audio.current?.close();window.speechSynthesis?.cancel();},[]);
 useEffect(()=>{
  if(!enabled||!post){window.speechSynthesis?.cancel();return;}
  let cancelled=false;const nodes:OscillatorNode[]=[];
  try{
   const context=audio.current||(audio.current=new AudioContext());void context.resume();
   for(let i=0;i<6;i++){const osc=context.createOscillator(),gain=context.createGain(),start=context.currentTime+i*.19;osc.type=i%2?'triangle':'sine';osc.frequency.value=110*Math.pow(2,(post.id.length+i%3)/12);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.055,start+.015);gain.gain.exponentialRampToValueAtTime(.001,start+.16);osc.connect(gain);gain.connect(context.destination);osc.start(start);osc.stop(start+.18);nodes.push(osc);}
   const timer=window.setTimeout(()=>{if(cancelled||!window.speechSynthesis)return;const utterance=new SpeechSynthesisUtterance(post.voice);utterance.lang='zh-CN';utterance.rate=1.12;utterance.pitch=post.category==='soft'?1.35:.85;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('zh'));if(voice)utterance.voice=voice;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);},200);
   return()=>{cancelled=true;clearTimeout(timer);nodes.forEach(n=>{try{n.stop();}catch{/* already ended */}});window.speechSynthesis?.cancel();};
  }catch{return()=>{cancelled=true;};}
 },[post,enabled]);
}
