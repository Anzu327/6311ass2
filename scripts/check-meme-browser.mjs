
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
  const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia=c=>{window.__qaCameraRequests++;return original(c);};
  window.__qaIntroTiming={};
  new MutationObserver(()=>{const phase=document.querySelector('.stage')?.classList;const now=performance.now();if(document.querySelector('.intro-art.ready')&&!window.__qaIntroTiming.ready)window.__qaIntroTiming.ready=now;if(phase?.contains('feed')&&!window.__qaIntroTiming.feed)window.__qaIntroTiming.feed=now;}).observe(document,{childList:true,subtree:true,attributes:true});
 });
 await page.goto(url);await page.locator('.stage.feed').waitFor({timeout:7000});
 const timing=await page.evaluate(()=>window.__qaIntroTiming);assert.ok(timing.feed-timing.ready>=1400&&timing.feed-timing.ready<2300);
 assert.equal(await page.evaluate(()=>window.__qaCameraRequests),0);
 assert.equal(await page.locator('.welcome-copy,.identity-copy,.scan-copy,.ending-copy').count(),0);
 await page.locator('.head-overlay[data-head-source="mosaic"]').waitFor({timeout:20000});
 assert.equal(await page.locator('canvas.face-effects').count(),0);
 assert.equal(await page.locator('.feed-empty').count(),0);
 assert.equal(await page.locator('.avatar img').count(),0,'No fictional profile portrait');
 const requested=[];page.on('request',r=>requested.push(r.url()));
 const source=page.locator('.meme-video');

 assert.deepEqual(await source.evaluate(v=>[v.videoWidth,v.videoHeight,v.muted,v.loop]),[720,1166,true,true]);
 await page.getByRole('button',{name:'Pause video',exact:true}).click();
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
 await page.getByRole('button',{name:'Unmute video',exact:true}).click();assert.equal(await source.evaluate(v=>v.muted),false);
 await page.getByRole('button',{name:'Mute video',exact:true}).click();assert.equal(await source.evaluate(v=>v.muted),true);
 await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');await page.waitForTimeout(250);
 assert.match(await page.locator('.post-caption > .mono').innerText(),/#002/);
 await page.getByRole('button',{name:'Reset my feed'}).click();assert.match(await page.locator('.post-caption > .mono').innerText(),/#001/);assert.ok(await source.evaluate(v=>v.currentTime)<1);
 assert.equal(await page.locator('.stage.intro').count(),0);
 await page.getByRole('button',{name:'Explore',exact:true}).click();await page.getByRole('heading',{name:'青海摇 · 大头版',exact:true}).waitFor();await page.getByRole('button',{name:'Close dialog'}).click();
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(url);await reduced.locator('.stage.feed').waitFor({timeout:7000});await reduced.close();

 const live=await browser.newPage({viewport:{width:390,height:844}});
 live.on('pageerror',e=>errors.push(e.message));live.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});live.on('requestfinished',r=>{if(r.method()!=='GET')outgoing.push(r.url());});
 await live.addInitScript(()=>{
  window.__qaStopped=0;window.__qaBlank=false;window.__qaShift=0;
  navigator.mediaDevices.getUserMedia=async c=>{
   if(c.audio!==false)throw new Error('Microphone must not be requested');
   const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;
   const image=new Image();image.src=location.origin+'/6311ass2/docs/test-fixtures/qa-head.webp';await image.decode();
   const ctx=canvas.getContext('2d');
   const draw=()=>{ctx.fillStyle='#282d34';ctx.fillRect(0,0,720,1280);if(!window.__qaBlank)ctx.drawImage(image,80+window.__qaShift,100,560,560);};draw();
   const timer=setInterval(draw,75),stream=canvas.captureStream(12);
   for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{clearInterval(timer);window.__qaStopped++;stop();};}
   return stream;
  };
 });
 await live.goto(url);await live.locator('.stage.feed').waitFor({timeout:7000});await live.getByRole('button',{name:'Turn camera on'}).click();
 await live.getByText('LIVE · your face',{exact:true}).waitFor({timeout:60000});
 await live.locator('.head-overlay[data-head-source="live"]').waitFor();
 await live.getByRole('button',{name:'Pause video',exact:true}).click();
 await live.locator('.meme-video').evaluate(v=>{v.currentTime=8;});await live.waitForTimeout(500);
 console.log('QA_SCREENSHOT_LIVE='+(await live.locator('.stage').screenshot({type:'jpeg',quality:80})).toString('base64'));
 const cut=await live.locator('.head-overlay').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return {colored:Array.from(d).filter((n,i)=>i%4===3&&n>200).length,clear:Array.from(d).filter((n,i)=>i%4===3&&n===0).length};});
 assert.ok(cut.colored>100&&cut.clear>1000,'Cutout must render opaque face pixels and transparent surrounding pixels');
 await live.evaluate(()=>{window.__qaShift=70;});await live.waitForTimeout(1000);assert.equal(await live.locator('.head-overlay').getAttribute('data-head-source'),'live');
 await live.evaluate(()=>{window.__qaBlank=true;});await live.getByText('No face · showing mosaic',{exact:true}).waitFor({timeout:15000});await live.locator('.head-overlay[data-head-source="mosaic"]').waitFor();
 console.log('QA_SCREENSHOT_NO_FACE='+(await live.locator('.stage').screenshot({type:'jpeg',quality:80})).toString('base64'));
 await live.evaluate(()=>{window.__qaBlank=false;});await live.getByText('LIVE · your face',{exact:true}).waitFor({timeout:15000});
 await live.getByRole('button',{name:'Turn camera off'}).click();
 assert.ok(await live.evaluate(()=>window.__qaStopped)>0);await live.locator('.head-overlay[data-head-source="mosaic"]').waitFor();
 assert.equal(await live.locator('.camera-source').evaluate(v=>v.srcObject),null);

 const denied=await browser.newPage({viewport:{width:390,height:844}});
 await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});
 await denied.goto(url);await denied.locator('.stage.feed').waitFor({timeout:7000});await denied.getByRole('button',{name:'Turn camera on'}).click();await denied.locator('.camera-error').waitFor();await denied.getByRole('button',{name:'Continue watching',exact:true}).click();await denied.locator('.head-overlay[data-head-source="mosaic"]').waitFor();await denied.close();
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);assert.deepEqual(outgoing,[],'No completed camera/telemetry upload requests');
 assert.equal(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content'),"connect-src 'self';",'External fetches/telemetry must be blocked by browser policy');
 console.log('Head-overlay QA passed:1.5-second entry, no automatic camera access, complete source video, source-head mosaic without fictional avatars, three viewports, pause/audio/replay/navigation, local live head segmentation on synthetic camera, moving camera face, disappearance replaces face with mosaic, recovery, camera cleanup, denied permission, no runtime errors/missing assets/frame uploads.');
}catch(error){await writeFile('qa-results/error.txt',String(error.stack||error));if(page)console.log('QA_FAILURE_IMAGE='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));throw error;}finally{await writeFile('qa-results/report.log',qaLog.join('\n'));await browser?.close();server.kill('SIGTERM');}
