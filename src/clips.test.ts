import {it,expect} from 'vitest';
import {feedClips,clipAt} from './clips';
it('offers six actual supplied clips and cycles without a fake variant catalog',()=>{expect(feedClips).toHaveLength(6);expect(new Set(feedClips.map(c=>c.mp4)).size).toBe(6);expect(clipAt(6)).toEqual(feedClips[0]);expect(clipAt(7)).toEqual(feedClips[1]);expect(clipAt(-1)).toEqual(feedClips[5]);});
it('applies glove restoration only to the actual white-glove clip',()=>expect(feedClips.filter(c=>c.whiteGloves).map(c=>c.id)).toEqual(['qinghai']));
