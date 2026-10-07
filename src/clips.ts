export interface FeedClip {id:string;title:string;mp4:string;webm:string;track:string;whiteGloves?:boolean;}
export const feedClips:FeedClip[]=[
 {id:'qinghai',title:'青海摇',mp4:'media/qinghai-original.mp4',webm:'media/qinghai-original.webm',track:'media/qinghai-track.json',whiteGloves:true},
 {id:'blue-run',title:'蓝色妖姬跑步',mp4:'media/blue-run.mp4',webm:'media/blue-run.webm',track:'media/blue-run-track.json'},
 {id:'social-dance',title:'社会摇',mp4:'media/social-dance.mp4',webm:'media/social-dance.webm',track:'media/social-dance-track.json'},
 {id:'disney',title:'我要迪士尼',mp4:'media/disney.mp4',webm:'media/disney.webm',track:'media/disney-track.json'},
 {id:'caoxian',title:'山东菏泽曹县',mp4:'media/caoxian.mp4',webm:'media/caoxian.webm',track:'media/caoxian-track.json'},
 {id:'retreat',title:'退！退！退！',mp4:'media/retreat.mp4',webm:'media/retreat.webm',track:'media/retreat-track.json'}
];
export function clipAt(index:number){return feedClips[((index%feedClips.length)+feedClips.length)%feedClips.length];}
