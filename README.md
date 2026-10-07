# FOR YOU

> Do platforms understand us, or construct us?

参考 TikTok / Douyin 的互动艺术作品，围绕「平台先定义你，再不断强化这个定义」。英文作品界面，中文开发文档。网络美学：Glitch；主题：算法凝视。

## 快速开发

优先使用本地 Codex 客户端连接本仓库的云端工作区，项目文件在云端编辑，不在电脑上克隆或编辑本地副本。下列命令由 GPT 在云端执行，启动后由 GPT 打开环境预览。Codespaces 可作为云端备选。

```bash
npm ci
npm run dev
```

使用云端环境提供的 HTTPS 预览；Codespaces 可在 Ports 面板打开 5173。摄像头需要 HTTPS 或 localhost，并由观众主动允许；不申请麦克风权限。摄像头帧和人脸关键点不上传、不保存。`npm ci` 的 postinstall 会从 Google 官方下载模型并从 npm 包复制 WASM；发布时随网站打包，运行时从本网站加载，首次初始化较慢。需要安装时网络能访问 Google 官方模型地址。

## 当前状态（2026-10-07）

用户已批准将其提供的多段原视频接入网页，采用比第一版大约52%的夸张大头比例。入口仍为：打开页面 → 抖歪1.5秒过场 → 自动进入短视频界面；没有新增欢迎、扫描或身份页。

未开摄像头或未识别到人脸时，对原片中央主角的头部打马赛克，不再使用虚构头像；主动允许摄像头后，将实时脸部和头发像素裁切、覆盖到中央主角。原身体、动作、后排人物、水印和音轨保留。画面完整contain显示，可暂停、开关声音、重播。摄像头和麦克风不会在开场自动申请；麦克风始终关闭。

当前有6条真实原视频：青海摇、蓝色妖姬跑步、社会摇、我要迪士尼、曹县、退退退。上下滑动切换，Explore可直接选择，播放完一圈后循环；Replay video只重播当前视频。旧被否定的特效库仍删除。本次是浏览器本地二维拼贴，不是无痕神经网络换脸；模型加载失败或找不到脸时显示明确状态及马赛克。摄像头帧不上传、不保存。性能和头发、遮挡边缘还需真实设备试玩。

## 两人协作

两人均可根据当前需求修改内容、界面、交互和特效，不设固定分工。每轮从最新 `main` 开始；同时修改同一文件时先约定范围。

仓库拥有者打开 **Settings → Collaborators → Add people**，输入搭档 GitHub 用户名，由搭档接受邀请。不要共享 GitHub 账号。两人各自使用云端环境。每次编辑完成并检查无误后，GPT 主动提交并推送到远程 `main`，不必再次提醒；推送前整合远程新提交，不强制覆盖。

每轮同步顺序：读取最新 `main` → 云端编辑 → 检查通过 → 提交本轮文件 → 正常推送到 `main` → 读回远程确认。已有未提交工作先保护；权限或分支保护阻止推送时明确报告。

详细协作步骤见 [协作说明](docs/COLLABORATION.md)。设计内容、本地客户端与云端编辑流程，以及可复制给搭档 GPT 的指令见 [设计与 Codex 交接](docs/DESIGN_AND_CODEX_HANDOFF.md)。Codespaces 的使用额度由各自账户承担，结束后停止环境。

## 检查与发布

```bash
npm run typecheck
npm test
npm run build
npm run test:sites
```

PR 自动检查。浏览器检查验证完整原片、示例头像、摄像头脸部/头发裁切、找不到脸切换马赛克、恢复、暂停/音频/导航/弹窗/重播，以及停止摄像头与不上传画面；模拟摄像头验证不等同于每台物理摄像头的兼容性验证。`main` 更新触发 Pages 构建和发布。仓库拥有者需在 **Settings → Pages → Source** 选择 **GitHub Actions**。静态发布目录为 `dist/client`，Vite base 为 `/6311ass2/`；预计地址 https://anzu327.github.io/6311ass2/ ，只有部署成功后才算上线。

第一次部署若 Pages 未启用，启用后在 Actions 的 Publish artwork 工作流点击 Run workflow。不要把未通过检查的修改推送到 `main`。

## WIP

[作品说明](docs/CONCEPT.md) · [验收记录](docs/VALIDATION.md) · [截图](docs/wip/)

参考：
- [TikTok 推荐机制说明](https://newsroom.tiktok.com/how-tiktok-recommends-videos-for-you?lang=en)
- [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)
- [Vite GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)

本作品的看脸分类与反馈失效是艺术夸张，不是对 TikTok 实际人脸分析机制的事实描述。


所有6条都有音轨；点扬声器按钮开启原声。默认静音是浏览器自动播放限制，开启后切换视频保留声音选择。首次摄像头开关和QR链接不变。
