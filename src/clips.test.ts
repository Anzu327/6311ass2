import {it,expect} from 'vitest';
import {feedClips,clipAt,feedFor,groupedClips} from './clips';
it('offers six actual supplied clips and cycles without a fake variant catalog',()=>{expect(feedClips).toHaveLength(6);expect(new Set(feedClips.map(c=>c.mp4)).size).toBe(6);expect(clipAt(6)).toEqual(feedClips[0]);expect(clipAt(7)).toEqual(feedClips[1]);expect(clipAt(-1)).toEqual(feedClips[5]);});
it('applies glove restoration only to the actual white-glove clip',()=>expect(feedClips.filter(c=>c.whiteGloves).map(c=>c.id)).toEqual(['qinghai']));

it('keeps the explicit cartoon pools separate and the legacy catalog unchanged',()=>{
 expect(feedFor(null)).toBe(feedClips);expect(feedFor('lulu')).toHaveLength(8);expect(feedFor('nailong')).toHaveLength(7);
 const lulu=feedFor('lulu'),nailong=feedFor('nailong');
 expect(lulu.every(c=>c.group==='lulu')).toBe(true);expect(nailong.every(c=>c.group==='nailong')).toBe(true);
 expect(new Set([...lulu,...nailong].map(c=>c.mp4)).size).toBe(15);
 expect([...lulu,...nailong].every(c=>!c.track&&!!c.webm&&!c.whiteGloves)).toBe(true);
 expect(groupedClips.nailong.at(-1)?.title).toContain('奶蛙');
 expect(clipAt(8,lulu)).toBe(lulu[0]);expect(clipAt(7,nailong)).toBe(nailong[0]);
 expect(clipAt(-1,lulu)).toBe(lulu[7]);expect(clipAt(-1,nailong)).toBe(nailong[6]);
});

it('plays all seven Hu Ge originals in their own pool without head overlays',()=>{
 const clips=feedFor('huge');expect(clips).toHaveLength(7);
 expect(clips.every(c=>c.group==='huge'&&!c.track&&c.webm&&c.title.startsWith('虎哥'))).toBe(true);
 expect(new Set(clips.map(c=>c.mp4)).size).toBe(7);
 expect(clipAt(7,clips)).toBe(clips[0]);expect(clipAt(-1,clips)).toBe(clips[6]);
});
