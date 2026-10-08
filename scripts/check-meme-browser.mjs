
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('qa-results',{recursive:true});
const qaLog=[],originalLog=console.log;
console.log=(...args)=>{qaLog.push(args.map(String).join(' '));originalLog(...args);};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
let browser,page,diagnosticPage;
async function waitForClip(page,id){await page.waitForFunction(id=>{const v=document.querySelector('.meme-video'),p=document.querySelector('.feed-motion');return v?.dataset.clipId===id&&v.readyState>=2&&p?.dataset.motion==='idle'&&document.querySelector('.stage')?.dataset.headReady==='true';},id,{timeout:15000});}
try{
 const baseURL='http://127.0.0.1:5173/6311ass2/';const url=baseURL+'?feed=memes';
 for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));if(i===79)throw new Error('Vite failed to start');}
 browser=await chromium.launch({headless:true});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[],broken=[],outgoing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});page.on('requestfinished',r=>{if(r.method()!=='GET')outgoing.push(r.url());});
 await page.addInitScript(()=>{
  window.__qaCameraRequests=0;
  window.__qaCameraPhases=[];
  navigator.mediaDevices.getUserMedia=async c=>{window.__qaCameraRequests++;window.__qaCameraPhases.push(document.querySelector('.stage')?.classList.contains('feed'));if(c.audio!==false)throw new Error('No microphone');throw new DOMException('Denied in QA','NotAllowedError');};
  window.__qaIntroTiming={};
  new MutationObserver(()=>{const phase=document.querySelector('.stage')?.classList;const now=performance.now();if(document.querySelector('.intro-art.ready')&&!window.__qaIntroTiming.ready)window.__qaIntroTiming.ready=now;if(phase?.contains('feed')&&!window.__qaIntroTiming.feed)window.__qaIntroTiming.feed=now;}).observe(document,{childList:true,subtree:true,attributes:true});
 });
 await page.goto(url);await page.locator('.stage.feed').waitFor({timeout:7000});
 const timing=await page.evaluate(()=>window.__qaIntroTiming);assert.ok(timing.feed-timing.ready>=1400&&timing.feed-timing.ready<2300);
 await page.waitForFunction(()=>window.__qaCameraRequests===1);
 assert.equal(await page.evaluate(()=>window.__qaCameraRequests),1,'One camera request automatically after intro');
 assert.deepEqual(await page.evaluate(()=>window.__qaCameraPhases),[true]);
 assert.equal(await page.getByRole('button',{name:/Turn camera|Mute video|Unmute video/}).count(),0,'No camera or mute switches');
 await page.getByRole('button',{name:'继续观看',exact:true}).click();
 assert.equal(await page.locator('.welcome-copy,.identity-copy,.scan-copy,.ending-copy').count(),0);
 await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor({timeout:20000});
 assert.equal(await page.locator('canvas.face-effects').count(),0);
 assert.equal(await page.locator('.feed-empty').count(),0);
 assert.ok((await page.locator('.avatar img').getAttribute('src')).includes('avatar-cat.webp'),'Feed uses an animal profile asset, not a fictional human fallback');
 const requested=[];page.on('request',r=>requested.push(r.url()));
 const source=page.locator('.meme-video');

 assert.deepEqual(await source.evaluate(v=>[v.videoWidth,v.videoHeight,v.muted,v.loop]),[720,1166,false,true]);
 if(await page.locator('.playback-hint').count())await page.locator('.stage.feed').click({position:{x:50,y:250}});
 if(await page.getByRole('button',{name:'播放视频',exact:true}).count())await page.getByRole('button',{name:'播放视频',exact:true}).click();
 await page.getByRole('button',{name:'暂停视频',exact:true}).click();
 const pausedTime=await source.evaluate(v=>v.currentTime);await page.waitForTimeout(500);assert.ok(Math.abs(await source.evaluate(v=>v.currentTime)-pausedTime)<.05);
 await source.evaluate(v=>{v.currentTime=8;});await page.waitForTimeout(250);
 for(const viewport of [{width:390,height:844},{width:320,height:568},{width:1366,height:768}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(200);
  assert.ok(await page.locator('.bottom-nav').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1));
  assert.equal(await source.evaluate(v=>getComputedStyle(v).objectFit),'contain');
  assert.ok(await page.locator('.feed-tabs .active').evaluate(e=>{const t=e.parentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return r.left>=t.left-1&&r.right<=t.right+1;}),'Selected recommendation channel stays fully visible after viewport resize');
  console.log('QA_SCREENSHOT_HEAD_'+viewport.width+'='+(await page.locator('.stage').screenshot({type:'jpeg',quality:70})).toString('base64'));
 }
 assert.ok(await page.locator('.head-overlay').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4===3&&v===255);}), 'Mosaic must actually be drawn');
 assert.ok(!requested.some(u=>/demo-head|demo-portrait/.test(u)),'No removed fictional portraits');
 assert.equal(await source.evaluate(v=>v.muted),false,'Source is never silently muted');
 await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');await waitForClip(page,'blue-run');
 assert.match(await page.locator('.post-caption .sr-only').innerText(),/蓝色妖姬跑步.*2\/6/);
 await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor();
 await page.getByRole('button',{name:'打开菜单',exact:true}).click();await page.getByRole('button',{name:'重新播放当前视频',exact:true}).click();assert.match(await page.locator('.post-caption .sr-only').innerText(),/蓝色妖姬跑步.*2\/6/);assert.ok(await source.evaluate(v=>v.currentTime)<1);
 assert.equal(await page.locator('.stage.intro').count(),0);
 await page.getByRole('button',{name:'视频合集',exact:true}).click();await page.getByRole('heading',{name:'视频合集',exact:true}).waitFor();await page.getByRole('button',{name:'关闭弹窗'}).click();

 const titles=['青海摇','蓝色妖姬跑步','社会摇','我要迪士尼','山东菏泽曹县','退！退！退！'];
 for(let i=0;i<titles.length;i++){
  await page.getByRole('button',{name:'视频合集',exact:true}).click();
  await page.locator('.clip-list button').nth(i).click();
  await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor({timeout:15000});
  assert.match(await page.locator('.post-caption .sr-only').innerText(),new RegExp((i+1)+'/6'));
  assert.notEqual(await source.evaluate(v=>v.currentSrc),'');
  assert.ok(await source.evaluate(v=>v.duration)>4);
  if(await page.getByRole('button',{name:'播放视频',exact:true}).count())await page.getByRole('button',{name:'播放视频',exact:true}).click();
  assert.equal(await source.evaluate(v=>v.muted),false);
  const hasAudio=await source.evaluate(v=>{if(!v.captureStream)return null;const s=v.captureStream();const audio=s.getAudioTracks().length;s.getTracks().forEach(t=>t.stop());return audio;});
  if(hasAudio!==null)assert.ok(hasAudio>0,'Every supplied clip must expose an audio track');

  await page.getByRole('button',{name:'暂停视频',exact:true}).click();
  await source.evaluate(v=>{v.currentTime=Math.min(2,v.duration/2);});await page.waitForTimeout(200);
  console.log('QA_SCREENSHOT_CATALOG_'+i+'='+(await page.locator('.stage').screenshot({type:'jpeg',quality:70})).toString('base64'));
 }
 await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');
 await waitForClip(page,'qinghai');await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor();assert.equal(await source.getAttribute('data-clip-id'),'qinghai','Feed cycles to first actual clip');

 // Screenshot-grounded feed and white comments-sheet interactions.
 await page.setViewportSize({width:390,height:758});await page.waitForTimeout(250);
 assert.equal(await page.locator('.bootleg-brand,.scan-meta,.camera-status').count(),0,'No oversized counterfeit/debug chrome');
 await page.getByRole('button',{name:'点赞视频',exact:true}).click();assert.equal(await page.getByRole('button',{name:'点赞视频',exact:true}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'收藏视频',exact:true}).click();assert.equal(await page.getByRole('button',{name:'收藏视频',exact:true}).getAttribute('aria-pressed'),'true');
 console.log('QA_SCREENSHOT_FEED_REFERENCE='+(await page.locator('.stage').screenshot({type:'jpeg',quality:90})).toString('base64'));
 const fullMedia=await page.locator('.media-stage').boundingBox();
 await page.getByRole('button',{name:'打开评论区',exact:true}).click();await page.getByRole('dialog',{name:'评论区',exact:true}).waitFor();
 assert.ok(await page.locator('.media-stage').evaluate(e=>e.getBoundingClientRect().height)<fullMedia.height*.6,'Video shrinks above comments');
 assert.equal(await page.locator('.comments-sheet').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
 console.log('QA_SCREENSHOT_COMMENTS_REFERENCE='+(await page.locator('.stage').screenshot({type:'jpeg',quality:90})).toString('base64'));
 await page.getByRole('button',{name:'展开 3 条回复',exact:true}).click();assert.equal(await page.locator('.comments-scroll > .comment-row').first().locator('.reply-list .nested').count(),3);
 await page.getByRole('button',{name:'AI解析',exact:true}).click();await page.getByRole('heading',{name:'你的脸，平台的动作。',exact:true}).waitFor();
 await page.getByRole('button',{name:/评论 275/}).click();
 await page.getByRole('textbox',{name:'写评论',exact:true}).fill('本地测试评论，不上传');
 await page.getByRole('button',{name:'发送评论',exact:true}).click();await page.getByText('本地测试评论，不上传',{exact:true}).waitFor();
 await page.getByRole('button',{name:'关闭评论区',exact:true}).click();
 await page.getByRole('button',{name:'打开评论区',exact:true}).click();await page.getByText('本地测试评论，不上传',{exact:true}).waitFor();
 await page.getByRole('button',{name:'展开评论区',exact:true}).click();assert.ok(await page.locator('.comments-sheet').evaluate(e=>e.getBoundingClientRect().top)<100);
 await page.getByRole('button',{name:'缩小评论区',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('.comments-sheet').count(),0);
 for(const viewport of [{width:320,height:568},{width:1366,height:768}]){
  await page.setViewportSize(viewport);await page.getByRole('button',{name:'打开评论区',exact:true}).click();
  assert.ok(await page.locator('.comment-compose').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1));await page.getByRole('button',{name:'关闭评论区',exact:true}).click();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(url);await reduced.locator('.stage.feed').waitFor({timeout:7000});await reduced.close();

 const live=await browser.newPage({viewport:{width:390,height:844}});
 live.on('pageerror',e=>errors.push(e.message));live.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});live.on('requestfinished',r=>{if(r.method()!=='GET')outgoing.push(r.url());});
 const syntheticCamera=()=>{
  window.__qaStopped=0;window.__qaCameraCalls=0;window.__qaBlank=false;window.__qaShift=0;
  navigator.mediaDevices.getUserMedia=async c=>{
   window.__qaCameraCalls++;if(c.audio!==false)throw new Error('Microphone must not be requested');
   const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;
   const image=new Image();image.src=location.origin+'/6311ass2/docs/test-fixtures/qa-head.webp';await image.decode();
   const ctx=canvas.getContext('2d');
   const draw=()=>{ctx.fillStyle='#282d34';ctx.fillRect(0,0,720,1280);if(!window.__qaBlank)ctx.drawImage(image,80+window.__qaShift,100,560,560);};draw();
   const timer=setInterval(draw,75),stream=canvas.captureStream(12);
   for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{clearInterval(timer);window.__qaStopped++;stop();};}
   return stream;
  };
 };
 await live.addInitScript(syntheticCamera);
 await live.goto(url);await live.locator('.stage.feed').waitFor({timeout:7000});
 await live.getByText('LIVE · your face',{exact:true}).waitFor({timeout:60000});
 await live.locator('.head-overlay[data-head-source="live"]').waitFor();
 if(await live.getByRole('button',{name:'播放视频',exact:true}).count())await live.getByRole('button',{name:'播放视频',exact:true}).click();
 await live.getByRole('button',{name:'暂停视频',exact:true}).click();
 await live.locator('.meme-video').evaluate(v=>{v.currentTime=8;});await live.waitForTimeout(500);
 console.log('QA_SCREENSHOT_LIVE='+(await live.locator('.stage').screenshot({type:'jpeg',quality:80})).toString('base64'));
 const cut=await live.locator('.head-overlay').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return {colored:Array.from(d).filter((n,i)=>i%4===3&&n>200).length,clear:Array.from(d).filter((n,i)=>i%4===3&&n===0).length};});
 assert.ok(cut.colored>100&&cut.clear>1000,'Cutout must render opaque face pixels and transparent surrounding pixels');

 let cameraModelsBefore=await live.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/face_landmarker.task|selfie_multiclass.tflite/.test(e.name)).length);
 for(let i=1;i<titles.length;i++){
  await live.getByRole('button',{name:'视频合集',exact:true}).click();await live.locator('.clip-list button').nth(i).click();
  await live.locator('.head-overlay[data-head-source="live"]').waitFor({timeout:15000});
  await live.getByRole('button',{name:'暂停视频',exact:true}).click();await live.locator('.meme-video').evaluate(v=>{v.currentTime=Math.min(2,v.duration/2);});await live.waitForTimeout(250);
  console.log('QA_SCREENSHOT_LIVE_CATALOG_'+i+'='+(await live.locator('.stage').screenshot({type:'jpeg',quality:70})).toString('base64'));
 }
 assert.equal(await live.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/face_landmarker.task|selfie_multiclass.tflite/.test(e.name)).length),cameraModelsBefore,'Changing clips must not reload camera models');
 await live.getByRole('button',{name:'视频合集',exact:true}).click();await live.locator('.clip-list button').nth(0).click();await live.locator('.head-overlay[data-head-source="live"]').waitFor();
 await live.evaluate(()=>{window.__qaShift=70;});await live.waitForTimeout(1000);assert.equal(await live.locator('.head-overlay').getAttribute('data-head-source'),'live');
 await live.evaluate(()=>{window.__qaBlank=true;});await live.getByText('No face · showing mosaic',{exact:true}).waitFor({timeout:15000});await live.locator('.head-overlay[data-head-source="mosaic"]').waitFor();
 console.log('QA_SCREENSHOT_NO_FACE='+(await live.locator('.stage').screenshot({type:'jpeg',quality:80})).toString('base64'));
 await live.evaluate(()=>{window.__qaBlank=false;});await live.getByText('LIVE · your face',{exact:true}).waitFor({timeout:15000});
 const callsBeforeEnd=await live.evaluate(()=>window.__qaCameraCalls);
 await live.locator('.camera-source').evaluate(v=>v.srcObject.getVideoTracks()[0].dispatchEvent(new Event('ended')));
 await live.locator('.head-overlay[data-head-source="mosaic"]').waitFor();await live.waitForTimeout(500);
 assert.equal(await live.evaluate(()=>window.__qaCameraCalls),callsBeforeEnd,'Never fight a revoked/ended camera by automatically reopening it');
 await live.getByRole('button',{name:'重试摄像头',exact:true}).click();await live.getByText('LIVE · your face',{exact:true}).waitFor({timeout:60000});
 await live.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 assert.ok(await live.evaluate(()=>window.__qaStopped)>0);await live.locator('.head-overlay[data-head-source="mosaic"]').waitFor();
 assert.equal(await live.locator('.camera-source').evaluate(v=>v.srcObject),null);

 const denied=await browser.newPage({viewport:{width:390,height:844}});
 await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});
 await denied.goto(url);await denied.locator('.stage.feed').waitFor({timeout:7000});await denied.locator('.camera-error').waitFor();await denied.getByRole('button',{name:'继续观看',exact:true}).click();await denied.locator('.head-overlay[data-head-source="mosaic"]').waitFor();await denied.close();

 const blocked=await browser.newPage({viewport:{width:390,height:844}});
 await blocked.addInitScript(()=>{
  navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};
  window.__qaAudioAllowed=false;
  const allow=e=>{if(e.isTrusted)window.__qaAudioAllowed=true;};window.addEventListener('pointerdown',allow,{capture:true});window.addEventListener('keydown',allow,{capture:true});
  const original=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){if(this.classList.contains('meme-video')&&!window.__qaAudioAllowed)return Promise.reject(new DOMException('Gesture required','NotAllowedError'));return original.call(this);};
 });
 await blocked.goto(url);await blocked.locator('.stage.feed').waitFor({timeout:7000});await blocked.locator('.playback-hint').waitFor();
 assert.equal(await blocked.locator('.meme-video').evaluate(v=>v.muted),false,'Never fall back to hidden silent playback');
 await blocked.getByRole('button',{name:'继续观看',exact:true}).click();
 await blocked.locator('.media-stage').click({position:{x:50,y:100}});await blocked.waitForFunction(()=>!document.querySelector('.meme-video').paused);
 await blocked.locator('.playback-hint').waitFor({state:'hidden'});
 await blocked.close();

 // Approved blue scanner: explicit demo URL determines a label, never identity inference.
 for(const profile of ['nailong','lulu']){
  const demo=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  demo.on('pageerror',e=>errors.push(e.message));demo.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});demo.on('requestfinished',r=>{if(r.method()!=='GET')outgoing.push(r.url());});
  diagnosticPage=demo;await demo.addInitScript(syntheticCamera);
  await demo.addInitScript(()=>{
   window.__qaLossRequested=false;window.__qaResetObserved=false;window.__qaProgressBeforeReset=0;
   new MutationObserver(()=>{
    const stage=document.querySelector('.scan-demo'),state=stage?.dataset.scanState;
    const progress=Number(document.querySelector('.scan-demo [role="progressbar"]')?.getAttribute('aria-valuenow')??0);
    if(!window.__qaLossRequested&&state==='scanning'&&progress>=15){window.__qaLossRequested=true;window.__qaBlank=true;}
    if(window.__qaLossRequested&&!window.__qaResetObserved){window.__qaProgressBeforeReset=Math.max(window.__qaProgressBeforeReset,progress);if(state==='waiting')window.__qaResetObserved=true;}
   }).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['data-scan-state','aria-valuenow']});
  });
  await demo.goto(baseURL+'?demo='+profile);
  const scan=demo.locator('.scan-demo');await scan.waitFor({timeout:7000});
  assert.equal(await demo.locator('.scan-sticker').count(),0,'No result before animation');
  await scan.locator('[role="progressbar"]').waitFor();
  await demo.waitForFunction(()=>window.__qaResetObserved&&document.querySelector('.scan-demo')?.dataset.scanState==='waiting',{},{timeout:60000});
  assert.equal(await demo.locator('.scan-sticker').count(),0,'Face loss during scan cannot reveal a result');
  assert.ok(await demo.evaluate(()=>window.__qaProgressBeforeReset)>0,'The interrupted scan had actually progressed');
  await demo.waitForFunction(()=>document.querySelector('.scan-demo [role="progressbar"]')?.getAttribute('aria-valuenow')==='0');
  assert.equal(await demo.locator('.meme-video').evaluate(v=>v.paused),true,'No source-video sound under the scanner');
  await demo.evaluate(()=>{window.__qaBlank=false;});await demo.waitForFunction(()=>document.querySelector('.scan-demo')?.dataset.scanState==='scanning',{},{timeout:15000});
  const began=Date.now();
  const firstTop=await demo.locator('.scan-beam').evaluate(e=>e.getBoundingClientRect().top);await demo.waitForTimeout(250);
  const secondTop=await demo.locator('.scan-beam').evaluate(e=>e.getBoundingClientRect().top);assert.ok(Math.abs(secondTop-firstTop)>12,'Blue beam moves, not a static drawing');
  await demo.waitForTimeout(150);
  console.log('QA_SCAN_ACTIVE_'+profile.toUpperCase()+'='+(await demo.locator('.stage').screenshot({type:'jpeg',quality:90})).toString('base64'));
  await demo.waitForFunction(()=>document.querySelector('.scan-demo')?.dataset.scanState==='complete',{},{timeout:6000});
  assert.ok(Date.now()-began>=1700,'Result follows the full two-second scan');
  const label=profile==='nailong'?'重度奶龙用户':'噜噜资深粉';
  await demo.getByRole('heading',{name:label,exact:true}).waitFor();
  await demo.waitForTimeout(450);
  assert.ok(await demo.locator('.scan-sticker').evaluate(e=>e.complete&&e.naturalWidth>0));
  assert.match(await demo.locator('.scan-disclosure').innerText(),/界面演示.*非身份识别/);
  for(const viewport of [{width:390,height:844},{width:320,height:568},{width:1366,height:768}]){
   await demo.setViewportSize(viewport);await demo.waitForTimeout(120);
   assert.ok(await demo.locator('.scan-enter').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth;}),'Demo continue button fits viewport');
   console.log('QA_SCAN_RESULT_'+profile.toUpperCase()+'_'+viewport.width+'='+(await demo.locator('.stage').screenshot({type:'jpeg',quality:90})).toString('base64'));
  }
  const modelLoads=await demo.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/face_landmarker.task|selfie_multiclass.tflite/.test(e.name)).length);
  await demo.getByRole('button',{name:'进入推荐',exact:true}).click();await demo.locator('.scan-demo').waitFor({state:'hidden'});
  await demo.locator('.head-overlay[data-head-source="original"]').waitFor({state:'attached'});
  const poolIDs={"nailong":["nailong-01","nailong-02","nailong-03","nailong-04","nailong-05","nailong-06","nailong-07"],"lulu":["lulu-01","lulu-02","lulu-03","lulu-04","lulu-05","lulu-06","lulu-07","lulu-08"]}[profile];
  const cartoon=demo.locator('.meme-video');
  for(let i=0;i<poolIDs.length;i++){
   await demo.getByRole('button',{name:'视频合集',exact:true}).click();
   assert.equal(await demo.locator('.clip-list button').count(),poolIDs.length,'Catalog is restricted to the current pool');
   await demo.locator('.clip-list button').nth(i).click();
   await demo.waitForFunction(()=>{const v=document.querySelector('.meme-video');return v.readyState>=2&&v.videoWidth>0;});
   assert.equal(await cartoon.getAttribute('data-clip-id'),poolIDs[i],'No cross-pool clip');
   assert.equal(await cartoon.evaluate(v=>v.videoWidth),576);
   assert.ok(await cartoon.evaluate(v=>v.duration)>4);
   assert.equal(await cartoon.evaluate(v=>v.muted),false);
   assert.equal(await cartoon.evaluate(v=>getComputedStyle(v).objectFit),'contain','Original complete cartoon framing');
   assert.equal(await demo.locator('.head-overlay').getAttribute('data-head-source'),'original');
   assert.ok(await demo.locator('.head-overlay').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return !d.some((x,j)=>j%4===3&&x!==0);}), 'No camera head or mosaic drawn on cartoon characters');
   if(await demo.getByRole('button',{name:'播放视频',exact:true}).count())await demo.getByRole('button',{name:'播放视频',exact:true}).click();
   const audio=await cartoon.evaluate(v=>{if(!v.captureStream)return null;const stream=v.captureStream(),n=stream.getAudioTracks().length;stream.getTracks().forEach(t=>t.stop());return n;});
   if(audio!==null)assert.ok(audio>0,'Every cartoon includes original audio');
   await demo.getByRole('button',{name:'暂停视频',exact:true}).click();
   await cartoon.evaluate(v=>{v.currentTime=Math.min(2,v.duration/2);});await demo.waitForTimeout(100);
   assert.match(await demo.locator('.post-caption .sr-only').innerText(),new RegExp((i+1)+'/'+poolIDs.length));
   console.log('QA_POOL_'+profile.toUpperCase()+'_'+i+'='+(await demo.locator('.stage').screenshot({type:'jpeg',quality:80})).toString('base64'));
  }
  await demo.waitForTimeout(500);await demo.keyboard.press('ArrowDown');
  await waitForClip(demo,poolIDs[0]);
  assert.equal(await cartoon.getAttribute('data-clip-id'),poolIDs[0],'Current pool wraps to its own first clip');
  await demo.getByRole('button',{name:'打开菜单',exact:true}).click();await demo.getByRole('button',{name:'重新播放当前视频',exact:true}).click();
  assert.equal(await cartoon.getAttribute('data-clip-id'),poolIDs[0]);assert.ok(await cartoon.evaluate(v=>v.currentTime)<1);
  for(const button of ['搜索视频','朋友']){
   await demo.getByRole('button',{name:button,exact:true}).click();assert.equal(await demo.locator('.clip-list button').count(),poolIDs.length);await demo.getByRole('button',{name:'关闭弹窗',exact:true}).click();
  }

  assert.equal(await demo.evaluate(()=>window.__qaCameraCalls),1,'Same camera stream after demo');
  assert.equal(await demo.evaluate(()=>performance.getEntriesByType('resource').filter(e=>/face_landmarker.task|selfie_multiclass.tflite/.test(e.name)).length),modelLoads,'No model restart after demo');
  await demo.getByRole('button',{name:'打开评论区',exact:true}).click();await demo.getByRole('button',{name:'关闭评论区',exact:true}).click();
  await demo.evaluate(()=>window.dispatchEvent(new Event('pagehide')));assert.ok(await demo.evaluate(()=>window.__qaStopped)>0);await demo.close();
 }
 const sample=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 await sample.addInitScript(()=>{window.__qaRequests=0;navigator.mediaDevices.getUserMedia=async()=>{window.__qaRequests++;throw new DOMException('Denied','NotAllowedError');};});
 await sample.goto(baseURL+'?demo=lulu');await sample.getByRole('button',{name:'播放界面样例',exact:true}).waitFor({timeout:10000});
 assert.equal(await sample.locator('.scan-sticker').count(),0);await sample.getByRole('button',{name:'播放界面样例',exact:true}).click();
 await sample.waitForFunction(()=>document.querySelector('.scan-demo')?.dataset.scanState==='scanning');
 const beamPosition=await sample.locator('.scan-beam').evaluate(e=>e.getBoundingClientRect().top);await sample.waitForTimeout(300);assert.ok(Math.abs(await sample.locator('.scan-beam').evaluate(e=>e.getBoundingClientRect().top)-beamPosition)<1,'Reduced motion fixes scan beam position');
 await sample.getByRole('heading',{name:'噜噜资深粉',exact:true}).waitFor({timeout:6000});
 assert.equal(await sample.evaluate(()=>window.__qaRequests),1,'Denied input not repeatedly requested');
 assert.match(await sample.locator('.scan-camera-caption').innerText(),/未使用人脸判断/);await sample.close();
 const invalid=await browser.newPage({viewport:{width:390,height:844}});await invalid.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});
 await invalid.goto(baseURL+'?demo=unknown');await invalid.locator('.stage.feed').waitFor({timeout:7000});assert.equal(await invalid.locator('.scan-demo').count(),1,'Invalid presets use the unified random entry, not a catalog escape');await invalid.close();

 // Unified root: stable random assignment for the visit, not appearance or identity matching.
 for(const choice of [0,1]){
  const unified=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  unified.on('pageerror',e=>errors.push(e.message));unified.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});
  await unified.addInitScript(value=>{
   crypto.getRandomValues=array=>{array.fill(value);return array;};
   navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};
  },choice);
  diagnosticPage=unified;await unified.goto(baseURL);
  await unified.getByRole('button',{name:'播放界面样例',exact:true}).waitFor({timeout:10000});await unified.getByRole('button',{name:'播放界面样例',exact:true}).click();
  const group=choice?'lulu':'nailong',expected=group+'-01';
  await unified.getByRole('heading',{name:choice?'噜噜资深粉':'重度奶龙用户',exact:true}).waitFor({timeout:6000});
  await unified.getByRole('button',{name:'进入推荐',exact:true}).click();
  await unified.waitForFunction(id=>document.querySelector('.meme-video')?.dataset.clipId===id,expected);
  await unified.waitForFunction(()=>document.querySelector('.meme-video').readyState>=2);
  const before=await unified.locator('.meme-video').getAttribute('data-clip-id');
  // Short drag returns without changing index, pointer cancel also resets.
  const p=await unified.locator('.media-stage').boundingBox(),x=p.x+p.width*.5,y=p.y+p.height*.6;
  const pointer=async(type,py)=>unified.locator('.stage').evaluate((el,{type,x,y})=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:9,pointerType:'touch',isPrimary:true,button:0,clientX:x,clientY:y})),{type,x,y:py});
  await pointer('pointerdown',y);await pointer('pointermove',y-25);
  assert.equal(await unified.locator('.feed-motion').getAttribute('data-motion'),'drag');
  assert.ok(await unified.locator('.feed-motion').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42)<-10,'Frame follows the finger');
  await pointer('pointerup',y-25);await unified.waitForTimeout(220);
  assert.equal(await unified.locator('.meme-video').getAttribute('data-clip-id'),before);
  assert.ok(Math.abs(await unified.locator('.feed-motion').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42))<1,'Short drag rebounds');
  await pointer('pointerdown',y);await pointer('pointermove',y-160);await pointer('pointerup',y-160);
  assert.equal(await unified.locator('.feed-motion').getAttribute('data-motion'),'exit');
  await waitForClip(unified,group+'-02');
  assert.equal(await unified.locator('.meme-video').getAttribute('data-clip-id'),group+'-02');
  assert.equal(await unified.locator('.camera-source').count(),1);
  assert.equal(await unified.locator('.meme-video').count(),1,'Single decoder, no duplicated video/camera layers');
  // Reverse and wheel use the same animated switch, and never leave the group.
  await unified.waitForTimeout(500);await unified.keyboard.press('ArrowUp');
  await waitForClip(unified,group+'-01');
  assert.equal(await unified.locator('.meme-video').getAttribute('data-clip-id'),group+'-01');
  await unified.waitForTimeout(500);await unified.locator('.stage').dispatchEvent('wheel',{deltaY:160});
  await waitForClip(unified,group+'-02');
  assert.equal(await unified.locator('.meme-video').getAttribute('data-clip-id'),group+'-02');
  await unified.getByRole('button',{name:'打开评论区',exact:true}).click();const idBeforeComment=await unified.locator('.meme-video').getAttribute('data-clip-id');
  await unified.locator('.comments-sheet').dispatchEvent('wheel',{deltaY:180});assert.equal(await unified.locator('.meme-video').getAttribute('data-clip-id'),idBeforeComment);
  await unified.getByRole('button',{name:'关闭评论区',exact:true}).click();
  console.log('QA_UNIFIED_'+group.toUpperCase()+'='+(await unified.locator('.stage').screenshot({type:'jpeg',quality:85})).toString('base64'));
  await unified.close();
 }
 console.log('Unified/swipe QA passed:root and unknown presets randomly assign7/8pools, fixed presets/legacy preserved, finger-follow and rebound, forward/reverse/wheel transitions, one player/camera, no comment-scroll navigation, no facial identity/gender inference.');
 console.log('Blue scanner QA passed:two explicit demo profiles, no premature result, moving blue beam, loss reset, two-second animation, three viewports, no audio behind scan, same camera without model restart after continue, restricted8/7clip catalogs and wrap/replay/search/friends, original cartoons with no overlay and sound, denied-camera manual example, reduced motion, invalid URL uses unified entry, no identity or gender inference.');
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.deepEqual(outgoing,[],'No completed camera/telemetry upload requests');
 assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'),"connect-src 'self';",'External fetches/telemetry must be blocked by browser policy');
 console.log('Head-overlay QA passed:1.5-second entry, one automatic video-only camera request after intro, complete source video, six distinct original videos with source-head mosaic, Douyin-style Chinese feed and white comment sheet, local posting/replies/votes/expand/close, three viewports, actual audio tracks, default audible playback with no mute switch, current-clip replay, feed cycling and Explore selection, local live head segmentation on synthetic camera, moving camera face, disappearance replaces face with mosaic, recovery, pagehide camera cleanup, denied permission, no runtime errors/missing assets/frame uploads.');
}catch(error){await writeFile('qa-results/error.txt',String(error.stack||error));if(diagnosticPage){console.log('QA_MEDIA_DIAGNOSTIC='+JSON.stringify(await diagnosticPage.evaluate(()=>{const v=document.querySelector('.meme-video');return {motion:document.querySelector('.feed-motion')?.dataset.motion,transform:document.querySelector('.feed-motion')?.style.transform,protected:document.querySelector('.stage')?.dataset.headReady,id:v?.dataset.clipId,ready:v?.readyState,current:v?.currentSrc,error:v?.error?.code,message:v?.error?.message,sources:[...document.querySelectorAll('.meme-video source')].map(x=>({src:x.src,type:x.type,support:v.canPlayType(x.type)}))};})));console.log('QA_CURRENT_IMAGE='+(await diagnosticPage.screenshot({type:'jpeg',quality:70})).toString('base64'));}if(page)console.log('QA_FAILURE_IMAGE='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));throw error;}finally{await writeFile('qa-results/report.log',qaLog.join('\n'));await browser?.close();server.kill('SIGTERM');}
