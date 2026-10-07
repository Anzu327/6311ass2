import {useRef,useState,type ReactElement} from 'react';
import {X,CornersOut,CornersIn,Heart,HeartBreak,CaretDown,CaretUp,ImageSquare,At,Smiley,PaperPlaneTilt,MagnifyingGlass} from '@phosphor-icons/react';
export interface Item {id:string;name:string;avatar:string;text:string;meta:string;likes:number;replies?:Item[];image?:string;}
interface Props {title:string;count:number;items:Item[];onItemsChange:(items:Item[])=>void;onImageURL:(url:string)=>void;onClose:()=>void;onExpand:(expanded:boolean)=>void;onPost:()=>void;}
const base=import.meta.env.BASE_URL;
export const initialComments:Item[]=[
 {id:'panda',name:'今天也在摇',avatar:'avatar-panda.webp',text:'怎么刷着刷着，每个人都长成我了？',meta:'4小时前 · 湖北',likes:1961,replies:[
  {id:'panda-r1',name:'路过的晚霞',avatar:'avatar-sunset.webp',text:'动作还是那个动作，脸已经换了。',meta:'2小时前 · 广东',likes:59},
  {id:'panda-r2',name:'隔壁老猫',avatar:'avatar-cat.webp',text:'下一条也是你，平台很懂。',meta:'1小时前 · 浙江',likes:27},
  {id:'panda-r3',name:'今天也在摇',avatar:'avatar-panda.webp',text:'所以到底是我喜欢，还是它替我喜欢？',meta:'35分钟前 · 湖北',likes:12}
 ]},
 {id:'sunset',name:'路过的晚霞',avatar:'avatar-sunset.webp',text:'换了一个梗，还是同一张脸。',meta:'13分钟前 · 宁夏',likes:3,replies:[
  {id:'sunset-r1',name:'隔壁老猫',avatar:'avatar-cat.webp',text:'我已经刷回第一条了。',meta:'8分钟前 · 广西',likes:2}
 ]},
 {id:'cat',name:'隔壁老猫',avatar:'avatar-cat.webp',text:'你在刷视频，还是视频在刷你？',meta:'2小时前 · 广西',likes:59},
 {id:'meow',name:'只看一眼',avatar:'avatar-cat.webp',text:'说好最后一条，结果又划了一次。',meta:'30分钟前 · 江苏',likes:107}
];
export default function CommentsSheet({title,count,items,onItemsChange,onImageURL,onClose,onExpand,onPost}:Props){
 const [tab,setTab]=useState<'comments'|'analysis'>('comments'),[expanded,setExpanded]=useState(false),[opened,setOpened]=useState<Record<string,boolean>>({}),[liked,setLiked]=useState<Record<string,boolean>>({}),[disliked,setDisliked]=useState<Record<string,boolean>>({});
 const [draft,setDraft]=useState(''),[reply,setReply]=useState<string|null>(null),[attachment,setAttachment]=useState('');
 const input=useRef<HTMLInputElement>(null),file=useRef<HTMLInputElement>(null),dragStart=useRef<number|null>(null);
 const send=()=>{if(!draft.trim()&&!attachment)return;
  const item:Item={id:'local-'+Date.now(),name:'我',avatar:'avatar-panda.webp',text:draft.trim(),meta:'刚刚 · 当前设备',likes:0,image:attachment||undefined};
  onItemsChange(reply?items.map(c=>c.id===reply?{...c,replies:[...(c.replies??[]),item]}:c):[item,...items]);
  if(reply)setOpened(old=>({...old,[reply]:true}));setDraft('');setAttachment('');setReply(null);setTab('comments');onPost();
 };
 const chooseImage=(selected:File|undefined)=>{if(!selected||!selected.type.startsWith('image/'))return;const url=URL.createObjectURL(selected);onImageURL(url);setAttachment(url);};
 const row=(item:Item,nested=false,parentId?:string):ReactElement=><article key={item.id} className={'comment-row '+(nested?'nested':'')}>
  <img className="comment-avatar" src={base+'media/'+item.avatar} alt=""/>
  <div className="comment-main"><div className="comment-name">{item.name}</div><p className="comment-text">{item.text}</p>{item.image&&<img className="comment-image" src={item.image} alt="本地添加的评论图片"/>}
   <div className="comment-meta"><span>{item.meta}</span><button onClick={()=>{setReply(nested?(parentId??null):item.id);setDraft('@'+item.name+' ');input.current?.focus();}}>回复</button><span className="comment-votes"><button aria-label={'赞同'+item.name+'的评论'} className={liked[item.id]?'active':''} onClick={()=>setLiked(old=>({...old,[item.id]:!old[item.id]}))}><Heart size={17} weight={liked[item.id]?'fill':'regular'}/>{item.likes+(liked[item.id]?1:0)}</button><button aria-label={'不赞同'+item.name+'的评论'} className={disliked[item.id]?'active':''} onClick={()=>setDisliked(old=>({...old,[item.id]:!old[item.id]}))}><HeartBreak size={17}/></button></span></div>
   {item.replies&&item.replies.length>0&&!nested&&<><button className="reply-expand" onClick={()=>setOpened(old=>({...old,[item.id]:!old[item.id]}))}><span className="reply-line"/>{opened[item.id]?'收起':`展开 ${item.replies.length} 条回复`}{opened[item.id]?<CaretUp size={13}/>:<CaretDown size={13}/>}</button>{opened[item.id]&&<div className="reply-list">{item.replies.map(r=>row(r,true,item.id))}</div>}</>}
  </div>
 </article>;
 return <section className={'comments-sheet '+(expanded?'expanded':'')} role="dialog" aria-modal="true" aria-label="评论区" onTouchStart={e=>{if((e.target as Element).closest('.comments-heading'))dragStart.current=e.touches[0].clientY;}} onTouchEnd={e=>{if(dragStart.current!==null&&e.changedTouches[0].clientY-dragStart.current>70)onClose();dragStart.current=null;}}>
  <header className="comments-heading"><div className="comments-hot"><span>大家都在搜：</span><button onClick={()=>{setTab('analysis');}}>{title}为什么停不下来<MagnifyingGlass size={11}/></button></div><div className="sheet-tools"><button aria-label={expanded?'缩小评论区':'展开评论区'} onClick={()=>{const next=!expanded;setExpanded(next);onExpand(next);}}>{expanded?<CornersIn size={18}/>:<CornersOut size={18}/>}</button><button aria-label="关闭评论区" onClick={onClose}><X size={23}/></button></div></header>
  <div className="comments-tabs"><button className={tab==='comments'?'selected':''} onClick={()=>setTab('comments')}>评论 {count}</button><button className={tab==='analysis'?'selected':''} onClick={()=>setTab('analysis')}>AI解析</button></div>
  <div className="comments-scroll">{tab==='comments'?items.map(c=>row(c)):<div className="analysis-copy"><h3>你的脸，平台的动作。</h3><p>原视频提供动作与原声，摄像头提供你的脸。每一条都不同，每一条又像你。</p><p>这是预设的作品说明，不是真实AI推断。系统不会识别身份，摄像头画面不上传；评论与互动数字是模拟内容。</p></div>}</div>
  <form className="comment-compose" onSubmit={e=>{e.preventDefault();send();}}>
   {attachment&&<div className="attachment-preview"><img src={attachment} alt="待发布的本地图片"/><button type="button" aria-label="移除评论图片" onClick={()=>setAttachment('')}><X size={15}/></button></div>}
   <div className="compose-pill"><input ref={input} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={reply?'回复评论…':'爱评论的人，运气不会差'} aria-label="写评论"/><button type="button" aria-label="添加评论图片" onClick={()=>file.current?.click()}><ImageSquare size={22}/></button><button type="button" aria-label="提及用户" onClick={()=>{setDraft(v=>v+'@抖歪放映员 ');input.current?.focus();}}><At size={23}/></button><button type="button" aria-label="添加表情" onClick={()=>{setDraft(v=>v+' 哈哈哈');input.current?.focus();}}><Smiley size={22}/></button>{(draft.trim()||attachment)&&<button type="submit" aria-label="发送评论"><PaperPlaneTilt size={20} weight="fill"/></button>}</div>
   <input className="sr-only" ref={file} type="file" accept="image/*" onChange={e=>{chooseImage(e.target.files?.[0]);e.currentTarget.value='';}} tabIndex={-1}/>
  </form>
 </section>;
}
