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

## 体验

进入 → 摄像头或示例 → 模拟扫描 → 随机标签 → 九种 meme 特效 → 可持续刷新的推荐 → 重置与作品解释。点赞和停留会影响后续推荐，已经看过的帖子保持不变；Explore 可主动切换模板。可以用滑动、滚轮、上下方向键切换帖子。点赞、预设评论、分享、个人资料、探索和系统消息均可互动。

更新需求：真实人脸关键点检测已加入。MediaPipe Face Landmarker 在浏览器检测脸的位置，进入推荐流后，将观众的脸实时合成到分身、歪嘴、猫、巨大帽衫、黄色恐龙、运动鞋鲨鱼、武侠酱板鸭、五官摇和退退退等效果中。微笑、张嘴和转头控制相应动画。**检测位置不等于识别个人，不根据长相推断人格。** 初始标签随机分配；否认和重置保留当次标签，但观众的点赞和停留会调整推荐。无脸时显示原摄像头与提示；模型不支持时可以切换到示例模式，完整作品流程仍然可用。

示例模式使用 AI 生成的虚构成年人物肖像，示例肖像不进行人脸跟踪。数字与评论是艺术中的虚构数据。音效默认为关闭，开启后使用合成语音和原创电子节奏，不采集麦克风。角色素材由内置 imagegen 生成；提示词见 docs/MEME_ASSETS.md。样片和贴图在 `public/media`，模型在 `public/vision`。

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

PR 自动检查。Meme browser QA 另外检查九种特效、持续刷动、点赞、Explore、重置、手机与桌面布局，并用虚构肖像生成的模拟摄像头运行真实人脸关键点模型；这不等同于每台物理摄像头的兼容性验证。`main` 更新触发 Pages 构建和发布。仓库拥有者需在 **Settings → Pages → Source** 选择 **GitHub Actions**。静态发布目录为 `dist/client`，Vite base 为 `/6311ass2/`；预计地址 https://anzu327.github.io/6311ass2/ ，只有部署成功后才算上线。

第一次部署若 Pages 未启用，启用后在 Actions 的 Publish artwork 工作流点击 Run workflow。不要把未通过检查的修改推送到 `main`。

## WIP

[作品说明](docs/CONCEPT.md) · [验收记录](docs/VALIDATION.md) · [截图](docs/wip/)

参考：
- [TikTok 推荐机制说明](https://newsroom.tiktok.com/how-tiktok-recommends-videos-for-you?lang=en)
- [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)
- [Vite GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)

本作品的看脸分类与反馈失效是艺术夸张，不是对 TikTok 实际人脸分析机制的事实描述。
