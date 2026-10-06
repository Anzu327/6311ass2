
import {describe,it,expect,vi} from 'vitest';
import {reducer,initialExperience,randomIdentity,stopStream} from './experience';
import {identities} from './content';
import {memes,memeById,nextMeme,freshInterests} from './memes';
const enter=(identity:'soft'|'tech'|'culture'='soft')=>reducer(reducer(reducer(initialExperience,{type:'start',identity}),{type:'scanned'}),{type:'feed'});
describe('meme recommendation experience',()=>{
 it.each(identities)('starts $name with 48 distinct clips',identity=>{let s=enter(identity.id);for(let i=1;i<48;i++)s=reducer(s,{type:'step',delta:1});expect(new Set(s.history).size).toBe(48);expect(s.history.every(id=>memes.some(m=>m.id===id))).toBe(true);});
 it('keeps scrolling beyond the former six-post limit',()=>{let s=enter();for(let i=0;i<120;i++)s=reducer(s,{type:'step',delta:1});expect(s.index).toBe(120);expect(s.history).toHaveLength(121);expect(memeById(s.history[120]).id).toBe(s.history[120]);});
 it('keeps already-seen posts stable after likes and backwards navigation',()=>{let s=enter();for(let i=0;i<12;i++)s=reducer(s,{type:'step',delta:1});const history=[...s.history];s=reducer(s,{type:'interest',category:'culture',amount:9});s=reducer(s,{type:'step',delta:-1});expect(s.history).toEqual(history);expect(s.index).toBe(11);expect(reducer({...s,index:0},{type:'step',delta:-1}).index).toBe(0);});
 it('narrows future recommendations toward liked categories',()=>{const scores={soft:12,tech:0,culture:0};const history:string[]=[];for(let i=0;i<148;i++)history.push(nextMeme('culture',i,scores,history));const count=history.slice(48).filter(id=>memeById(id).category==='soft').length;expect(count).toBeGreaterThan(85);});
 it('does not repeat the immediately previous effect when alternatives exist',()=>{const history:string[]=[];for(let i=0;i<60;i++)history.push(nextMeme('tech',i,freshInterests(),history));for(let i=1;i<history.length;i++)expect(history[i]).not.toBe(history[i-1]);});
 it('can explore a specific effect without rewriting history',()=>{const s=enter();const next=reducer(s,{type:'discover',id:'food-2'});expect(next.history).toEqual([...s.history,'food-2']);expect(next.index).toBe(1);expect(next.interests).toEqual(s.interests);});
 it('undoes a like without allowing negative interest',()=>{let s=enter();s=reducer(s,{type:'interest',category:'soft',amount:3});s=reducer(s,{type:'interest',category:'soft',amount:-3});expect(s.interests.soft).toBe(0);expect(reducer(s,{type:'interest',category:'soft',amount:-3}).interests.soft).toBe(0);});
 it.each(identities)('denial and reset retain the session label for $name',identity=>{let s=reducer(initialExperience,{type:'start',identity:identity.id});s=reducer(s,{type:'scanned'});s=reducer(s,{type:'deny'});expect(s.denials).toBe(1);s=reducer(s,{type:'feed'});s=reducer(s,{type:'interest',category:'tech',amount:3});s=reducer(s,{type:'reset'});s=reducer(s,{type:'scanned'});expect(s.phase).toBe('ending');expect(s.identity).toBe(identity.id);expect(s.interests.tech).toBe(3);expect(reducer(s,{type:'restart'})).toEqual(initialExperience);});
 it('ignores navigation and interests outside the feed',()=>{expect(reducer(initialExperience,{type:'step',delta:1})).toEqual(initialExperience);expect(reducer(initialExperience,{type:'interest',category:'soft',amount:3})).toEqual(initialExperience);});
 it('ignores duplicate start and scan transitions',()=>{const s=reducer(reducer(initialExperience,{type:'start',identity:'tech'}),{type:'scanned'});expect(reducer(s,{type:'scanned'})).toEqual(s);expect(reducer(s,{type:'start',identity:'soft'})).toEqual(s);});
 it('assigns identity independently of camera input',()=>{expect([0,.4,.9].map(n=>randomIdentity(()=>n))).toEqual(['soft','tech','culture']);});
 it('releases every camera track',()=>{const a=vi.fn(),b=vi.fn();stopStream({getTracks:()=>[{stop:a},{stop:b}]} as unknown as MediaStream);expect(a).toHaveBeenCalledOnce();expect(b).toHaveBeenCalledOnce();stopStream(null);});
});

describe('extended bootleg clip catalog',()=>{
 it('includes all 16 families, three materially different variants and all skins',()=>{expect(memes).toHaveLength(48);expect(new Set(memes.map(m=>m.kind)).size).toBe(16);expect(new Set(memes.map(m=>m.id)).size).toBe(48);expect(new Set(memes.map(m=>m.skin))).toEqual(new Set(['pirate','subtitles','infected']));for(const kind of new Set(memes.map(m=>m.kind))){const variants=memes.filter(m=>m.kind===kind);expect(variants).toHaveLength(3);expect(new Set(variants.map(m=>m.title)).size).toBe(3);expect(new Set(variants.map(m=>m.instruction)).size).toBe(3);}});
 it('avoids repeating any of the previous three meme families in the recommendation loop',()=>{const h:string[]=[];for(let i=0;i<300;i++){const id=nextMeme('tech',i,{soft:30,tech:1,culture:0},h);if(i>=48)expect(h.slice(-3).map(p=>memeById(p).kind)).not.toContain(memeById(id).kind);h.push(id);}});
});
