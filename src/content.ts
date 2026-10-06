
export type IdentityId = 'soft' | 'tech' | 'culture';
export interface Post {title:string;subtitle:string;caption:string;motif:string;comments:string[];}
export interface Identity {id:IdentityId;name:string;number:string;color:string;tags:string[];}
export const identities:Identity[]=[
 {id:'soft',name:'CAT PERSON',number:'01',color:'#53f5ed',tags:['Cats','Tiny bodies','Big feelings','One more cat']},
 {id:'tech',name:'MAIN CHARACTER',number:'02',color:'#b7ff66',tags:['Clones','Dragon lord','Drama','Absolutely normal']},
 {id:'culture',name:'CERTIFIED WEIRDO',number:'03',color:'#ff9ece',tags:['AI creatures','Ducks','Plot twists','No context']}
];
export const demoPortrait=`${import.meta.env.BASE_URL}media/demo-portrait.jpg`;
