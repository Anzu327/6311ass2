import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{stdio:'ignore'});
const base='http://127.0.0.1:5173/6311ass2/';
let browser;
try{
 for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}
 browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_PATH?{executablePath:process.env.QA_CHROMIUM_PATH}:{})});
 await mkdir('qa-results',{recursive:true});
 for(const group of ['nailong','lulu','huge']){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{window.__qaCameraCalls=0;navigator.mediaDevices.getUserMedia=async()=>{window.__qaCameraCalls++;throw new DOMException('QA denied','NotAllowedError');};});
  // Deliberately make incoming media slower than the gesture animation.
  await page.route(/media\/(nailong|lulu|huge)-02\.(mp4|webm)/,async route=>{if(route.request().method()==='GET')await new Promise(resolve=>setTimeout(resolve,1000));await route.continue();});
  await page.goto(base+'?demo='+group);
  await page.getByRole('button',{name:'跳过扫描进入推荐'}).click({timeout:10000});
  await page.waitForFunction(()=>document.querySelector('.meme-video')?.readyState>=2);
  const originalId=await page.locator('.meme-video').getAttribute('data-clip-id');
  // Post and count stay consistent with the randomized baseline.
  const comments=Number(await page.getByRole('button',{name:'打开评论区'}).innerText());
  await page.getByRole('button',{name:'打开评论区'}).click();
  assert.equal(await page.locator('.comments-tabs button').first().innerText(),'评论 '+comments);
  await page.getByRole('textbox',{name:'写评论'}).fill('只保留在本机的测试评论');
  await page.getByRole('button',{name:'发送评论'}).click();
  await page.getByRole('button',{name:'关闭评论区'}).click();
  assert.equal(await page.getByRole('button',{name:'打开评论区'}).innerText(),String(comments+1));
  const pointer=(type,y)=>page.locator('.stage').evaluate((element,{type,y})=>element.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:17,pointerType:'touch',isPrimary:true,button:0,clientX:130,clientY:y})),{type,y});
  await pointer('pointerdown',450);await pointer('pointermove',280);await pointer('pointerup',280);
  await page.waitForFunction(()=>document.querySelector('.meme-video')?.dataset.clipId?.endsWith('-02')&&document.querySelector('.feed-motion')?.dataset.motion==='idle',null,{timeout:2000});
  assert.equal(await page.getByText('正在加载视频…',{exact:true}).count(),0);
  assert.equal(await page.locator('.clip-loading').count(),0);
  await page.locator('.poster-active').waitFor({timeout:500});
  assert.equal(await page.locator('.paused-symbol').count(),0,'No misleading pause overlay while the incoming source loads');
  assert.ok(await page.locator('.clip-poster').evaluate(image=>image.complete&&image.naturalWidth>0),'A real source poster fills the gap while incoming video is delayed');
  await page.screenshot({path:'qa-results/'+group+'-transition.png'});
  await page.waitForFunction(()=>!document.querySelector('.poster-active')&&document.querySelector('.meme-video')?.readyState>=2);
  assert.equal(await page.locator('.meme-video').count(),1,'Single video decoder');
  assert.equal(await page.locator('.camera-source').count(),1,'Single camera source');
  assert.equal(await page.evaluate(()=>window.__qaCameraCalls),1);
  assert.equal(await page.locator('.meme-video').evaluate(video=>video.muted),false);
  await page.keyboard.press('ArrowUp');
  await page.waitForFunction(id=>document.querySelector('.meme-video')?.dataset.clipId===id&&document.querySelector('.feed-motion')?.dataset.motion==='idle'&&!document.querySelector('.poster-active'),originalId);
  assert.equal(await page.getByRole('button',{name:'打开评论区'}).innerText(),String(comments+1),'Return preserves local per-video count');
  await page.getByRole('button',{name:/^消息/}).click();
  assert.equal(await page.locator('.conversation-row').count(),20);
  await page.getByRole('button',{name:'首页',exact:true}).click();
  assert.equal(await page.locator('.meme-video').getAttribute('data-clip-id'),originalId);
  assert.deepEqual(errors,[]);
  console.log(group+': slow incoming media uses source poster, no loading label, smooth gesture, one player/camera, sound preserved, reverse and messages navigation passed.');
  await page.close();
 }
 await writeFile('qa-results/feed-transition.txt','PASS: all three pools, delayed media poster handoff, no loading label, one decoder/camera, original audio, reverse navigation, randomized comments and messages.\n');
}finally{await browser?.close();server.kill('SIGTERM');}
