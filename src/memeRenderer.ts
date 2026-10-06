
import type {MemeEffect} from './memes';
export interface FaceSignal {x:number;y:number;width:number;height:number;smile:number;mouth:number;tilt:number;}
export type MemeImages=Partial<Record<'cat'|'hood'|'dino'|'hybrid'|'duck',HTMLImageElement>>;
interface Input {ctx:CanvasRenderingContext2D;source:HTMLVideoElement|HTMLImageElement;face:FaceSignal;images:MemeImages;effect:MemeEffect;width:number;height:number;time:number;index:number;mirror:boolean;reduced:boolean;}
export function paintMeme({ctx,source,face,images,effect,width:w,height:h,time,index,mirror,reduced}:Input){
 const t=reduced?0:time/1000,s=w/720;
 const sw=source instanceof HTMLVideoElement?source.videoWidth:source.naturalWidth;
 const sh=source instanceof HTMLVideoElement?source.videoHeight:source.naturalHeight;
 if(!sw||!sh)return;
 const palette:Record<MemeEffect,[string,string]>={shadow:['#1b1233','#382377'],dragon:['#241104','#805615'],cat:['#183536','#0a1517'],hood:['#a7b6ad','#526561'],dino:['#49362b','#d8b947'],hybrid:['#102d46','#050c15'],duck:['#252329','#692c1e'],mahi:['#371842','#b73273'],retreat:['#213038','#081921']};
 const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,palette[effect][0]);bg.addColorStop(1,palette[effect][1]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.globalAlpha=.07;ctx.strokeStyle='#fff';ctx.lineWidth=s;
 for(let y=0;y<h;y+=28*s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}ctx.restore();
 const faceAt=(cx:number,cy:number,fw:number,fh:number,angle=0,opacity=1)=>{
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=opacity;ctx.beginPath();ctx.ellipse(0,0,fw/2,fh/2,0,0,Math.PI*2);ctx.clip();if(mirror)ctx.scale(-1,1);
  ctx.drawImage(source,face.x*sw,face.y*sh,face.width*sw,face.height*sh,-fw/2,-fh/2,fw,fh);ctx.restore();
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=2*s;ctx.beginPath();ctx.ellipse(0,0,fw/2,fh/2,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 };
 const word=(text:string,x:number,y:number,size:number,color='#fff',angle=0)=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.textAlign='center';ctx.font='900 '+size*s+'px "DM Sans",sans-serif';ctx.lineJoin='round';ctx.lineWidth=8*s;ctx.strokeStyle='#090909';ctx.strokeText(text,0,0);ctx.fillStyle=color;ctx.fillText(text,0,0);ctx.restore();
 };
 const sprite=(id:keyof MemeImages,cx:number,cy:number,scale:number,angle:number,anchor:[number,number,number,number],behind=false)=>{
  const image=images[id];if(!image?.complete||!image.naturalWidth){word(image?.complete?'Meme image unavailable':'Loading creature…',w/2,h*.5,23);return;}
  const dw=w*scale,dh=dw*image.naturalHeight/image.naturalWidth;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);const x=-dw/2,y=-dh/2;
  const drawFace=()=>faceAt(x+dw*anchor[0],y+dh*anchor[1],dw*anchor[2],dh*anchor[3],face.tilt*.55);
  if(behind)drawFace();ctx.drawImage(image,x,y,dw,dh);if(!behind)drawFace();ctx.restore();
 };
 const sway=Math.sin(t*3)*.035+face.tilt*.2,bounce=Math.abs(Math.sin(t*4))*h*.012;
 if(effect==='shadow'){
  for(const [i,cx] of [[0,w*.2],[1,w*.8],[2,w*.5]]){
   const lag=t-i*.23;const y=h*.49+Math.sin(lag*4)*h*.024;
   faceAt(cx+Math.sin(lag*3)*w*.025,y,w*(i===2?.48:.34),h*(i===2?.29:.22),Math.sin(lag*3)*.09+face.tilt);
  }
  word('ME  /  ME  /  ME',w*.48,h*.72,35,'#89ffda',-.045);
 }else if(effect==='dragon'){
  const zoom=1+face.smile*.16,cx=w*.48,cy=h*.47,fw=w*.68*zoom,fh=h*.33*zoom;
  faceAt(cx,cy,fw,fh,face.tilt*.5);
  const mx=face.x+face.width*.28,my=face.y+face.height*.66,mw=face.width*.48,mh=face.height*.2;
  ctx.save();ctx.translate(cx+fw*.07,cy+fh*.23-face.smile*fh*.05);ctx.rotate(-face.smile*.21);if(mirror)ctx.scale(-1,1);ctx.beginPath();ctx.ellipse(0,0,fw*.22*(1+face.smile*.7),fh*.075,0,0,Math.PI*2);ctx.clip();ctx.drawImage(source,mx*sw,my*sh,mw*sw,mh*sh,-fw*.22*(1+face.smile*.7),-fh*.075,fw*.44*(1+face.smile*.7),fh*.15);ctx.restore();
  word(face.smile>.2?'DRAGON LORD':'WAIT FOR THE SMIRK',w*.47,h*.71,face.smile>.2?43:26,'#ffdb76',-.055);
 }else if(effect==='cat'){
  sprite('cat',w*.48,h*.48-bounce,.9,sway,[.50,.27,.30,.22]);
  word(face.mouth>.15?'AAAAAAAA':'HUH?',w*.48,h*.70,55,'#fff',Math.sin(t)*.035);
 }else if(effect==='hood'){
  const size=.83+Math.max(0,face.width-.28)*.45;
  sprite('hood',w*.47,h*.49-bounce,size,sway,[.50,.37,.36,.30],true);
  word('VERY LOYAL.',w*.46,h*.72,34,'#fff',-.04);
 }else if(effect==='dino'){
  sprite('dino',w*.30,h*.51-bounce,.65,-sway,[.5,.27,.28,.22]);
  sprite('dino',w*.70,h*.51+bounce,.65,sway,[.5,.27,.28,.22]);
  word(Math.sin(t*1.7)>0?'NO. ME.':'I AM THE DINO.',w*.47,h*.73,38,'#ffe25b',-.045);
 }else if(effect==='hybrid'){
  sprite('hybrid',w*.47,h*.5-bounce,.9,sway,[.51,.27,.30,.22]);
  const names=['SHARKALOO YOU-YOU','SNEAKERUS MAXIMUS','THREE-FOOTED YOU','BRO HAS EVOLVED'];
  word(names[index%names.length],w*.47,h*.72,25,'#bafff3',-.03);
 }else if(effect==='duck'){
  sprite('duck',w*.48,h*.53-bounce,.94,sway,[.5,.18,.23,.17]);
  ctx.save();ctx.globalAlpha=.1;ctx.fillStyle='#ffe8ce';for(let i=0;i<20;i++)ctx.fillRect((i*83+Math.sin(t+i)*20)%w,(i*137+t*18)%h,2*s,4*s);ctx.restore();
  word('I WAS THE DUCK.',w*.47,h*.72,37,'#ffe1ac',-.04);
 }else if(effect==='mahi'){
  for(let i=0;i<4;i++)faceAt(w*(.14+i*.23),h*.3+Math.sin(t*5+i)*h*.03,w*.24,h*.14,Math.sin(t*4+i)*.18,.65);
  faceAt(w*.48,h*.52,w*(.65+Math.sin(t*7)*.045),h*(.29+Math.cos(t*7)*.025),Math.sin(t*3)*.08);
  word('FACE ON TOUR',w*.48,h*.73,38,'#ffb7e2',-.03);
 }else{
  faceAt(w*.49,h*.47,w*.55,h*.30,face.tilt);
  const force=Math.max(.1,face.mouth)*2.8;
  for(let i=0;i<5;i++){const angle=i*Math.PI*2/5+t*.4,r=w*(.25+((t*.5+i*.23)%1)*force);faceAt(w*.49+Math.cos(angle)*r,h*.47+Math.sin(angle)*r,w*.12,h*.08,angle,.85);}
  word(face.mouth>.15?'退！退！退！':'OPEN YOUR MOUTH',w*.47,h*.71,face.mouth>.15?44:27,'#b7ff66',-.045);
 }
 if(index>8){ctx.save();ctx.globalAlpha=Math.min(.12,(index-8)*.006);ctx.fillStyle='#ff2860';for(let i=0;i<4;i++){const y=(i*193+Math.floor(t*3)*47)%h;ctx.fillRect(0,y,w,2*s);}ctx.restore();}
}
