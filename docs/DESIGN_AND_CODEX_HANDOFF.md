
# FOR YOU：设计与 Codex 协作交接

更新：2026-10-06。仓库：[Anzu327/6311ass2](https://github.com/Anzu327/6311ass2)。以最新 main 和 AGENTS.md 为准。

## 本轮体验
保持英文 TikTok 风格界面、桌面居中竖屏和手机全屏安全区。进入摄像头或示例模式，模拟扫描后得到随机标签，再进入可持续刷新的 meme 流。第一轮九种效果各不相同：分身、歪嘴战神、猫、巨大帽衫、黄色恐龙、运动鞋鲨鱼、武侠酱板鸭、五官摇和退退退。

三种身份 ID 保留为 soft、tech、culture，分别显示 CAT PERSON、MAIN CHARACTER、CERTIFIED WEIRDO。它们是艺术中的虚构分类，不根据用户长相推断。旧版固定六条推荐的规则已被本轮要求取代。

点赞和停留影响之后生成的帖子；已经看过的帖子保持稳定。上下滑动、滚轮、方向键和切换按钮均能浏览，返回不会重新随机生成帖子。Explore 可以主动挑选模板。Reset my feed 保留当次标签并进入反思结尾，Start again 清空本轮状态。

## 摄像头与素材
摄像头必须由观众主动开启，不请求麦克风，不上传或保存画面和关键点。MediaPipe 在浏览器检测脸与表情，用于贴合、微笑、张嘴和转头反馈；切换帖子不重新加载模型。无人脸时显示原画面并提示，失败时可通过顶部 LIVE 开关切换到示例模式。示例使用原有 AI 虚构肖像和预设裁切，模拟表情运动，不宣称识别真人。

五个角色素材由内置 imagegen 生成，位于 public/media/meme-*.webp，提示词见 MEME_ASSETS.md。音效默认关闭，开启时使用合成语音及原创电子节奏。

## 源文件
- src/content.ts：三种身份。
- src/memes.ts：九种模板、推荐选择和偏好数据。
- src/experience.ts：阶段、帖子历史、点赞和停留反馈。
- src/App.tsx、src/styles.css：现有应用界面与交互。
- src/FaceEffects.tsx：一次加载模型、追踪和逐帧绘制。
- src/memeRenderer.ts：人脸裁切、角色合成和动画。
- src/useMemeSound.ts：可关闭的声音。
- scripts/check-meme-browser.mjs：云端浏览器检查与样例截图。

保持 .openai/hosting.json、worker/index.js、scripts/prepare-sites-build.mjs、tests/sites-worker.test.mjs 完整。

## 云端协作与交付
两位搭档都能修改内容、界面、交互及特效，不固定分工。优先使用 Codex 云端工作区或 Codespaces，不在电脑上克隆和编辑本仓库。仅有 GitHub 连接器时可在云端准备源文件，通过 PR 的 Actions 检查，然后合并 main；不能把未检查的源码直接推到 main。

每轮先读最新 main，保护已有工作和搭档提交。推送或合并前再次确认远程更新；发现变化时整合后重新检查。禁止强制覆盖。完成后主动同步 main，并读回确认真实提交和发布状态。

现有 Check artwork 执行 typecheck、单元测试、build、test:sites。Meme browser QA 检查九种效果、无限导航、点赞、Explore、重置、手机／桌面布局，并用虚构肖像构成的模拟摄像头运行真实人脸模型。它没有替代物理设备的最终课堂试玩。

GitHub Pages 使用 GitHub Actions，发布目录 dist/client，base /6311ass2/。main 更新后自动发布；以工作流成功和实际页面结果为准。
