# FOR YOU

> Do platforms understand us, or construct us?

参考 TikTok / Douyin 的互动艺术作品，围绕「平台先定义你，再不断强化这个定义」。英文作品界面，中文开发文档。网络美学：Glitch；主题：算法凝视。

## 快速开发

推荐两人分别在本仓库点击 **Code → Codespaces → Create codespace on main**。

```bash
npm ci
npm run dev
```

在 Ports 面板打开 5173 的 HTTPS 预览。摄像头需要 HTTPS 或 localhost，并由观众主动允许；不申请麦克风权限。摄像头帧和人脸关键点不上传、不保存。`npm ci` 的 postinstall 会从 Google 官方下载模型并从 npm 包复制 WASM；发布时随网站打包，运行时从本网站加载，首次初始化较慢。需要安装时网络能访问 Google 官方模型地址。

## 体验

进入 → 摄像头或示例 → 模拟扫描 → 随机身份 → 六条逐步收窄的推荐 → 重置失败 → 作品解释。可以用滑动、滚轮、上下方向键切换帖子。点赞、预设评论、分享、个人资料、探索和系统消息均可互动。

更新需求：真实人脸关键点检测已加入。MediaPipe Face Landmarker 在浏览器检测脸的位置，柔和身份叠加腮红贴图，科技和文化身份叠加眼部扫描装饰。**检测位置不等于识别个人，不根据长相推断人格。** 标签随机分配；否认与重置都不改变当次身份。无脸时隐藏特效并提示；模型不支持时保留自拍和完整作品流程。

示例模式使用 AI 生成的虚构成年人物肖像，示例肖像不进行人脸跟踪。数字与评论是艺术中的虚构数据。样片和贴图在 `public/media`，模型在 `public/vision`。

## 两人分工

- 你：`feature/experience`，交互流程、摄像头、人脸特效。
- 搭档：`feature/feed-content`，编辑 `src/content.ts` 的三种身份、每种六条帖子、评论与叙事。
- 共同：字体、色彩、手机体验、WIP 展示。

仓库拥有者打开 **Settings → Collaborators → Add people**，输入搭档 GitHub 用户名，由搭档接受邀请。不要共享 GitHub 账号。两人各自的 Codespace、工作分支独立，提交后通过 Pull Request 合并，建议互相审阅。

```bash
git switch main
git pull --ff-only
git switch -c feature/feed-content
# 编辑后
git add src/content.ts
git commit -m "Refine feed narrative"
git push -u origin feature/feed-content
```

详细协作步骤见 [协作说明](docs/COLLABORATION.md)。Codespaces 的使用额度由各自账户承担，结束后停止环境。

## 检查与发布

```bash
npm run typecheck
npm test
npm run build
npm run test:sites
```

PR 自动检查。`main` 更新触发 Pages 构建和发布。仓库拥有者需在 **Settings → Pages → Source** 选择 **GitHub Actions**。静态发布目录为 `dist/client`，Vite base 为 `/6311ass2/`；预计地址 https://anzu327.github.io/6311ass2/ ，只有部署成功后才算上线。

第一次部署若 Pages 未启用，启用后在 Actions 的 Publish artwork 工作流点击 Run workflow。不要把未通过检查的分支直接合并。

## WIP

[作品说明](docs/CONCEPT.md) · [验收记录](docs/VALIDATION.md) · [截图](docs/wip/)

参考：
- [TikTok 推荐机制说明](https://newsroom.tiktok.com/how-tiktok-recommends-videos-for-you?lang=en)
- [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)
- [Vite GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)

本作品的看脸分类与反馈失效是艺术夸张，不是对 TikTok 实际人脸分析机制的事实描述。
