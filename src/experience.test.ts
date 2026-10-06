
import {describe,it,expect,vi} from 'vitest';
import {reducer,initialExperience,randomIdentity,stopStream} from './experience';
import {identities} from './content';
const enter=()=>reducer(reducer(reducer(initialExperience,{type:'start',identity:'soft'}),{type:'scanned'}),{type:'feed'});
describe('effect-free camera shell',()=>{
 it('enters without a catalog or recommendation history',()=>{const s=enter();expect(s.phase).toBe('feed');expect(s).not.toHaveProperty('history');expect(s).not.toHaveProperty('interests');});
 it('retains forward and backward navigation without pretending there are videos',()=>{let s=enter();for(let i=0;i<100;i++)s=reducer(s,{type:'step',delta:1});expect(s.index).toBe(100);s=reducer(s,{type:'step',delta:-1});expect(s.index).toBe(99);expect(reducer({...s,index:0},{type:'step',delta:-1}).index).toBe(0);});
 it.each(identities)('retains denial and reset for $name',i=>{let s=reducer(initialExperience,{type:'start',identity:i.id});s=reducer(s,{type:'scanned'});s=reducer(s,{type:'deny'});expect(s.denials).toBe(1);s=reducer(s,{type:'feed'});s=reducer(s,{type:'reset'});s=reducer(s,{type:'scanned'});expect(s.phase).toBe('ending');expect(s.identity).toBe(i.id);expect(reducer(s,{type:'restart'})).toEqual(initialExperience);});
 it('ignores navigation outside the camera feed',()=>expect(reducer(initialExperience,{type:'step',delta:1})).toEqual(initialExperience));
 it('ignores duplicate scan and start',()=>{const s=reducer(reducer(initialExperience,{type:'start',identity:'tech'}),{type:'scanned'});expect(reducer(s,{type:'scanned'})).toEqual(s);expect(reducer(s,{type:'start',identity:'soft'})).toEqual(s);});
 it('assigns labels independently of the camera',()=>expect([0,.4,.9].map(n=>randomIdentity(()=>n))).toEqual(['soft','tech','culture']));
 it('stops every camera track',()=>{const a=vi.fn(),b=vi.fn();stopStream({getTracks:()=>[{stop:a},{stop:b}]} as unknown as MediaStream);expect(a).toHaveBeenCalledOnce();expect(b).toHaveBeenCalledOnce();stopStream(null);});
});
