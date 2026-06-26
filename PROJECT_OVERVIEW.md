# Papa Claw 爬爬虾 — 项目全景梳理

> 生成时间：2026-06-26
> 基于 `E:\工作\papaclaw` 本地代码逐文件阅读 + `npm run build` 验证通过

---

## 一、项目定位

**Papa Claw 爬爬虾** 是一个面向 "AI 问答可发现优化" 的企业官网。

- 域名：`https://www.papaclaw.cn`
- 核心目标：让豆包、千问、Kimi、Bing 等问答/搜索 AI 能识别、引用公司信息
- 服务对象：实体外贸生产工厂、政府及政企出海项目
- 业务关键词：AI 科技出海、外贸工厂出海获客、中东政企资源、AI 标书代投、跨境金融、海外社媒、南沙企业出海

---

## 二、技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Next.js 14.2.35 (App Router) |
| 语言 | TypeScript 5.3 |
| 样式 | Tailwind CSS 3.4 + 自定义 CSS Variables |
| 动画 | GSAP 3.12 + ScrollTrigger + Lenis 平滑滚动 |
| 3D | React Three Fiber 8.15 + Three.js 0.160 + @react-three/drei |
| 动效库 | Framer Motion |
| 数据存储 | 本地 JSON 文件（开发）/ Vercel KV（生产） |
| 部署 | Vercel |
| 外部 API | 微信公众号已发布文章接口、OpenAI Responses API、Bing IndexNow |

---

## 三、根目录文件说明

| 文件 | 作用 |
|---|---|
| `package.json` | 项目依赖与脚本：`dev`/`build`/`start`/`lint`/`indexnow:submit` |
| `next.config.js` | Next.js 基础配置，`reactStrictMode: false`，图片域名空 |
| `tailwind.config.ts` | Tailwind 主题：颜色、字体、字号、圆角、动画 |
| `tsconfig.json` | TypeScript 配置，`@/*` 映射到根目录 |
| `vercel.json` | Vercel Cron：每天 16:00 同步新闻、16:10 推送 IndexNow |
| `postcss.config.js` | PostCSS：tailwindcss + autoprefixer |
| `.env.example` | 环境变量模板（站点 URL、微信、KV、OpenAI、CRON_SECRET、IndexNow） |
| `.gitignore` | 忽略 node_modules、.next、.env、大视频、performance-trace |
| `DESIGN.md` | 原始设计系统参考（Agence Foudre 风格，粉色系，现已被中文站覆盖） |
| `theme.css` / `variables.css` / `tokens.json` | 旧版设计 Token（当前主要用 globals.css 内的 Swiss Editorial Token） |
| `PapaClaw_AI问答可发现官网优化方案与项目表.md` | 项目总方案：目标、策略、5 阶段实施计划 |
| `AI_SEARCH_7_DAY_ACTION_PLAN.md` | 7 天搜索优化执行手册 |
| `AI_SEARCH_DAY1_DAY2_AUDIT_REPORT.md` | Day1/Day2 审计报告 |
| `BING_INDEXING_SETUP.md` | Bing 收录与 IndexNow 配置说明 |
| `NEWS_AUTOMATION_SETUP.md` | 微信公众号新闻自动同步说明 |
| `performance-trace*.json` | 旧性能trace文件，已被 gitignore |

---

## 四、App 路由与页面

### 4.1 前台页面

| 路由 | 文件 | 说明 |
|---|---|---|
| `/` | `app/page.tsx` | 首页，渲染 Hero/About/Pillars/Quote/Cases/Services/Audiences/News/FAQ/Footer，注入 Organization/FAQ/Service JSON-LD |
| `/[topic]` | `app/[topic]/page.tsx` | 7 个 SEO 专题动态页，生成 FAQPage + Service 结构化数据 |
| `/news` | `app/news/page.tsx` | 新闻列表，可按 SEO 专题分类筛选 |
| `/news/[slug]` | `app/news/[slug]/page.tsx` | 新闻详情，注入 Article + FAQPage 结构化数据 |
| `/llms.txt` | `app/llms.txt/route.ts` | AI 可读品牌简介 |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | 完整 AI 知识文件 |
| `/ai-news-feed` | `app/ai-news-feed/route.ts` | 纯文本新闻 Feed，供 AI 抓取 |
| `/sitemap.xml` | `app/sitemap.ts` | 动态 sitemap |
| `/robots.txt` | `app/robots.ts` | robots 配置 |

### 4.2 后台 CMS

| 路由 | 文件 | 说明 |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | 仪表盘，显示 10 个内容模块 + 发布按钮 |
| `/admin/login` | `app/admin/login/page.tsx` | 硬编码密码 `papaclaw2026` 登录 |
| `/admin/company` | `app/admin/company/page.tsx` | 企业信息、导航菜单、社交链接 |
| `/admin/hero` | `app/admin/hero/page.tsx` | 首页 Hero 配置 |
| `/admin/team` | `app/admin/team/page.tsx` | 团队管理 |
| `/admin/projects` | `app/admin/projects/page.tsx` | 案例/项目管理 |
| `/admin/expertises` | `app/admin/expertises/page.tsx` | 专业服务 |
| `/admin/process` | `app/admin/process/page.tsx` | 工作流程 |
| `/admin/why` | `app/admin/why/page.tsx` | 优势理由 |
| `/admin/faq` | `app/admin/faq/page.tsx` | 官网 FAQ |
| `/admin/footer` | `app/admin/footer/page.tsx` | 页脚配置 |
| `/admin/seo-topics` | `app/admin/seo-topics/page.tsx` | SEO 专题页管理 |
| `/admin/news` | `app/admin/news/page.tsx` | 新闻管理：手动新增、触发同步、查看日志 |
| `/admin/news-sources` | `app/admin/news-sources/page.tsx` | 公开新闻源管理 |

### 4.3 API 路由

| 路由 | 文件 | 说明 |
|---|---|---|
| `/api/config` | `app/api/config/route.ts` | 读写 `data/site-config.json` |
| `/api/seo-topics` | `app/api/seo-topics/route.ts` | 读写 SEO 专题，保存后自动 IndexNow 推送 |
| `/api/news` | `app/api/news/route.ts` | 新闻列表（支持 category 筛选）/ 删除 |
| `/api/news/manual` | `app/api/news/manual/route.ts` | 手动发布新闻，调用 OpenAI 优化，推送 IndexNow |
| `/api/news/sync` | `app/api/news/sync/route.ts` | 触发公开新闻源抓取（受 CRON_SECRET 保护） |
| `/api/news-sources` | `app/api/news-sources/route.ts` | 读写新闻源与抓取日志 |
| `/api/indexnow/submit` | `app/api/indexnow/submit/route.ts` | 收集全站 URL 提交 IndexNow（受 CRON_SECRET 保护） |
| `/api/upload` | `app/api/upload/route.ts` | 图片上传到 `public/uploads/` |
| `/api/publish` | `app/api/publish/route.ts` | 触发 `next build`（异步） |

---

## 五、核心组件与工具

### 5.1 UI 组件（`app/components/`）

| 文件 | 作用 |
|---|---|
| `Header.tsx` | 固定导航栏 + 全屏菜单 |
| `SmoothScrollProvider.tsx` | 全局 Lenis 平滑滚动包装 |
| `Section3DBackground.tsx` | 可复用的 Three.js 3D 背景（浮动几何体 + 粒子） |
| `Manifest3D.tsx` | 首页/品牌页专用 3D 场景（闪电形状 + 文字 + 粒子） |
| `Card3D.tsx` | 3D 倾斜卡片（当前未在前台直接使用） |
| `CursorSpotlight.tsx` | 鼠标跟随光晕 |
| `MagneticButton.tsx` | 磁性按钮效果 |
| `TextMarquee.tsx` | 文字跑马灯 |
| `AnimatedText.tsx` | 文字拆分进入动画 |
| `Reveal.tsx` | 滚动渐入动画包装 |
| `Counter.tsx` | 数字滚动计数器 |
| `Logo.tsx` | 字母逐个弹入 Logo |

### 5.2 Hooks（`app/hooks/`）

| 文件 | 作用 |
|---|---|
| `useSmoothScroll.ts` | 初始化 Lenis 并与 GSAP ScrollTrigger 同步 |
| `useMousePosition.ts` | 获取鼠标坐标 |

### 5.3 Sections（`app/sections/`）

| 文件 | 作用 |
|---|---|
| `Hero.tsx` | 首屏大标题 + 行动按钮 + 模式卡片 |
| `About.tsx` | 定位 + 数据统计（14 年 / ¥3 亿 / 6 人） |
| `Pillars.tsx` | 三大核心壁垒对比 |
| `Quote.tsx` | 创始人引言 |
| `Cases.tsx` | 6 个真实案例 |
| `Services.tsx` | 五大业务板块卡片 |
| `Audiences.tsx` | 四类客群话术切换 |
| `News.tsx` | 首页新闻预览（最多 4 条） |
| `FAQ.tsx` | 手风琴 FAQ |
| `Footer.tsx` | 页脚联系 + 导航 + 社交 + 版权 |

### 5.4 Lib（`app/lib/`）

| 文件 | 作用 |
|---|---|
| `seo-topics.ts` | SEO 专题 CRUD，支持 KV/本地 JSON 回退 |
| `news-store.ts` | 新闻文章 CRUD，支持 KV/本地 JSON 回退 |
| `news-types.ts` | 新闻相关 TypeScript 类型定义 |
| `news-sources.ts` | 新闻源与抓取日志 CRUD |
| `news-content.ts` | 新闻增强逻辑：HTML 清洗、分类、关键词、FAQ、slug 生成 |
| `public-news-crawler.ts` | 公开新闻源抓取器（RSS/HTML → 候选 → 全文 → 分类 → 发布） |
| `wechat-news.ts` | 微信公众号已发布文章同步 |
| `news-sync.ts` | 微信新闻同步封装（含 OpenAI 优化 + IndexNow 推送） |
| `openai-news-optimizer.ts` | 调用 OpenAI Responses API 生成 searchableTitle/aiSummary/keywords |
| `llms-content.ts` | 生成 `/llms.txt` 与 `/llms-full.txt` 内容 |
| `indexnow.ts` | IndexNow URL 提交逻辑 |
| `animations.ts` | GSAP 滚动/卡片倾斜/Logo 动画工具 |
| `utils.ts` | `cn()` 工具函数（clsx + tailwind-merge） |

### 5.5 后台组件（`app/admin/components/`）

| 文件 | 作用 |
|---|---|
| `AuthGuard.tsx` | localStorage token 鉴权守卫 |
| `Sidebar.tsx` | 后台侧边导航 |
| `SectionEditor.tsx` | 带保存/预览按钮的编辑页外壳 |
| `FieldEditor.tsx` | 通用表单字段（text/textarea/url/emoji） |
| `ListEditor.tsx` | 通用列表编辑器（增删改、上下移动） |
| `SaveButton.tsx` | 保存按钮含 loading 状态 |
| `ImageUploader.tsx` | 图片 URL/本地上传 |
| `ImagePreview.tsx` | 图片预览占位 |

---

## 六、数据文件（`data/`）

| 文件 | 作用 |
|---|---|
| `site-config.json` | 全站 CMS 内容：公司信息、Hero、团队、项目、服务、流程、优势、FAQ、页脚 |
| `seo-topics.json` | 7 个 SEO 专题完整配置 |
| `news.json` | 已发布新闻（当前为空数组 `[]`） |
| `news-sources.json` | 4 个默认公开新闻源（36氪出海、亿邦动力、EqualOcean、钛媒体） |
| `news-crawl-logs.json` | 抓取日志（当前仅 1 条钛媒体 404 失败记录） |

---

## 七、脚本与工具

| 文件 | 作用 |
|---|---|
| `scripts/indexnow-submit.mjs` | 读取 sitemap 并批量提交 URL 到 Bing IndexNow |

---

## 八、构建验证结果

```bash
cd E:\工作\papaclaw && npm run build
```

- ✅ 编译成功
- ✅ TypeScript / ESLint 通过
- ✅ 31 个页面生成成功
- ⚠️ 仅 1 个 ESLint Warning：`Card3D.tsx` 使用 `<img>` 而非 Next.js `<Image />`

生成路由预览：

- 首页 `/`
- 7 个 SEO 专题页 `/{slug}`
- 新闻列表 `/news`
- 新闻详情 `/news/[slug]`
- 后台 12 个 `/admin/*` 页面
- API 路由 10 个
- 静态路由：`/llms.txt` `/llms-full.txt` `/ai-news-feed` `/sitemap.xml` `/robots.txt`

---

## 九、待补充环境变量

根据 `.env.example`，以下变量尚未配置（本地无 `.env`）：

- `WECHAT_APP_SECRET`（微信公众号同步必需）
- `KV_REST_API_URL` / `KV_REST_API_TOKEN`（Vercel 生产持久化必需）
- `OPENAI_API_KEY`（新闻标题/摘要/关键词优化建议配置）
- `CRON_SECRET`（保护 `/api/news/sync` 和 `/api/indexnow/submit`）

---

## 十、关键业务逻辑

### 10.1 新闻同步流程

1. Vercel Cron 每天 16:00 调用 `/api/news/sync`
2. `syncPublicNews()` 读取 `news-sources.json`
3. 对每个启用的新闻源：
   - 抓取源页面
   - 解析 RSS/HTML 候选文章
   - 抓取每篇文章全文（< 500 字符不发布）
   - 根据内容自动匹配 SEO 专题
   - 生成摘要、关键词、FAQ
   - 可选调用 OpenAI 优化
4. 写入 `news-store`
5. 自动推送首页、新闻、专题页、Feed 到 IndexNow

### 10.2 CMS 保存流程

1. 后台页面通过 `/api/config` 读写 `site-config.json`
2. `/admin/seo-topics` 通过 `/api/seo-topics` 读写
3. 保存 SEO 专题后自动触发 IndexNow 推送

### 10.3 AI 可读文件

- `/llms.txt`：品牌简介 + 专题矩阵 + 新闻入口
- `/llms-full.txt`：完整官方知识文件，含实体信息、五大业务、专题详情、FAQ、新闻摘要
- `/ai-news-feed`：纯文本新闻 Feed

---

## 十一、已知问题 / TODO

1. `news.json` 当前为空，新闻中心暂无内容
2. `WECHAT_APP_SECRET` 未配置，微信自动同步不可用
3. `KV` 未配置，若部署到 Vercel 必须补上，否则写操作会报错
4. 4 个默认新闻源中有部分 URL（如钛媒体搜索页）可能返回 404/反爬，需要调整
5. `Card3D.tsx` 有 ESLint warning，可改用 `next/image`
6. 当前 `public/` 下仅 Bing/百度验证文件，无实际品牌图片资源

---

## 十二、常用命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 启动生产服务
npm start

# 手动提交全站 URL 到 IndexNow
SITE_URL=https://www.papaclaw.cn npm run indexnow:submit

# 手动触发微信同步（需配置 CRON_SECRET）
curl -X POST https://www.papaclaw.cn/api/news/sync \
  -H "Authorization: Bearer <CRON_SECRET>"
```
