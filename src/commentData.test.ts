import {expect,it} from 'vitest';
import {commentsForClip} from './commentData';
import {feedClips,groupedClips} from './clips';
const clips=[...feedClips,...Object.values(groupedClips).flat()];
it('gives every clip a full, different discussion with valid replies and unique identities',()=>{
 const discussions=clips.map(clip=>commentsForClip(clip,123));
 expect(new Set(discussions.map(items=>items.map(item=>item.text).join('\n'))).size).toBe(clips.length);
 const allIds:string[]=[];
 for(const items of discussions){expect(items.length).toBeGreaterThanOrEqual(20);expect(new Set(items.map(x=>x.text)).size).toBe(items.length);expect(items[0].replies).toHaveLength(3);
  for(const item of items.flatMap(x=>[x,...x.replies??[]])){allIds.push(item.id);expect(item.text.trim()).not.toBe('');expect(item.likes).toBeGreaterThanOrEqual(0);expect(['avatar-cat.webp','avatar-panda.webp','avatar-sunset.webp']).toContain(item.avatar);}}
 expect(new Set(allIds).size).toBe(allIds.length);
});
it('keeps discussion stable during a visit, varies another visit and shares no mutable rows',()=>{
 const clip=groupedClips.kobe[0],first=commentsForClip(clip,5);
 expect(commentsForClip(clip,5)).toEqual(first);
 expect(commentsForClip(clip,6)).not.toEqual(first);
 first[0].replies?.push({...first[0],id:'local',text:'local reply'});
 expect(commentsForClip(clip,5)[0].replies).toHaveLength(3);
});
it('uses legacy clip topics and avoids face replacement claims in original-video pools',()=>{
 expect(commentsForClip(feedClips[0],5)[0].text).toContain('青海摇');
 for(const clip of Object.values(groupedClips).flat())expect(commentsForClip(clip,5).map(x=>x.text).join('')).not.toMatch(/换脸|长成我|摄像头/);
});
