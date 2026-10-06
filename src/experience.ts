
import {identities,type IdentityId} from './content';
import {freshInterests,nextMeme,type Interests,type MemeEffect} from './memes';
export type Phase='welcome'|'scanning'|'identity'|'feed'|'resetting'|'ending';
export interface Experience {phase:Phase;identity:IdentityId|null;index:number;denials:number;history:string[];interests:Interests;}
export type Action={type:'start';identity:IdentityId}|{type:'scanned'}|{type:'deny'}|{type:'feed'}|{type:'step';delta:number}|{type:'interest';category:IdentityId;amount:number}|{type:'discover';id:MemeEffect}|{type:'reset'}|{type:'restart'};
export const initialExperience:Experience={phase:'welcome',identity:null,index:0,denials:0,history:[],interests:freshInterests()};
export function reducer(s:Experience,a:Action):Experience{
 switch(a.type){
 case 'start':return s.phase==='welcome'?{phase:'scanning',identity:a.identity,index:0,denials:0,history:[nextMeme(a.identity,0,freshInterests(),[])],interests:freshInterests()}:s;
 case 'scanned':return s.phase==='scanning'?{...s,phase:'identity'}:s.phase==='resetting'?{...s,phase:'ending'}:s;
 case 'deny':return s.phase==='identity'?{...s,denials:s.denials+1}:s;
 case 'feed':return s.phase==='identity'?{...s,phase:'feed'}:s;
 case 'step':{
  if(s.phase!=='feed'||!s.identity)return s;
  const target=Math.max(0,s.index+(a.delta>0?1:a.delta<0?-1:0));
  if(target<s.history.length)return {...s,index:target};
  return {...s,index:target,history:[...s.history,nextMeme(s.identity,target,s.interests,s.history)]};
 }
 case 'interest':return s.phase==='feed'?{...s,interests:{...s.interests,[a.category]:Math.max(0,s.interests[a.category]+a.amount)}}:s;
 case 'discover':return s.phase==='feed'?{...s,index:s.history.length,history:[...s.history,a.id]}:s;
 case 'reset':return s.phase==='identity'||s.phase==='feed'?{...s,phase:'resetting'}:s;
 case 'restart':return {...initialExperience,history:[],interests:freshInterests()};
 }
}
export function randomIdentity(random:()=>number=Math.random):IdentityId{return identities[Math.min(2,Math.max(0,Math.floor(random()*3)))].id;}
export function stopStream(stream:MediaStream|null){stream?.getTracks().forEach(track=>track.stop());}
