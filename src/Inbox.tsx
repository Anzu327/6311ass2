import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,Basketball,BellSlash,Check,Heart,List,MagnifyingGlass,PaperPlaneTilt,Plus,Smiley,X} from '@phosphor-icons/react';
import {conversations,type Conversation} from './inboxData';

const base=import.meta.env.BASE_URL+'media/';
function Avatar({item}:{item:Conversation}){
 return <span className={`inbox-avatar ${item.kind==='activity'?'activity-avatar':''} ${item.avatar==='basketball'?'basketball-avatar':''}`}>{item.kind==='activity'?<Heart size={29} weight="fill"/>:item.avatar==='basketball'?<Basketball size={38} weight="duotone"/>:<img src={base+item.avatar} alt=""/>}{item.online&&<i aria-label="模拟在线"/>}</span>;
}
export default function Inbox({visible,onUnreadChange}:{visible:boolean;onUnreadChange:(count:number)=>void}){
 const [items,setItems]=useState(conversations),[selected,setSelected]=useState<string|null>(null),[query,setQuery]=useState(''),[searching,setSearching]=useState(false),[menu,setMenu]=useState<'tools'|'new'|null>(null),[drafts,setDrafts]=useState<Record<string,string>>({}),[sent,setSent]=useState<Record<string,string[]>>({}),[story,setStory]=useState<string|null>(null);
 const scroll=useRef<HTMLDivElement>(null),search=useRef<HTMLInputElement>(null);
 const current=items.find(item=>item.id===selected);
 const unread=items.reduce((sum,item)=>sum+item.unread,0);
 useEffect(()=>onUnreadChange(unread),[unread,onUnreadChange]);
 useEffect(()=>{if(searching&&visible)search.current?.focus();},[searching,visible]);
 useEffect(()=>{if(current&&visible)scroll.current?.scrollTo({top:scroll.current.scrollHeight});},[current,sent,visible]);
 useEffect(()=>{if(!visible)return;const escape=(event:KeyboardEvent)=>{if(event.key!=='Escape')return;event.stopImmediatePropagation();if(story)setStory(null);else if(menu)setMenu(null);else if(selected)setSelected(null);else if(searching){setSearching(false);setQuery('');}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[visible,story,menu,selected,searching]);
 const open=(id:string)=>{setItems(previous=>previous.map(item=>item.id===id?{...item,unread:0}:item));setSelected(id);setMenu(null);};
 const send=()=>{if(!current)return;const text=(drafts[current.id]??'').trim();if(!text)return;setSent(previous=>({...previous,[current.id]:[...previous[current.id]??[],text]}));setItems(previous=>previous.map(item=>item.id===current.id?{...item,preview:text,time:'刚刚'}:item));setDrafts(previous=>({...previous,[current.id]:''}));};
 if(!visible)return null;
 return <section className="inbox-page" aria-label="消息页面">
  <header className="inbox-header">
   {current?<button aria-label="返回消息列表" onClick={()=>setSelected(null)}><ArrowLeft size={25}/></button>:<button aria-label="消息菜单" aria-expanded={menu==='tools'} onClick={()=>setMenu(menu==='tools'?null:'tools')}><List size={25}/></button>}
   <h1>{current?.name??'消息'}</h1>
   {!current&&<div className="inbox-header-actions"><button aria-label="搜索消息" onClick={()=>{setSearching(v=>!v);setQuery('');setMenu(null);}}><MagnifyingGlass size={25}/></button><button aria-label="新建会话" aria-expanded={menu==='new'} onClick={()=>setMenu(menu==='new'?null:'new')}><Plus size={20} className="inbox-plus"/></button></div>}
  </header>
  {menu&&<><button className="inbox-dismiss" aria-label="关闭消息菜单" onClick={()=>setMenu(null)}/><div className="inbox-popover">{menu==='tools'?<button onClick={()=>{setItems(previous=>previous.map(item=>({...item,unread:0})));setMenu(null);}}><Check size={19}/>全部标为已读</button>:<><p>选择一个演示会话</p>{items.filter(item=>!item.kind).map(item=><button key={item.id} onClick={()=>open(item.id)}><Avatar item={item}/>{item.name}</button>)}</>}</div></>}
  {current?<>
   <div ref={scroll} className="inbox-chat" aria-label={current.kind?'互动通知':'会话内容'}><p className="chat-date">{current.time}</p>{current.messages.map((text,i)=><div className="chat-line" key={i}><Avatar item={current}/><p>{text}</p></div>)}{(sent[current.id]??[]).map((text,i)=><div className="chat-line outgoing" key={'sent'+i}><p>{text}</p></div>)}</div>
   {!current.kind&&<form className="inbox-composer" onSubmit={event=>{event.preventDefault();send();}}><input aria-label="输入消息" placeholder="发消息…" maxLength={500} value={drafts[current.id]??''} onChange={event=>setDrafts(previous=>({...previous,[current.id]:event.target.value}))}/><button type="button" aria-label="添加表情" onClick={()=>setDrafts(previous=>({...previous,[current.id]:(previous[current.id]??'').slice(0,499)+'😊'}))}><Smiley size={26}/></button><button type="submit" aria-label="发送消息" disabled={!(drafts[current.id]??'').trim()}><PaperPlaneTilt size={24} weight="fill"/></button></form>}
  </>:<>
   {searching&&<div className="inbox-search"><MagnifyingGlass size={18}/><input ref={search} aria-label="搜索会话" placeholder="搜索会话或消息" value={query} onChange={event=>setQuery(event.target.value)}/><button aria-label="取消搜索" onClick={()=>{setSearching(false);setQuery('');}}><X size={18}/></button></div>}
   <div className="inbox-scroll">
    {!query&&<div className="inbox-stories" aria-label="日常动态">{[{id:'self',name:'我的日常',avatar:'avatar-cat.webp'},...items.filter(item=>['nailong','lulu','cat','sunset'].includes(item.id))].map(item=><button key={item.id} onClick={()=>setStory(item.name)}><span className="story-ring"><img src={base+item.avatar} alt=""/>{item.id==='self'&&<span className="story-add"><Plus size={14} weight="bold"/></span>}</span><span>{item.name}</span></button>)}</div>}
    <div className="inbox-list">{items.filter(item=>(item.name+item.preview).includes(query.trim())).map(item=><button className="conversation-row" key={item.id} onClick={()=>open(item.id)}><Avatar item={item}/><span className="conversation-copy"><span className="conversation-title"><strong>{item.name}</strong>{item.official&&<small>作品通知</small>}</span><span className="conversation-preview">{item.preview}</span></span><span className="conversation-meta"><time>{item.muted&&<BellSlash size={13}/>} {item.time}</time>{item.unread>0&&<span className="unread-badge" aria-label={`${item.unread}条未读`}>{item.unread}</span>}</span></button>)}</div>
    {!items.some(item=>(item.name+item.preview).includes(query.trim()))&&<div className="inbox-empty"><MagnifyingGlass size={32}/><p>没有找到相关会话</p><span>换个关键词试试</span></div>}
   </div>
  </>}
  <p className="inbox-demo">虚构会话 · 仅在本机演示</p>
  {story&&<section className="inbox-story-view" aria-label="日常动态预览"><button aria-label="关闭动态" onClick={()=>setStory(null)}><X size={25}/></button><img src={base+(story==='我的日常'?'avatar-cat.webp':items.find(item=>item.name===story)?.avatar??'avatar-sunset.webp')} alt={`${story}的演示动态`}/><h2>{story}</h2><p>{story==='我的日常'?'今天的快乐，从刷到一条好笑的视频开始。':'今日份快乐，分享给你。'}</p><small>虚构动态 · 本地演示</small></section>}
 </section>;
}
