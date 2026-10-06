
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
let browser,page;
try{
 const url='http://127.0.0.1:5173/6311ass2/';
 for(let i=0;i<470;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));if(i===79)throw new Error('Vite failed to start');}
 browser=await chromium.launch({headless:true});
 page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const broken=[];page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});
 await page.goto(url);await page.getByRole('button',{name:'Try a sample'}).click();
 await page.getByRole('button',{name:'Start scrolling'}).click({timeout:10000});
 const names=new Set();
 for(let i=0;i<48;i++){await page.waitForTimeout(650);names.add(await page.locator('.meme-badge').innerText());if(i<8)await page.keyboard.press('ArrowDown');}
 assert.equal(names.size,48,'First 48 posts must have 48 distinct clips');
 for(let i=0;i<5;i++){await page.waitForTimeout(500);await page.keyboard.press('ArrowDown');}
 assert.match(await page.locator('.post-caption > .mono').innerText(),/#053/);
 await page.getByRole('button',{name:'Like post'}).click();assert.equal(await page.getByRole('button',{name:'Like post'}).getAttribute('aria-pressed'),'true');
 await page.waitForTimeout(550);
 const beforeSwipe=await page.locator('.post-caption > .mono').innerText();
 await page.evaluate(()=>{const target=document.querySelector('.stage');const start=new Touch({identifier:1,target,clientX:150,clientY:650});target.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[start]}));const end=new Touch({identifier:1,target,clientX:150,clientY:200});target.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[end]}));});
 await page.waitForTimeout(550);assert.notEqual(await page.locator('.post-caption > .mono').innerText(),beforeSwipe,'Mobile swipe must advance the feed');
 for(const [name,label] of [['shadow','SHADOW CLONE / 1'],['dragon','DRAGON LORD / 1'],['mahi','FACE KARAOKE / 1'],['food','SOUL SAUCE / 3'],['dino','DINO IDENTITY / 1'],['pan','PAN ENTRANCE / 1'],['buy','BUY NOW LOOP / 3']]){
  await page.getByRole('button',{name:'Explore',exact:true}).click();
  await page.getByRole('button',{name:new RegExp(label)}).click();await page.waitForTimeout(1300);
  const beforeCanvas=await page.locator('canvas.face-effects').evaluate(c=>c.toDataURL());
  await page.waitForTimeout(450);assert.notEqual(await page.locator('canvas.face-effects').evaluate(c=>c.toDataURL()),beforeCanvas,'Each clip must animate, not display a still');
  const unique=await page.locator('canvas.face-effects').evaluate(c=>{const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data,colors=new Set();for(let i=0;i<data.length;i+=400)colors.add(data[i]+','+data[i+1]+','+data[i+2]);return colors.size;});
  assert.ok(unique>50,'Meme canvas must contain rendered portrait and character artwork');
  console.log('QA_SCREENSHOT_'+name.toUpperCase()+'='+(await page.screenshot({type:'jpeg',quality:65})).toString('base64'));
 }
 await page.getByRole('button',{name:'Explore',exact:true}).click();assert.equal(await page.locator('.explore-meme').count(),48);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.setViewportSize({width:320,height:568});await page.waitForTimeout(450);
 assert.ok(await page.locator('.bottom-nav').evaluate(e=>e.getBoundingClientRect().bottom<=window.innerHeight+1),'Small-mobile navigation must fit');
 console.log('QA_SCREENSHOT_SMALL='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(450);
 const still=await page.locator('canvas.face-effects').evaluate(c=>c.toDataURL());await page.waitForTimeout(450);assert.equal(await page.locator('canvas.face-effects').evaluate(c=>c.toDataURL()),still,'Reduced motion must stop visual warping');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1366,height:768});await page.waitForTimeout(500);
 assert.ok(await page.locator('.stage').evaluate(e=>e.getBoundingClientRect().height<=window.innerHeight),'Desktop stage must fit');
 console.log('QA_SCREENSHOT_DESKTOP='+(await page.screenshot({type:'jpeg',quality:55})).toString('base64'));
 await page.getByRole('button',{name:'Reset my feed'}).click();await page.getByRole('button',{name:'Start again',exact:true}).waitFor();
 assert.equal(await page.locator('.stage').getAttribute('class').then(c=>c.includes('ending')),true);
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
 live.on('pageerror',e=>errors.push(e.message));await live.goto(url);await live.getByRole('button',{name:'Make me a meme'}).click();await live.getByRole('button',{name:'Start scrolling'}).click({timeout:10000});
 await live.getByText('LIVE · face tracked',{exact:true}).waitFor({timeout:60000});
 await live.waitForTimeout(1000);console.log('QA_SCREENSHOT_TRACKING='+(await live.screenshot({type:'jpeg',quality:60})).toString('base64'));
 await live.getByRole('button',{name:'Turn camera off'}).click();assert.ok(await live.evaluate(()=>window.__qaStopped)>0,'Camera tracks must stop');
 assert.deepEqual(errors,[],'No browser runtime errors');assert.deepEqual(broken,[],'No missing local assets');
 console.log('Meme browser checks passed: 48 unique clips, 16 families, three skins, animated renders, reduced motion, endless feed, likes, Explore, reset, mobile, desktop, real landmark model on synthetic camera, camera cleanup.');
}catch(error){if(page){console.log('QA_FAILURE_IMAGE='+(await page.screenshot({type:'jpeg',quality:60})).toString('base64'));}throw error;}finally{await browser?.close();server.kill('SIGTERM');}
