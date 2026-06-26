# Papa Claw 爬爬虾 — 项目长期记忆

## 项目概述
- Next.js 14 企业官网，部署在 Vercel，域名 www.papaclaw.cn
- 核心目标：AI 问答可发现优化（让豆包/千问/Kimi 等问答 AI 能识别和引用公司信息）
- 技术栈：Next.js 14 + React 18 + TypeScript + Tailwind 3 + GSAP + Three.js
- 数据存储：Vercel KV (Upstash Redis)
- CMS 后台：/admin 路由，可编辑公司信息/FAQ/专题页/新闻源

## 关键路由
- `/` — 首页（含 3D 卡片效果 + GSAP 滚动动画）
- `/brand-manual` — 品牌手册页（纯编辑风格，无 3D，IntersectionObserver 动画）
- `/[topic]` — 7 个 SEO 专题动态页
- `/news` + `/news/[slug]` — 新闻中心
- `/admin` — CMS 后台
- `/llms.txt` + `/llms-full.txt` — AI 可读知识文件
- `/ai-news-feed` — AI 纯文本新闻源
- `/api/news/sync` — 微信新闻同步接口
- `/api/indexnow/submit` — IndexNow 推送接口

## 实施进度
- 阶段一、二完成（官网中文化 + 抓取基础建设）
- 阶段三部分完成（7专题页+新闻中心上线，FAQ 只有7条，目标20-30条）
- 阶段四部分完成（19篇外部文章已写好，尚未发布）
- 阶段五未开始（每周AI问答监测）
- 待补环境变量：WECHAT_APP_SECRET、KV、OPENAI_API_KEY、CRON_SECRET

## 设计系统
- 配色：pale-canvas(#f5f5f7) / deep-forest(#111) / foudre-pink(#0071e3) / slate-tint(#6e6e73)
- 字体：Inter + PingFang SC + Microsoft YaHei
- Tailwind 自定义 fontSize: display / heading-lg / heading / subheading / body / caption
