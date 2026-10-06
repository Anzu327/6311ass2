
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn('npm',['run','dev','--','--host','127.0.0.1'],{stdio:'pipe'});
let browser;
try{
 const url='http://127.0.0.1:5173/6311ass2/';
 for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));if(i===79)throw new Error('Vite failed to start');}
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const broken=[];page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)broken.push(r.url());});
 await page.goto(url);await page.getByRole('button',{name:'Try a sample'}).click();
 await page.getByRole('button',{name:'Start scrolling'}).click({timeout:10000});
 const names=new Set();
 for(let i=0;i<9;i++){await page.waitForTimeout(650);names.add(await page.locator('.meme-badge').innerText());if(i<8)await page.getByRole('button',{name:'Next post'}).click();}
 assert.equal(names.size,9,'First nine posts must show nine different effects');
 for(let i=0;i<5;i++){await page.waitForTimeout(500);await page.getByRole('button',{name:'Next post'}).click();}
 assert.match(await page.locator('.post-caption > .mono').innerText(),/#014/);
 await page.getByRole('button',{name:'Like post'}).click();assert.equal(await page.getByRole('button',{name:'Like post'}).getAttribute('aria-pressed'),'true');
 for(const [name,label] of [['cat','CAT MEME'],['hood','HOODIE INCIDENT'],['duck','DUCK REVENGE']]){
  await page.getByRole('button',{name:'Explore',exact:true}).click();
  await page.getByRole('button',{name:new RegExp(label)}).click();await page.waitForTimeout(1300);
  const unique=await page.locator('canvas.face-effects').evaluate(c=>{const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data,colors=new Set();for(let i=0;i<data.length;i+=400)colors.add(data[i]+','+data[i+1]+','+data[i+2]);return colors.size;});
  assert.ok(unique>50,'Meme canvas must contain rendered portrait and character artwork');
  console.log('QA_SCREENSHOT_'+name.toUpperCase()+'='+(await page.screenshot({type:'jpeg',quality:65})).toString('base64'));
 }
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
 console.log('Meme browser checks passed: nine effects, endless feed, likes, Explore, reset, mobile, desktop, real landmark model on synthetic camera, camera cleanup.');
}finally{await browser?.close();server.kill('SIGTERM');}
