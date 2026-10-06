
import {memeById,type MemeEffect} from './memes';
export interface FaceSignal {x:number;y:number;width:number;height:number;smile:number;mouth:number;tilt:number;}
export type MemeImages=Partial<Record<'dance'|'host'|'food'|'room'|'street'|'stage'|'dino',HTMLImageElement>>;
interface Input {ctx:CanvasRenderingContext2D;source:HTMLVideoElement|HTMLImageElement;face:FaceSignal;images:MemeImages;effect:MemeEffect;width:number;height:number;time:number;index:number;mirror:boolean;reduced:boolean;}
export function paintMeme({ctx,source,face,images,effect,width:w,height:h,time,index,mirror,reduced}:Input){
 const post=memeById(effect),v=post.variant,t=reduced?0:(time/1000)%post.duration,s=w/390;
 const sw=source instanceof HTMLVideoElement?source.videoWidth:source.naturalWidth,sh=source instanceof HTMLVideoElement?source.videoHeight:source.naturalHeight;
 if(!sw||!sh)return;
 const ready=(id:keyof MemeImages)=>{const im=images[id];return im?.complete&&im.naturalWidth?im:null;};
 const scene=['dragon','mc','food','buy','caoxian'].includes(post.kind)?'stage':['pan','blue','disney','retreat','ghost'].includes(post.kind)?'street':'room';
 ctx.fillStyle='#101013';ctx.fillRect(0,0,w,h);
 const bg=ready(scene);
 if(bg){const scale=Math.max(w/bg.naturalWidth,h/bg.naturalHeight),zoom=1+(reduced?0:Math.sin(t*.8)*.012);ctx.save();ctx.translate(w/2,h/2);ctx.scale(zoom,zoom);ctx.drawImage(bg,-bg.naturalWidth*scale/2,-bg.naturalHeight*scale/2,bg.naturalWidth*scale,bg.naturalHeight*scale);ctx.restore();}
 else {ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='12px monospace';ctx.fillText(images[scene]?.complete?'Scene unavailable':'Tuning the bootleg signal…',w/2,h*.5);return;}
 const faceAt=(cx:number,cy:number,fw:number,fh:number,angle=0,warp=0,opacity=1)=>{
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=opacity;
  ctx.beginPath();ctx.ellipse(0,0,fw/2,fh/2,0,0,Math.PI*2);ctx.clip();if(mirror)ctx.scale(-1,1);
  // A strip mesh remaps the entire face, rather than floating a second mouth over it.
  const rows=32,sy=face.y*sh,sx=face.x*sw;
  for(let i=0;i<rows;i++){const u=i/rows,mouth=Math.exp(-Math.pow((u-.75)/.14,2)),eye=Math.exp(-Math.pow((u-.37)/.12,2));
   const stretch=1+warp*(mouth*.42-eye*.09),shift=warp*mouth*fw*.045;
   ctx.drawImage(source,sx,sy+i*face.height*sh/rows,face.width*sw,face.height*sh/rows+.5,-fw*stretch/2+shift,-fh/2+i*fh/rows,fw*stretch,fh/rows+.7);
  }ctx.restore();
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=opacity;ctx.strokeStyle='#eee9df';ctx.lineWidth=3*s;ctx.beginPath();ctx.ellipse(0,0,fw/2,fh/2,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 };
 const person=(id:'dance'|'host'|'food',cx:number,cy:number,scale:number,angle=0,warp=0,opacity=1)=>{
  const im=ready(id);if(!im)return;
  const dw=w*scale,dh=dw*im.naturalHeight/im.naturalWidth;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=opacity;
  // Two phase-shifted lower-body strips provide footwork without scaling the head.
  if(id==='dance'&&!reduced&&['social','qinghai','disco','shadow'].includes(post.kind)){
   const split=im.naturalHeight*.64;ctx.drawImage(im,0,0,im.naturalWidth,split,-dw/2,-dh/2,dw,dh*.64);
   for(let i=0;i<2;i++){const step=Math.sin(t*(post.kind==='qinghai'?8:5)+i*Math.PI)*dw*.018;ctx.drawImage(im,i*im.naturalWidth/2,split,im.naturalWidth/2,im.naturalHeight-split,-dw/2+i*dw/2+step,-dh/2+dh*.64,dw/2,dh*.36);}
  }else ctx.drawImage(im,-dw/2,-dh/2,dw,dh);
  const anchor=id==='dance'?[.505,.125,.31,.235]:id==='food'?[.48,.225,.38,.30]:[.5,.20,.38,.32];
  faceAt(-dw/2+dw*anchor[0],-dh/2+dh*anchor[1],dw*anchor[2],dh*anchor[3],face.tilt*.4,warp,opacity);ctx.restore();
 };
 const stamp=(text:string,x:number,y:number,size:number,color='#fff',angle=0)=>{
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.textAlign='center';ctx.font='900 '+size*s+'px sans-serif';ctx.lineJoin='round';ctx.lineWidth=5*s;ctx.strokeStyle='#080808';ctx.strokeText(text,0,0);ctx.fillStyle=color;ctx.fillText(text,0,0);ctx.restore();
 };
 const sway=Math.sin(t*4)*.055+face.tilt*.28,bounce=reduced?0:Math.abs(Math.sin(t*5))*h*.008;
 const active=1+face.mouth*2,mainX=w*.48,mainY=h*.53;
 switch(post.kind){
 case 'shadow':
 case 'social':
 case 'qinghai':
 case 'disco':{
  const tempo=post.kind==='qinghai'?7:post.kind==='disco'?3:5;
  if(v===1){person('dance',mainX+Math.sin(t*tempo)*w*.12,mainY,.98,sway,face.mouth*.8);}
  else{person('dance',w*.19+Math.sin(t*tempo-.4)*w*.04,mainY+h*.02,.66,-sway,.5,.9);person('dance',w*.81+Math.sin(t*tempo+.4)*w*.04,mainY+h*.02,.66,sway,.5,.9);person('dance',mainX+Math.sin(t*tempo)*w*.02,mainY-bounce,.96,sway,face.mouth*.8);}
  if(v===2)for(let i=0;i<3;i++)faceAt(w*(.18+i*.31),h*.25+Math.sin(t*4+i)*h*.03,w*.20,h*.13,Math.sin(t+i)*.1,active,.6);
  break;
 }
 case 'pan':{
  const entrance=reduced?1:Math.min(1,t/2.2),ease=1-Math.pow(1-entrance,3);
  person('dance',w*(-.35+ease*.83),mainY,1,-.24*(1-ease)+face.tilt*.4,v===2?1:0);
  if(v===1&&t>2.5)person('dance',w*(.15+Math.sin(t*2)*.1),mainY+.03*h,.65,-.2,.3,.75);
  stamp(t<2.2?'有请…':'登场！',w*.44,h*.70,27,'#fcf6c6',-.08);break;
 }
 case 'blue':
  person('dance',mainX+Math.sin(t*(v===1?6:2))*w*.08,mainY-bounce,1.03,sway,v===2?active:face.smile);
  if(v===2)person('dance',w*.83,mainY+h*.05,.65,-sway,1,.55);
  stamp('YELLOW SHOES / BLUE SIGNAL',w*.47,h*.72,14,'#fff01f',-.04);break;
 case 'food':
  person('food',mainX,mainY,.99,Math.sin(t*3)*.025,face.mouth*(1+v));
  if(v===1){faceAt(w*.21,h*.40,w*.19,h*.13,-.12,face.mouth,.8);faceAt(w*.78,h*.43,w*.19,h*.13,.12,face.mouth,.8);}
  stamp(face.mouth>.17?'浇给！':'汁子就位',w*.48,h*.69,28,'#ffc477',-.055);break;
 case 'mc':
 case 'buy':
 case 'caoxian':
 case 'disney':
 case 'ghost':
 case 'dragon':{
  const warp=post.kind==='dragon'?face.smile*1.8+v*.35:post.kind==='ghost'?active:face.mouth*(1+v*.5);
  person('host',mainX,mainY-bounce,1.08,Math.sin(t*3)*.035+face.tilt*.25,warp);
  if(v===1)faceAt(w*.82,h*.35,w*.24,h*.17,sway,warp,.65);
  if(v===2){faceAt(w*.18,h*.34,w*.26,h*.17,-sway,warp,.7);faceAt(w*.82,h*.40,w*.26,h*.17,sway,warp,.7);}
  if(post.kind==='buy'){
   const count=v+1+Math.floor(face.mouth*4);
   for(let i=0;i<Math.min(count,5);i++){const x=w*(.07+(i%2)*.55),y=h*(.28+Math.floor(i/2)*.13);ctx.fillStyle='#fcf1d4';ctx.fillRect(x,y,w*.35,h*.08);ctx.fillStyle='#ff2357';ctx.fillRect(x,y,w*.35,17*s);ctx.fillStyle='#111';ctx.font='bold '+(11*s)+'px monospace';ctx.textAlign='left';ctx.fillText('BUY.NOW.exe',x+5*s,y+12*s);ctx.fillText('FAKE SALE: -999%',x+5*s,y+38*s);}
  }
  if(post.kind==='disney')stamp(Math.sin(t*2+face.tilt*4)>0?'DISS YOU':'DISNEY?',w*.49,h*.69,34,'#bcff22',-.05);
  if(post.kind==='dragon')stamp(face.smile>.22?'龙王归来':'嘴角等待中',w*.46,h*.71,28,'#ffdc71',-.055);
  break;
 }
 case 'dino':{
  const im=ready('dino');if(!im)break;
  const count=v===1?1:2;
  for(let i=0;i<count;i++){const scale=count===1?.95:.68,dw=w*scale,dh=dw*im.naturalHeight/im.naturalWidth,cx=count===1?mainX:w*(.28+i*.44),cy=mainY+(i?bounce:-bounce);
   ctx.save();ctx.translate(cx,cy);ctx.rotate(sway*(i?-1:1));ctx.drawImage(im,-dw/2,-dh/2,dw,dh);faceAt(0,-dh/2+dh*.27,dw*.28,dh*.22,0,v===2?active:0);ctx.restore();}
  stamp(Math.sin(t*2)>0?'我是奶龙':'我才是！',mainX,h*.71,29,'#ffe82e',-.03);break;
 }
 case 'retreat':
  person('host',mainX,mainY,1.02,sway,face.mouth*.9);
  for(let i=0;i<5;i++){const angle=i*Math.PI*2/5+.4,r=w*(.18+((t*.55+i*.21)%1)*(face.mouth+.1)*1.8);faceAt(mainX+Math.cos(angle)*r,h*.43+Math.sin(angle)*r,w*.14,h*.09,angle*.12,v*.3,.85);}
  stamp(face.mouth>.18?'退！退！退！':'又推回来了',mainX,h*.72,30,'#ccff28',-.06);break;
 case 'mahi':
  if(v!==1)for(let i=0;i<3;i++)faceAt(w*(.18+i*.32),h*.27+Math.sin(t*5+i)*h*.03,w*.25,h*.15,Math.sin(t*3+i)*.14,1.5,.7);
  faceAt(mainX,h*.46,w*.79,h*.38,Math.sin(t*4)*.08+face.tilt*.2,1+face.mouth*2+Math.sin(t*7)*.6);
  if(v===2)stamp('嘴巴单飞 / FACE.EXE',mainX,h*.70,23,'#fe93dc',-.06);break;
 }
 // Deterministic intermittent tape tearing, not full-screen strobing.
 if(!reduced){const pulse=Math.floor(t*8);
  if(pulse%9===0||v===2&&pulse%7===0){const y=h*(.28+(pulse%5)*.10),d=ctx.canvas.width/w;ctx.drawImage(ctx.canvas,0,y*d,w*d,7*s*d,(pulse%2?12:-12)*s,y,w,7*s);}
  ctx.save();ctx.globalAlpha=.14;for(let i=0;i<6;i++){const y=(i*139+pulse*17)%h;ctx.fillStyle=i%2?'#fc2768':'#33ffde';ctx.fillRect((pulse*29+i*61)%w,y,25*s,2*s);}ctx.restore();
 }
 ctx.save();ctx.globalAlpha=.08;ctx.fillStyle='#fff';for(let y=0;y<h;y+=4*s)ctx.fillRect(0,y,w,.6*s);ctx.restore();
 ctx.fillStyle='#000a';ctx.fillRect(0,h*.82,w,h*.18);
 if(index>=48)stamp('RECOMMENDED: YOU AGAIN',mainX,h*.18,11,'#c5ff24');
}
