
import {describe,it,expect,vi} from 'vitest';
import {reducer,initialExperience,INTRO_DURATION_MS,stopStream} from './experience';
const enter=()=>reducer(initialExperience,{type:'entered'});
describe('1.5-second direct entry',()=>{
 it('starts in a 1.5-second intro with no scan or identity state',()=>{expect(INTRO_DURATION_MS).toBe(1500);expect(initialExperience).toEqual({phase:'intro',index:0});});
 it('goes directly from intro to feed',()=>expect(enter()).toEqual({phase:'feed',index:0}));
 it('does not interrupt an entered feed with duplicate timers',()=>{const s={...enter(),index:4};expect(reducer(s,{type:'entered'})).toEqual(s);});
 it('keeps forward and backward navigation',()=>{let s=enter();for(let i=0;i<100;i++)s=reducer(s,{type:'step',delta:1});expect(s.index).toBe(100);s=reducer(s,{type:'step',delta:-1});expect(s.index).toBe(99);expect(reducer({...s,index:0},{type:'step',delta:-1}).index).toBe(0);});
 it('reset stays in the feed, without another scan or outro',()=>{const s={...enter(),index:10};expect(reducer(s,{type:'reset'})).toEqual({phase:'feed',index:0});});
 it('ignores navigation and reset during intro',()=>{expect(reducer(initialExperience,{type:'step',delta:1})).toEqual(initialExperience);expect(reducer(initialExperience,{type:'reset'})).toEqual(initialExperience);});
 it('stops all camera tracks',()=>{const a=vi.fn(),b=vi.fn();stopStream({getTracks:()=>[{stop:a},{stop:b}]} as unknown as MediaStream);expect(a).toHaveBeenCalledOnce();expect(b).toHaveBeenCalledOnce();stopStream(null);});
});
