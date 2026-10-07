
export const INTRO_DURATION_MS=1500;
export type Phase='intro'|'feed';
export interface Experience {phase:Phase;index:number;}
export type Action={type:'entered'}|{type:'step';delta:number}|{type:'reset'}|{type:'select';index:number};
export const initialExperience:Experience={phase:'intro',index:0};
export function reducer(s:Experience,a:Action):Experience{
 switch(a.type){
 case 'entered':return s.phase==='intro'?{phase:'feed',index:0}:s;
 case 'step':return s.phase==='feed'?{...s,index:Math.max(0,s.index+Math.sign(a.delta))}:s;
 case 'select':return s.phase==='feed'?{...s,index:Math.max(0,Math.floor(a.index))}:s;
 case 'reset':return s.phase==='feed'?{...s,index:0}:s;
 }
}
export function stopStream(stream:MediaStream|null){stream?.getTracks().forEach(track=>track.stop());}
