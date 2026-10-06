
import type {IdentityId,Post} from './content';
export type MemeEffect='shadow'|'dragon'|'cat'|'hood'|'dino'|'hybrid'|'duck'|'mahi'|'retreat';
export interface MemePost extends Post {id:MemeEffect;category:IdentityId;name:string;instruction:string;year:string;voice:string;}
export type Interests=Record<IdentityId,number>;
export const freshInterests=():Interests=>({soft:0,tech:0,culture:0});
export const memes:MemePost[]=[
 {id:'shadow',category:'tech',name:'SHADOW CLONE',year:'2019',title:'One you was not enough.',subtitle:'影流之主',instruction:'Move your head. Your clones are late.',caption:'Three of me. Still zero coordination. #shadowclone #影流之主',motif:'CLONE',comments:['The third one missed the rehearsal.','Why do I recognize this immediately?','Bro multiplied the problem.'],voice:'分身，还是不会跳。'},
 {id:'cat',category:'soft',name:'CAT MEME',year:'2024',title:'You are the cat now.',subtitle:'猫 meme',instruction:'Open your mouth. Make it everybody’s problem.',caption:'My last two brain cells made this. #catmeme #meme',motif:'CAT',comments:['Huh?','This is my entire personality now.','The algorithm sent another cat.'],voice:'啊？怎么又是猫。'},
 {id:'dragon',category:'tech',name:'DRAGON LORD',year:'2020',title:'Your villain era.',subtitle:'歪嘴战神',instruction:'Smile. Let the corner of your mouth do the acting.',caption:'Three years of waiting. One extremely unnecessary reveal. #dragonlord #歪嘴战神',motif:'LORD',comments:['The mouth has its own storyline.','He owns this comment section.','Most normal short-drama advertisement.'],voice:'三年之期已到，龙王归来。'},
 {id:'hood',category:'soft',name:'HOODIE INCIDENT',year:'2024',title:'The hoodie chose you.',subtitle:'我有一个帽衫',instruction:'Lean closer. The hood has room for more ears.',caption:'Ordered a hoodie. Received a new species. #hoodie #帽衫',motif:'HOOD',comments:['Very loyal-looking.','Why is the hood taller than me?','The ears are a paid upgrade.'],voice:'我有一个帽衫。'},
 {id:'hybrid',category:'culture',name:'AI BESTIARY',year:'2025',title:'New species just dropped.',subtitle:'AI 山海经',instruction:'Tilt your head. Evolution is getting worse.',caption:'Shark. Shoes. You. Science has left the chat. #brainrot #AI山海经',motif:'SPECIES',comments:['Scientists have been real quiet.','What is the food chain here?','I regret asking for personalized content.'],voice:'新物种，正在离谱进化。'},
 {id:'mahi',category:'tech',name:'FACE KARAOKE',year:'2021',title:'Your face has a gig.',subtitle:'蚂蚁呀嘿式五官摇',instruction:'Your mouth is on tour. You are not invited.',caption:'No singing ability. Plenty of facial enthusiasm. #facekaraoke #鬼畜',motif:'SING',comments:['My mouth signed a solo contract.','The eyes are the backup dancers.','Why am I still watching this?'],voice:'你的嘴，有它自己的想法。'},
 {id:'duck',category:'culture',name:'DUCK REVENGE',year:'2026',title:'The duck remembers.',subtitle:'雪山救狐狸／酱板鸭',instruction:'Raise your eyebrows. Cue the dramatic reveal.',caption:'Thought I was the hero. Turns out I am the side dish. #plotTwist #酱板鸭',motif:'DUCK',comments:['That is the duck, not the fox.','Even the background prop has a revenge arc.','The plot is fully cooked.'],voice:'我不是狐狸，我是那只酱板鸭。'},
 {id:'dino',category:'soft',name:'YELLOW DINO',year:'2024',title:'No, I am the dinosaur.',subtitle:'奶龙式身份争夺',instruction:'Shake your head. A second you will disagree.',caption:'One face. Two suspiciously confident dinosaurs. #yellowdino #抽象',motif:'DINO',comments:['I am the dinosaur.','No. I am the dinosaur.','Who let both of them post?'],voice:'我是奶龙，我才是奶龙。'},
 {id:'retreat',category:'tech',name:'RETREAT MODE',year:'2022',title:'Personal space: activated.',subtitle:'退！退！退！',instruction:'Open your mouth to push the little you away.',caption:'A polite request, with absolutely no indoor voice. #retreat #退退退',motif:'BACK',comments:['The tiny me keeps coming back.','Professional boundary setting.','Volume was never the issue.'],voice:'退，退，退。'}
];
export const memeById=(id:string):MemePost=>memes.find(m=>m.id===id)||memes[0];
export function nextMeme(identity:IdentityId,index:number,scores:Interests,history:string[]):MemeEffect{
 const offset={soft:1,tech:0,culture:4}[identity];
 if(index<memes.length)return memes[(index+offset)%memes.length].id;
 const categories:IdentityId[]=['soft','tech','culture'];
 const weights=categories.map(c=>1+scores[c]*2);
 const total=weights.reduce((a,b)=>a+b,0);
 let ticket=(((index+1)*0.61803398875+offset*.137)%1)*total;
 let category=categories[2];
 for(let i=0;i<categories.length;i++){ticket-=weights[i];if(ticket<0){category=categories[i];break;}}
 let pool=memes.filter(m=>m.category===category&&!history.slice(-2).includes(m.id));
 if(!pool.length)pool=memes.filter(m=>m.category===category);
 return pool[(index+offset)%pool.length].id;
}
export function enclosure(scores:Interests):number{
 const values=Object.values(scores);const total=values.reduce((a,b)=>a+b,0);
 return total?Math.min(96,Math.round(Math.max(...values)/total*100)):0;
}
