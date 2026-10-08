export const feedGroups=['nailong','lulu','huge','kobe'] as const;
export type FeedGroup=typeof feedGroups[number];
export const groupNames:Record<FeedGroup,string>={nailong:'奶龙／奶蛙',lulu:'噜噜',huge:'虎哥',kobe:'科比'};
export const groupLabels:Record<FeedGroup,string>={nailong:'重度奶龙用户',lulu:'噜噜资深粉',huge:'虎哥资深粉',kobe:'man巴out'};
export interface FeedClip {id:string;title:string;mp4:string;webm:string;track?:string;whiteGloves?:boolean;group?:FeedGroup;caption?:string;}
export const feedClips:FeedClip[]=[
 {id:'qinghai',title:'青海摇',mp4:'media/qinghai-original.mp4',webm:'media/qinghai-original.webm',track:'media/qinghai-track.json',whiteGloves:true},
 {id:'blue-run',title:'蓝色妖姬跑步',mp4:'media/blue-run.mp4',webm:'media/blue-run.webm',track:'media/blue-run-track.json'},
 {id:'social-dance',title:'社会摇',mp4:'media/social-dance.mp4',webm:'media/social-dance.webm',track:'media/social-dance-track.json'},
 {id:'disney',title:'我要迪士尼',mp4:'media/disney.mp4',webm:'media/disney.webm',track:'media/disney-track.json'},
 {id:'caoxian',title:'山东菏泽曹县',mp4:'media/caoxian.mp4',webm:'media/caoxian.webm',track:'media/caoxian-track.json'},
 {id:'retreat',title:'退！退！退！',mp4:'media/retreat.mp4',webm:'media/retreat.webm',track:'media/retreat-track.json'}
];
export const groupedClips:Record<FeedGroup,readonly FeedClip[]>={
 kobe:Array.from({length:7},(_,i)=>{const id=`kobe-${String(i+1).padStart(2,'0')}`;return {id,title:`科比 · ${String(i+1).padStart(2,'0')}`,mp4:`media/${id}.mp4`,webm:`media/${id}.webm`,group:'kobe',caption:'科比视频合集。 #科比'};}),
 huge:Array.from({length:7},(_,i)=>{const id=`huge-${String(i+1).padStart(2,'0')}`;return {id,title:`虎哥 · ${String(i+1).padStart(2,'0')}`,mp4:`media/${id}.mp4`,webm:`media/${id}.webm`,group:'huge',caption:'虎哥来了。 #虎哥'};}),
 "nailong": [
  {
   "id": "nailong-01",
   "title": "奶龙 · 01",
   "mp4": "media/nailong-01.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-01.webm"
  },
  {
   "id": "nailong-02",
   "title": "奶龙 · 02",
   "mp4": "media/nailong-02.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-02.webm"
  },
  {
   "id": "nailong-03",
   "title": "奶龙 · 03",
   "mp4": "media/nailong-03.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-03.webm"
  },
  {
   "id": "nailong-04",
   "title": "奶龙 · 04",
   "mp4": "media/nailong-04.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-04.webm"
  },
  {
   "id": "nailong-05",
   "title": "奶龙 · 05",
   "mp4": "media/nailong-05.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-05.webm"
  },
  {
   "id": "nailong-06",
   "title": "奶龙 · 06",
   "mp4": "media/nailong-06.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-06.webm"
  },
  {
   "id": "nailong-07",
   "title": "奶蛙 · 01",
   "mp4": "media/nailong-07.mp4",
   "group": "nailong",
   "caption": "奶龙和奶蛙，一条接一条。 #奶龙 #奶蛙",
   "webm": "media/nailong-07.webm"
  }
 ],
 "lulu": [
  {
   "id": "lulu-01",
   "title": "噜噜 · 01",
   "mp4": "media/lulu-01.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-01.webm"
  },
  {
   "id": "lulu-02",
   "title": "噜噜 · 02",
   "mp4": "media/lulu-02.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-02.webm"
  },
  {
   "id": "lulu-03",
   "title": "噜噜 · 03",
   "mp4": "media/lulu-03.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-03.webm"
  },
  {
   "id": "lulu-04",
   "title": "噜噜 · 04",
   "mp4": "media/lulu-04.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-04.webm"
  },
  {
   "id": "lulu-05",
   "title": "噜噜 · 05",
   "mp4": "media/lulu-05.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-05.webm"
  },
  {
   "id": "lulu-06",
   "title": "噜噜 · 06",
   "mp4": "media/lulu-06.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-06.webm"
  },
  {
   "id": "lulu-07",
   "title": "噜噜 · 07",
   "mp4": "media/lulu-07.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-07.webm"
  },
  {
   "id": "lulu-08",
   "title": "噜噜 · 08",
   "mp4": "media/lulu-08.mp4",
   "group": "lulu",
   "caption": "今天的推荐，只有噜噜。 #噜噜",
   "webm": "media/lulu-08.webm"
  }
 ]
};
export function feedFor(group:FeedGroup|null):readonly FeedClip[]{return group?groupedClips[group]:feedClips;}
export function clipAt(index:number,clips:readonly FeedClip[]=feedClips){return clips[((index%clips.length)+clips.length)%clips.length];}