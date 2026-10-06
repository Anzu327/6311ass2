
export type IdentityId = 'soft' | 'tech' | 'culture';
export interface Identity {id:IdentityId;name:string;number:string;color:string;tags:string[];}
export const identities:Identity[]=[
 {id:'soft',name:'MEME CONSUMER',number:'01',color:'#53f5ed',tags:['Reactions','Shopping','Recommendations']},
 {id:'tech',name:'MAIN CHARACTER',number:'02',color:'#b7ff66',tags:['Performance','Confidence','Drama']},
 {id:'culture',name:'CERTIFIED WEIRDO',number:'03',color:'#ff9ece',tags:['Dance','Misheard rap','Chants','No context']}
];
export const demoPortrait=`${import.meta.env.BASE_URL}media/demo-portrait.jpg`;
