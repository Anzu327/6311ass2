export interface Point {x:number;y:number;z?:number;}
export type HeadFrame=[number,number,number,number,number];
export interface HeadTrack {fps:number;width:number;height:number;frames:HeadFrame[];}
export function containBox(sw:number,sh:number,w:number,h:number){
 const scale=Math.min(w/sw,h/sh);return {scale,x:(w-sw*scale)/2,y:(h-sh*scale)/2};
}
export function sampleHead(track:HeadTrack,time:number):HeadFrame{
 const at=Math.max(0,Math.min(track.frames.length-1,time*track.fps)),i=Math.floor(at),a=track.frames[i],b=track.frames[Math.min(i+1,track.frames.length-1)],t=at-i;
 return a.map((n,j)=>n+(b[j]-n)*t) as HeadFrame;
}
export function headCrop(face:Point[],w:number,h:number){
 const left=Math.min(face[234].x,face[454].x)*w,right=Math.max(face[234].x,face[454].x)*w;
 const chin={x:face[152].x*w,y:face[152].y*h},forehead=face[10].y*h,fw=right-left,fh=chin.y-forehead;
 if(fw<15||fh<20)return null;
 const x=Math.max(0,left-fw*.18),y=Math.max(0,forehead-fh*.62),endX=Math.min(w,right+fw*.18),endY=Math.min(h,chin.y+fh*.10);
 return {x,y,width:endX-x,height:endY-y,chin,angle:Math.atan2((face[263].y-face[33].y)*h,(face[263].x-face[33].x)*w)};
}
export function isHeadCategory(category:number){return category===1||category===2||category===3||category===5;}
export function validHeadTrack(value:unknown):value is HeadTrack{
 const t=value as HeadTrack|null;return !!t&&t.fps>0&&t.width>0&&t.height>0&&Array.isArray(t.frames)&&t.frames.length>1&&t.frames.every(r=>Array.isArray(r)&&r.length===5&&r.every(Number.isFinite)&&r[2]>0&&r[3]>0);
}

export function mosaicCrop(frame:HeadFrame,width:number,height:number){
 const [x,y,w,h]=frame,left=Math.max(0,Math.floor(x-w*.24)),top=Math.max(0,Math.floor(y-h*.40));
 const right=Math.min(width,Math.ceil(x+w*1.24)),bottom=Math.min(height,Math.ceil(y+h*1.10));
 return {x:left,y:top,width:right-left,height:bottom-top};
}
