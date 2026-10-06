
import {identities,type IdentityId} from './content';
export type Phase='welcome'|'scanning'|'identity'|'feed'|'resetting'|'ending';
export interface Experience {phase:Phase;identity:IdentityId|null;index:number;denials:number;}
export type Action={type:'start';identity:IdentityId}|{type:'scanned'}|{type:'deny'}|{type:'feed'}|{type:'step';delta:number}|{type:'reset'}|{type:'restart'};
export const initialExperience:Experience={phase:'welcome',identity:null,index:0,denials:0};
export function reducer(s:Experience,a:Action):Experience{
 switch(a.type){
 case 'start':return s.phase==='welcome'?{phase:'scanning',identity:a.identity,index:0,denials:0}:s;
 case 'scanned':return s.phase==='scanning'?{...s,phase:'identity'}:s.phase==='resetting'?{...s,phase:'ending'}:s;
 case 'deny':return s.phase==='identity'?{...s,denials:s.denials+1}:s;
 case 'feed':return s.phase==='identity'?{...s,phase:'feed'}:s;
 case 'step':return s.phase==='feed'?{...s,index:Math.max(0,s.index+Math.sign(a.delta))}:s;
 case 'reset':return s.phase==='identity'||s.phase==='feed'?{...s,phase:'resetting'}:s;
 case 'restart':return {...initialExperience};
 }
}
export function randomIdentity(random:()=>number=Math.random):IdentityId{return identities[Math.min(2,Math.max(0,Math.floor(random()*3)))].id;}
export function stopStream(stream:MediaStream|null){stream?.getTracks().forEach(track=>track.stop());}
