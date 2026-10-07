import {describe,it,expect} from 'vitest';
import {containBox,sampleHead,fittedHeadScale,mosaicCrop,headCrop,isHeadCategory,validHeadTrack,type HeadTrack} from './faceGeometry';
describe('video head overlay geometry',()=>{
 it('contains the complete video in narrow and desktop portrait stages',()=>{for(const [w,h] of [[390,844],[320,568],[355,768]]){const b=containBox(720,1166,w,h);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.x+720*b.scale).toBeLessThanOrEqual(w+.001);expect(b.y+1166*b.scale).toBeLessThanOrEqual(h+.001);}});
 const t:HeadTrack={fps:30,width:720,height:1166,frames:[[100,200,60,80,0],[120,220,64,84,.2]]};
 it('interpolates by actual video time without lag',()=>{expect(sampleHead(t,1/60)).toEqual([110,210,62,82,.1]);expect(sampleHead(t,-1)).toEqual(t.frames[0]);expect(sampleHead(t,999)).toEqual(t.frames[1]);});
 it('rejects corrupt tracks',()=>{expect(validHeadTrack(t)).toBe(true);expect(validHeadTrack(null)).toBe(false);expect(validHeadTrack({...t,frames:[[0,0,-1,2,0]]})).toBe(false);});
 it('uses the official hair and skin categories, not background or clothes',()=>{expect([0,1,2,3,4,5].map(isHeadCategory)).toEqual([false,true,true,true,false,true]);});
 it('includes hair and chin, excludes the torso, clamps edge crops',()=>{const face=Array.from({length:478},()=>({x:.5,y:.5}));face[234]={x:.35,y:.5};face[454]={x:.65,y:.5};face[10]={x:.5,y:.3};face[152]={x:.5,y:.6};face[33]={x:.42,y:.4};face[263]={x:.58,y:.4};const crop=headCrop(face,288,512)!;expect(crop.y).toBeLessThan(face[10].y*512);expect(crop.y+crop.height).toBeGreaterThan(crop.chin.y);expect(crop.y+crop.height).toBeLessThan(.7*512);expect(crop.angle).toBe(0);});
});

it('mosaic covers forehead, face and jaw with safe video boundaries',()=>{
 const c=mosaicCrop([100,200,60,80,0],720,1166);
 expect(c.x).toBeLessThan(100);expect(c.y).toBeLessThan(200);
 expect(c.x+c.width).toBeGreaterThan(160);expect(c.y+c.height).toBeGreaterThan(280);
 const edge=mosaicCrop([0,0,60,80,0],720,1166);expect(edge.x).toBe(0);expect(edge.y).toBe(0);
 const far=mosaicCrop([690,1100,30,66,0],720,1166);expect(far.x+far.width).toBe(720);expect(far.y+far.height).toBe(1166);
});

it('does not paste heads into blank end frames',()=>{const t:HeadTrack={fps:30,width:576,height:1024,frames:[[100,200,60,80,0],null]};expect(validHeadTrack(t)).toBe(true);expect(sampleHead(t,1/30)).toBeNull();});
it('caps giant close-up heads inside the visible video',()=>{const r=fittedHeadScale([20,10,500,550,0],190,220,576,744);expect(r.scale*190).toBeLessThanOrEqual(576*.9);expect(r.chin-r.scale*220).toBeGreaterThanOrEqual(744*.02-.001);});

it('never interpolates a head across a hard scene cut',()=>{const t:HeadTrack={fps:30,width:720,height:370,frames:[[10,20,30,40,0],[500,200,100,100,.2]],cuts:[1]};expect(sampleHead(t,1/60)).toEqual(t.frames[0]);});
