
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('qa-results',{recursive:true});
const qaLog=[],originalLog=console.log;
console.log=(...args)=>{qaLog.push(args.map(String).join(' '));originalLog(...args);};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
let browser,page;
try{
 const url='http://127.0.0.1:5173/6311ass2/';
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
  console.log('QA_SCREENSHOT_HEAD_'+viewport.width+'='+(await page.locator('.stage').screenshot({type:'jpeg',quality:70})).toString('base64'));
 }
 assert.ok(await page.locator('.head-overlay').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return d.some((v,i)=>i%4===3&&v===255);}), 'Mosaic must actually be drawn');
 assert.ok(!requested.some(u=>/demo-head|demo-portrait/.test(u)),'No removed fictional portraits');
 assert.equal(await source.evaluate(v=>v.muted),false,'Source is never silently muted');
 await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');await page.waitForTimeout(250);
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
 await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor();assert.equal(await source.getAttribute('data-clip-id'),'qinghai','Feed cycles to first actual clip');

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
 await page.getByRole('button',{name:'展开 3 条回复',exact:true}).click();assert.equal(await page.locator('.reply-list .nested').count(),3);
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
 await live.addInitScript(()=>{
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
 });
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
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.deepEqual(outgoing,[],'No completed camera/telemetry upload requests');
 assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'),"connect-src 'self';",'External fetches/telemetry must be blocked by browser policy');
 console.log('Head-overlay QA passed:1.5-second entry, one automatic video-only camera request after intro, complete source video, six distinct original videos with source-head mosaic, Douyin-style Chinese feed and white comment sheet, local posting/replies/votes/expand/close, three viewports, actual audio tracks, default audible playback with no mute switch, current-clip replay, feed cycling and Explore selection, local live head segmentation on synthetic camera, moving camera face, disappearance replaces face with mosaic, recovery, pagehide camera cleanup, denied permission, no runtime errors/missing assets/frame uploads.');
}catch(error){await writeFile('qa-results/error.txt',String(error.stack||error));if(page)console.log('QA_FAILURE_IMAGE='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));throw error;}finally{await writeFile('qa-results/report.log',qaLog.join('\n'));await browser?.close();server.kill('SIGTERM');}
