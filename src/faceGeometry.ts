export interface Point {x:number;y:number;z?:number;}
export function coverPoint(p:Point,sourceWidth:number,sourceHeight:number,width:number,height:number,mirror=true){
 const scale=Math.max(width/sourceWidth,height/sourceHeight);const x=p.x*sourceWidth*scale-(sourceWidth*scale-width)/2;
 return {x:mirror?width-x:x,y:p.y*sourceHeight*scale-(sourceHeight*scale-height)/2};
}
