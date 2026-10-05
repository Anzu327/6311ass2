export type IdentityId = 'soft' | 'tech' | 'culture';
export interface Post { title: string; subtitle: string; caption: string; motif: string; comments: string[]; }
export interface Identity {id:IdentityId;name:string;number:string;color:string;tags:string[];posts:Post[];}
const posts = (items: [string,string,string,string][]):Post[] => items.map(([title,subtitle,caption,motif],i)=>({title,subtitle,caption,motif,comments:i<3?['This feels so familiar.','How did this end up on my feed?','The algorithm knows me too well.']:['I said I was not interested.','Why is every post the same?','Maybe this is who I am supposed to be.']}));
export const identities:Identity[] = [
 {id:'soft',name:'SOFT DREAMER',number:'01',color:'#53f5ed',tags:['Sensitivity','Creativity','Escape','Idealism'],posts:posts([
 ['Slow mornings.','A little room to breathe.','Your first recommendation: a quieter kind of life.','SLOW'],
 ['Romanticize everything.','Even your ordinary Tuesday.','Soft light. Soft music. Soft you.','DREAM'],
 ['Your quiet era.','Less noise. More of the same.','A curated world for the person we decided you are.','QUIET'],
 ['Buy a softer life.','Personalized comfort. $49.','Sponsored by your assigned identity. Fictional advertisement.','BUY'],
 ['SOFT. SOFT. SOFT.','There is nothing else to see.','Your feedback has been received. Your profile is unchanged.','SOFT'],
 ['Stay in your category.','You are so predictable.','A thousand possibilities. One recommended version of you.','YOU']])},
 {id:'tech',name:'TECH OPTIMIZER',number:'02',color:'#b7ff66',tags:['Efficiency','Control','Upgrade','Output'],posts:posts([
 ['A better setup.','Make space for your next idea.','A desk tour, selected for you before you chose anything.','SETUP'],
 ['Optimize your day.','Every minute should perform.','A routine for the identity we assigned you.','FOCUS'],
 ['Become the upgrade.','Your interests, pre-installed.','More productivity. Less possibility.','MORE'],
 ['Purchase your potential.','Premium self. $99 / month.','Sponsored by your assigned identity. Fictional advertisement.','BUY'],
 ['OUTPUT. OUTPUT. OUTPUT.','Rest is a system error.','Not interested? We have categorized that as interest.','WORK'],
 ['Stay in your category.','No version outside the system.','A thousand possibilities. One recommended version of you.','YOU']])},
 {id:'culture',name:'CULTURE CURATOR',number:'03',color:'#ff9ece',tags:['Taste','Nostalgia','Distinction','Curation'],posts:posts([
 ['A different perspective.','Found in the margins.','An art journal, chosen before you expressed an interest.','LOOK'],
 ['Good taste, on repeat.','The same obscure discoveries.','Everyone in your category is uniquely the same.','TASTE'],
 ['Curate yourself.','Become your collection.','We have narrowed your world to things that look like you.','EDIT'],
 ['Own your originality.','Limited identity. $79.','Sponsored by your assigned identity. Fictional advertisement.','BUY'],
 ['TASTE. TASTE. TASTE.','Difference, mass-produced.','Your objection is now part of your aesthetic.','SAME'],
 ['Stay in your category.','Nothing outside the frame.','A thousand possibilities. One recommended version of you.','YOU']])}
];
export const demoPortrait = `${import.meta.env.BASE_URL}media/demo-portrait.jpg`;
