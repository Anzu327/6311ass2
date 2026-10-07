import {describe,it,expect} from 'vitest';
import {containBox,sampleHead,headCrop,isHeadCategory,validHeadTrack,type HeadTrack} from './faceGeometry';
describe('video head overlay geometry',()=>{
 it('contains the complete video in narrow and desktop portrait stages',()=>{for(const [w,h] of [[390,844],[320,568],[355,768]]){const b=containBox(720,1166,w,h);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.x+720*b.scale).toBeLessThanOrEqual(w+.001);expect(b.y+1166*b.scale).toBeLessThanOrEqual(h+.001);}});
 const t:HeadTrack={fps:30,width:720,height:1166,frames:[[100,200,60,80,0],[120,220,64,84,.2]]};
 it('interpolates by actual video time without lag',()=>{expect(sampleHead(t,1/60)).toEqual([110,210,62,82,.1]);expect(sampleHead(t,-1)).toEqual(t.frames[0]);expect(sampleHead(t,999)).toEqual(t.frames[1]);});
 it('rejects corrupt tracks',()=>{expect(validHeadTrack(t)).toBe(true);expect(validHeadTrack(null)).toBe(false);expect(validHeadTrack({...t,frames:[[0,0,-1,2,0]]})).toBe(false);});
 it('uses the official hair and skin categories, not background or clothes',()=>{expect([0,1,2,3,4,5].map(isHeadCategory)).toEqual([false,true,true,true,false,true]);});
 it('includes hair and chin, excludes the torso, clamps edge crops',()=>{const face=Array.from({length:478},()=>({x:.5,y:.5}));face[234]={x:.35,y:.5};face[454]={x:.65,y:.5};face[10]={x:.5,y:.3};face[152]={x:.5,y:.6};face[33]={x:.42,y:.4};face[263]={x:.58,y:.4};const crop=headCrop(face,288,512)!;expect(crop.y).toBeLessThan(face[10].y*512);expect(crop.y+crop.height).toBeGreaterThan(crop.chin.y);expect(crop.y+crop.height).toBeLessThan(.7*512);expect(crop.angle).toBe(0);});
});
