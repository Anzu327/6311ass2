
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
let browser,page;
try{
 const url='http://127.0.0.1:5173/6311ass2/';
 for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));if(i===79)throw new Error('Vite failed to start');}
 browser=await chromium.launch({headless:true});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const broken=[];page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});
 await page.addInitScript(()=>{
  window.__qaCameraRequests=0;
  const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia=(constraints)=>{window.__qaCameraRequests++;return original(constraints);};
  window.__qaIntroTiming={};
  new MutationObserver(()=>{const phase=document.querySelector('.stage')?.classList;const now=performance.now();if(phase?.contains('intro')&&!window.__qaIntroTiming.intro)window.__qaIntroTiming.intro=now;if(phase?.contains('feed')&&!window.__qaIntroTiming.feed)window.__qaIntroTiming.feed=now;}).observe(document,{childList:true,subtree:true,attributes:true});
 });
 await page.goto(url);
 await page.locator('.stage.feed').waitFor({timeout:5000});
 const timing=await page.evaluate(()=>window.__qaIntroTiming);
 assert.ok(timing.feed-timing.intro>=1400&&timing.feed-timing.intro<2300,'Intro must last about1.5 seconds from React mount');
 assert.equal(await page.evaluate(()=>window.__qaCameraRequests),0,'Entry must not request the camera');
 assert.equal(await page.locator('.welcome-copy,.identity-copy,.scan-copy,.ending-copy').count(),0,'No intermediate onboarding screens');

 assert.equal(await page.locator('canvas.face-effects').count(),0,'No legacy effects canvas');
 assert.equal(await page.locator('.meme-headline,.meme-badge,.bootleg-popup,.interest-popup,.video-timeline').count(),0,'No effect UI remains');
 await page.getByRole('heading',{name:'No effects',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Like post'}).isDisabled(),true);
 for(let i=0;i<15;i++){await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');}
 assert.match(await page.locator('.post-caption > .mono').innerText(),/#016/);
 await page.getByRole('button',{name:'Explore',exact:true}).click();await page.getByRole('heading',{name:'No effects available.'}).waitFor();assert.equal(await page.locator('.explore-meme').count(),0);await page.getByRole('button',{name:'Close dialog'}).click();
 for(const viewport of [{width:390,height:844},{width:320,height:568},{width:1366,height:768}]){await page.setViewportSize(viewport);await page.waitForTimeout(300);assert.ok(await page.locator('.bottom-nav').evaluate(e=>e.getBoundingClientRect().bottom<=window.innerHeight+1),'Navigation must fit');}
 console.log('QA_SCREENSHOT_CLEARED='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));
 const mediaRequests=[];page.on('request',r=>mediaRequests.push(r.url()));
 await page.reload();await page.locator('.stage.feed').waitFor({timeout:5000});await page.waitForTimeout(500);
 assert.ok(!mediaRequests.some(url=>/meme-|remix-|cheek-effect/.test(url)),'Must not request any removed effect assets');
 await page.getByRole('button',{name:'Reset my feed'}).click();assert.ok(await page.locator('.stage.feed').count());assert.equal(await page.locator('.stage.intro').count(),0);assert.match(await page.locator('.post-caption > .mono').innerText(),/#001/);
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(url);await reduced.locator('.stage.feed').waitFor({timeout:5000});await reduced.close();
 const live=await browser.newPage({viewport:{width:390,height:844}});
 await live.addInitScript(()=>{
  window.__qaStopped=0;
  navigator.mediaDevices.getUserMedia=async constraints=>{
   if(constraints.audio!==false)throw new Error('Microphone must not be requested');
   const canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;const image=new Image();image.src=location.origin+'/6311ass2/media/demo-portrait.jpg';await image.decode();
   const ctx=canvas.getContext('2d');let frame=0;const draw=()=>{ctx.fillStyle='#222';ctx.fillRect(0,0,720,1280);ctx.drawImage(image,Math.sin(frame++/10)*8,0,720,1280);};draw();
   const timer=setInterval(draw,80),stream=canvas.captureStream(12);
   for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{clearInterval(timer);window.__qaStopped++;stop();};}
   return stream;
  };
 });
 live.on('pageerror',e=>errors.push(e.message));await live.goto(url);await live.locator('.stage.feed').waitFor({timeout:5000});await live.getByRole('button',{name:'Turn camera on'}).click();
 await live.getByText('LIVE · face tracked',{exact:true}).waitFor({timeout:60000});
 await live.waitForTimeout(1000);console.log('QA_SCREENSHOT_TRACKING='+(await live.screenshot({type:'jpeg',quality:60})).toString('base64'));
 await live.getByRole('button',{name:'Turn camera off'}).click();assert.ok(await live.evaluate(()=>window.__qaStopped)>0,'Camera tracks must stop');
 assert.deepEqual(errors,[],'No browser runtime errors');assert.deepEqual(broken,[],'No missing local assets');
 console.log('Direct entry checks passed: 1.5-second intro, automatic feed, no welcome/scan/identity, no automatic camera request, all effects removed, no deleted-asset requests, navigation, empty Explore, reset, three viewports, live landmark model on synthetic camera, camera cleanup.');
}catch(error){if(page){console.log('QA_FAILURE_IMAGE='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));}throw error;}finally{await browser?.close();server.kill('SIGTERM');}
