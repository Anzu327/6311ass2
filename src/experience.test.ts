import {describe,it,expect,vi} from 'vitest';
import {reducer,initialExperience,randomIdentity,stopStream} from './experience';
import {identities} from './content';
describe('identity enclosure',()=>{
 it.each(identities)('$name has a complete six-post arc',identity=>{expect(identity.posts).toHaveLength(6);expect(identity.posts[3].caption).toContain('Fictional advertisement');});
 it.each(identities)('denial and reset preserve $name',identity=>{let s=reducer(initialExperience,{type:'start',identity:identity.id});s=reducer(s,{type:'scanned'});s=reducer(s,{type:'deny'});expect(s.identity).toBe(identity.id);expect(s.denials).toBe(1);s=reducer(s,{type:'feed'});s=reducer(s,{type:'reset'});s=reducer(s,{type:'scanned'});expect(s.phase).toBe('ending');expect(s.identity).toBe(identity.id);expect(reducer(s,{type:'restart'})).toEqual(initialExperience);});
 it('ignores duplicate scan and start transitions',()=>{const s=reducer(reducer(initialExperience,{type:'start',identity:'tech'}),{type:'scanned'});expect(reducer(s,{type:'scanned'})).toEqual(s);expect(reducer(s,{type:'start',identity:'soft'})).toEqual(s);});
 it('bounds feed navigation and ignores navigation outside feed',()=>{expect(reducer(initialExperience,{type:'step',delta:1})).toEqual(initialExperience);const s={phase:'feed' as const,identity:'soft' as const,index:0,denials:0};expect(reducer(s,{type:'step',delta:-1}).index).toBe(0);expect(reducer({...s,index:5},{type:'step',delta:1}).index).toBe(5);});
 it('can assign every identity independently of camera',()=>{expect([0,.4,.9].map(n=>randomIdentity(()=>n))).toEqual(['soft','tech','culture']);});
 it('releases every camera track',()=>{const a=vi.fn(),b=vi.fn();stopStream({getTracks:()=>[{stop:a},{stop:b}]} as unknown as MediaStream);expect(a).toHaveBeenCalledOnce();expect(b).toHaveBeenCalledOnce();stopStream(null);});
});
