// Entirely fictional, project-themed content. Never seed from a personal screenshot.
export type Conversation = {id:string;name:string;avatar:string;preview:string;time:string;unread:number;online?:boolean;muted?:boolean;official?:boolean;kind?:'activity';messages:string[]};
export const conversations:Conversation[] = [
 {id:'activity',name:'互动消息',avatar:'',preview:'小猫观众赞了你的作品',time:'刚刚',unread:6,kind:'activity',messages:['小猫观众赞了你的作品','晚霞频道收藏了你的作品','快乐摸鱼群：这个片段太好笑了！']},
 {id:'screening',name:'抖歪放映室',avatar:'avatar-panda.webp',preview:'[作品通知] 今天也有好笑的',time:'12分钟前',unread:2,official:true,messages:['欢迎来到抖歪放映室。','[作品通知] 今天也有好笑的']},
 {id:'nailong',name:'奶龙小分队',avatar:'inbox-nailong.webp',preview:'[分享视频] 奶龙又来整活啦',time:'26分钟前',unread:3,online:true,messages:['今日份快乐，奶龙已经准备好了。','[分享视频] 奶龙又来整活啦']},
 {id:'lulu',name:'噜噜放映室',avatar:'inbox-lulu.webp',preview:'下一条，还是熟悉的噜噜',time:'39分钟前',unread:1,online:true,messages:['这段原声也太上头了。','下一条，还是熟悉的噜噜']},
 {id:'break',name:'快乐摸鱼群',avatar:'avatar-panda.webp',preview:'[群公告] 今日份快乐已送达',time:'1小时前',unread:0,muted:true,messages:['[群公告] 今日份快乐已送达','欢迎分享你的快乐片段。']},
 {id:'cat',name:'小猫观众',avatar:'avatar-cat.webp',preview:'这个片段我能看一整天',time:'昨天',unread:0,messages:['这个片段我能看一整天']},
 {id:'sunset',name:'晚霞频道',avatar:'avatar-sunset.webp',preview:'[分享视频] 一起看看晚霞',time:'昨天',unread:0,messages:['[分享视频] 一起看看晚霞']},
 {id:'kobe',name:'科比梗图放映室',avatar:'basketball',preview:'[分享视频] 这波，曼巴精神',time:'昨天',unread:4,messages:['欢迎来到科比梗图放映室。','[分享视频] 这波，曼巴精神']},
 {id:'laoda',name:'牢大表情包研究所',avatar:'basketball',preview:'[有人@我] 新表情包到货了',time:'昨天',unread:2,online:true,messages:['今天的表情包库存又增加了。','[有人@我] 新表情包到货了']},
 {id:'laozhan',name:'牢詹整活频道',avatar:'basketball',preview:'[分享视频] 今日份牢詹名场面',time:'昨天',unread:2,messages:['今日整活素材已就位。','[分享视频] 今日份牢詹名场面']},
 {id:'lebang',name:'乐邦詹士聊天室',avatar:'basketball',preview:'群友：这球我先喊一声好球',time:'昨天',unread:0,online:true,messages:['这球我先喊一声好球。','慢放三遍，节目效果拉满。']},
 {id:'fanbanter',name:'詹姆斯库里粉丝对喷群',avatar:'basketball',preview:'[有人@我] 三分还是突破？开聊！',time:'昨天',unread:3,muted:true,messages:['群公告：只聊球和梗，友好互怼。','库里球迷：三分一出手，这不得起立？','詹姆斯球迷：突破冲起来，你先别急！','[有人@我] 三分还是突破？开聊！']},
 {id:'curry',name:'库里三分补习班',avatar:'basketball',preview:'今天投不进，明天接着练',time:'昨天',unread:0,messages:['今天投不进，明天接着练。','先练手感，再练庆祝动作。']},
 {id:'mamba',name:'曼巴精神学习群',avatar:'basketball',preview:'群友：再来一球，绝不摆烂',time:'昨天',unread:0,muted:true,messages:['再来一球，绝不摆烂。','练完球再来刷一会儿抖歪。']},
 {id:'court',name:'凌晨四点的球场',avatar:'basketball',preview:'今天的投篮挑战，你来吗？',time:'周二',unread:0,messages:['今天的投篮挑战，你来吗？']},
 {id:'huge',name:'虎哥片场后援团',avatar:'avatar-sunset.webp',preview:'[分享视频] 这个名场面值得重播',time:'周二',unread:1,messages:['欢迎来到名场面放映时间。','[分享视频] 这个名场面值得重播']},
 {id:'frog',name:'奶蛙快乐补给站',avatar:'inbox-nailong.webp',preview:'一份快乐不够，再来一份',time:'周二',unread:0,messages:['一份快乐不够，再来一份']},
 {id:'replay',name:'无限重播俱乐部',avatar:'inbox-lulu.webp',preview:'又看了一遍，还是笑出了声',time:'周一',unread:0,muted:true,messages:['又看了一遍，还是笑出了声']},
 {id:'catclub',name:'猫猫围观协会',avatar:'avatar-cat.webp',preview:'[表情] 猫猫探头',time:'周一',unread:0,messages:['[表情] 猫猫探头']},
 {id:'weekend',name:'周末快乐收集器',avatar:'avatar-panda.webp',preview:'这周的快乐片段都在这里啦',time:'周一',unread:0,messages:['这周的快乐片段都在这里啦']},
];
export const initialUnread = conversations.reduce((sum,item)=>sum+item.unread,0);
