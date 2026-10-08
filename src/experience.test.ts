
import {describe,it,expect,vi} from 'vitest';
import {reducer,initialExperience,INTRO_DURATION_MS,stopStream,entryProfile} from './experience';
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

it('selects a specific supplied clip without replaying the intro',()=>{const s=reducer(initialExperience,{type:'entered'});expect(reducer(s,{type:'select',index:4})).toEqual({phase:'feed',index:4});expect(reducer(initialExperience,{type:'select',index:4})).toEqual(initialExperience);});

describe('unified entry is random, never face/gender inferred',()=>{
 it('assigns all three groups without a preset',()=>{expect(entryProfile('',0)).toBe('nailong');expect(entryProfile('',1)).toBe('lulu');expect(entryProfile('',2)).toBe('huge');expect(entryProfile('?demo=unknown',3)).toBe('nailong');expect(entryProfile('',254)).toBe('huge');});
 it('distributes the accepted random byte range evenly across all pools',()=>{const counts={nailong:0,lulu:0,huge:0};for(let byte=0;byte<255;byte++)counts[entryProfile('',byte)!]++;expect(counts).toEqual({nailong:85,lulu:85,huge:85});});
 it('keeps explicit classroom presets fixed',()=>{expect(entryProfile('?demo=lulu',0)).toBe('lulu');expect(entryProfile('?demo=nailong',1)).toBe('nailong');expect(entryProfile('?demo=lulu&feed=memes',0)).toBe('lulu');expect(entryProfile('?demo=huge',0)).toBe('huge');});
 it('retains the original human-meme feed only at its explicit URL',()=>{expect(entryProfile('?feed=memes',1)).toBeNull();expect(entryProfile('?feed=other',0)).toBe('nailong');});
});
