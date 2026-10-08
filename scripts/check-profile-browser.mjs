import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5175','--strictPort'],{stdio:'ignore'});
const base='http://127.0.0.1:5175/6311ass2/';
let browser;
try{
 for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_PATH?{executablePath:process.env.QA_CHROMIUM_PATH}:{})});
 await mkdir('qa-results',{recursive:true});
 for(const group of ['nailong','lulu','huge','kobe']){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.__cameraCalls=0;navigator.mediaDevices.getUserMedia=async()=>{window.__cameraCalls++;throw new DOMException('QA denied','NotAllowedError');};});
  await page.goto(base+'?demo='+group);
  await page.getByRole('button',{name:'跳过扫描进入推荐'}).click({timeout:15000});
  await page.waitForFunction(()=>document.querySelector('.meme-video')?.readyState>=2);
  await page.getByRole('button',{name:'点赞视频',exact:true}).click();
  await page.getByRole('button',{name:'收藏视频',exact:true}).click();
  const id=await page.locator('.meme-video').getAttribute('data-clip-id');
  await page.getByRole('button',{name:'我',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.meme-video').paused);
  assert.equal(await page.getByRole('heading',{name:'抖歪放映员'}).count(),1);
  assert.equal(await page.locator('.bottom-nav .active').innerText(),'我');
  assert.ok(await page.locator('.profile-scroll').evaluate(el=>el.scrollHeight>el.clientHeight),'Profile scrolls vertically');
  assert.equal(await page.locator('.profile-tile').count(),group==='lulu'?8:group==='nailong'||group==='huge'?7:6);
  assert.ok(await page.locator('.profile-tile img').evaluateAll(images=>images.slice(0,3).every(i=>i.complete&&i.naturalWidth>0)));
  await page.screenshot({path:`qa-results/profile-${group}.png`});
  for(const tab of ['收藏','喜欢']){await page.getByRole('tab',{name:tab,exact:true}).click();assert.equal(await page.locator('.profile-tile').count(),1);}
  await page.getByRole('tab',{name:'日常',exact:true}).click();
  await page.locator('.profile-tile').first().click();
  assert.equal(await page.getByRole('dialog',{name:'日常预览'}).count(),1);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'编辑主页',exact:true}).click();
  await page.getByRole('textbox',{name:'昵称',exact:true}).fill('快乐放映员');
  await page.getByRole('textbox',{name:'简介',exact:true}).fill('测试资料只在本次页面保存');
  await page.getByRole('button',{name:'选择panda头像'}).click();
  await page.getByRole('button',{name:'保存',exact:true}).click();
  assert.equal(await page.getByRole('heading',{name:'快乐放映员'}).count(),1);
  assert.match(await page.locator('.profile-avatar img').getAttribute('src'),/avatar-panda/);
  await page.getByRole('tab',{name:'作品',exact:true}).click();
  await page.getByRole('button',{name:'搜索主页作品'}).click();
  await page.getByRole('textbox',{name:'搜索当前分区作品'}).fill('02');
  assert.equal(await page.locator('.profile-tile').count(),1);
  await page.locator('.profile-tile').click();
  await page.waitForFunction(()=>document.querySelector('.meme-video')?.dataset.clipId.endsWith('-02')&&document.querySelector('.meme-video')?.readyState>=2);
  assert.equal(await page.locator('.profile-page').count(),0);
  assert.equal(await page.locator('.meme-video').count(),1);
  assert.equal(await page.locator('.camera-source').count(),1);
  assert.equal(await page.evaluate(()=>window.__cameraCalls),1);
  await page.getByRole('button',{name:'我',exact:true}).click();
  assert.equal(await page.getByRole('heading',{name:'快乐放映员'}).count(),1);
  await page.getByRole('button',{name:'关闭搜索',exact:true}).click();
  await page.getByRole('button',{name:'我的钱包',exact:true}).click();
  assert.equal(await page.getByRole('dialog',{name:'我的钱包'}).count(),1);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:/^消息/}).click();
  assert.equal(await page.locator('.conversation-row').count(),20);
  await page.getByRole('button',{name:'我',exact:true}).click();
  assert.equal(await page.getByRole('heading',{name:'快乐放映员'}).count(),1);
  assert.deepEqual(errors,[]);
  if(group==='kobe'){
   await page.setViewportSize({width:320,height:640});
   assert.ok(await page.locator('.profile-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth));
   await page.screenshot({path:'qa-results/profile-small.png'});
   await page.setViewportSize({width:1440,height:900});
   await page.screenshot({path:'qa-results/profile-desktop.png'});
   assert.ok(await page.locator('.stage').evaluate(el=>el.clientWidth<500));
  }
  console.log(`${group}: profile scroll, images, edit, tabs, search, catalog selection, messages and one camera/player PASS (${id})`);
  await page.close();
 }
}finally{await browser?.close();server.kill('SIGTERM');}
