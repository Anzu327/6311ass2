import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5176','--strictPort'],{stdio:'ignore'});
const base='http://127.0.0.1:5176/6311ass2/';let browser;
try{
 for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_PATH?{executablePath:process.env.QA_CHROMIUM_PATH}:{})});
 for(const group of ['nailong','lulu','huge','kobe']){
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('QA denied','NotAllowedError');};});
  await page.goto(base+'?demo='+group);await page.getByRole('button',{name:'跳过扫描进入推荐'}).click({timeout:15000});
  const open=()=>page.getByRole('button',{name:'打开评论区'}).click(),close=()=>page.getByRole('button',{name:'关闭评论区'}).click();
  const select=async(index)=>{await page.getByRole('button',{name:'视频合集',exact:true}).click();await page.locator('.dialog .clip-list button').nth(index).click();};
  await open();const rows=page.locator('.comments-scroll > .comment-row');assert.equal(await rows.count(),22);
  const original=await rows.locator(':scope > .comment-main > .comment-text').allTextContents();
  assert.ok(await page.locator('.comments-scroll').evaluate(x=>x.scrollHeight>x.clientHeight));
  await rows.first().getByRole('button',{name:'展开 3 条回复',exact:true}).click();assert.equal(await rows.first().locator('.nested').count(),3);
  await rows.first().locator('.comment-votes button').first().click();
  await page.getByRole('textbox',{name:'写评论'}).fill('只属于第一条视频的测试留言');await page.getByRole('button',{name:'发送评论'}).click();assert.equal(await rows.count(),23);
  await close();await select(1);await open();assert.equal(await rows.count(),22);
  const second=await rows.locator(':scope > .comment-main > .comment-text').allTextContents();assert.notDeepEqual(second,original);assert.ok(second.filter(x=>!original.includes(x)).length>=5,'Different video has substantially different comments');
  assert.equal(await page.getByText('只属于第一条视频的测试留言',{exact:true}).count(),0);
  await close();await select(0);await open();assert.equal(await rows.count(),23);assert.equal(await rows.first().locator('.comment-text').innerText(),'只属于第一条视频的测试留言');
  assert.deepEqual((await rows.locator(':scope > .comment-main > .comment-text').allTextContents()).slice(1),original);
  assert.deepEqual(errors,[]);await page.close();console.log(`${group}: 22 varied scrollable comments, replies, voting, per-video posting and stable return PASS`);
 }
}finally{await browser?.close();server.kill('SIGTERM');}
