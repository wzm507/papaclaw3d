# Papa Claw 瑞士编辑极简风格迁移计划

## 背景与目标

`/preview` 路由已完成瑞士编辑极简风格的视觉验证：Hero 动画、数字滚动、滚动渐显、直角细线网格、暖灰配色均已可用。当前任务是将这套确认后的设计同步迁移到主站首页 (`/`)、新闻页 (`/news/*`)，并统一 admin 后台视觉。

## 推荐方案：主干替换 + 可回滚

不保留 `/preview` 作为并行路由。将 preview 的视觉层、组件结构、设计令牌合并到主站，完成后删除 `/preview` 目录。迁移前应在 Git 分支上进行，便于回滚。

核心约束：
- 保持 `app/page.tsx` 为 Server Component，直接读取 `data/site-config.json` 并注入 JSON-LD。
- 保持 `/api/config` 读写逻辑不变，admin 保存后首页能立即读到最新配置。
- 保持 `app/lib/news-store.ts` 新闻数据流不变。
- 只改视觉层，不动 admin 业务逻辑、鉴权、表单处理。

## 关键文件清单

### 必须修改
- `app/globals.css`：合并 preview 设计令牌与工具类
- `app/layout.tsx`：保持全局 CSS 导入，无需引用 preview 样式
- `app/page.tsx`：重写首页结构，使用新 sections
- `app/components/Header.tsx`：替换为 preview 风格导航
- `app/components/AnimatedText.tsx`：对齐 preview 实现
- `app/components/Reveal.tsx`：对齐 preview 实现
- `app/components/Counter.tsx`：对齐 preview 实现
- `app/sections/Hero.tsx`：基于 `PHero`
- `app/sections/About.tsx`：基于 `PAbout`
- `app/sections/Pillars.tsx`：基于 `PPillars`
- `app/sections/Quote.tsx`：基于 `PQuote`
- `app/sections/Cases.tsx`：基于 `PCases`
- `app/sections/Services.tsx`：基于 `PServices`
- `app/sections/Audiences.tsx`：基于 `PAudiences`
- `app/sections/News.tsx`：基于 `PNews`
- `app/sections/FAQ.tsx`：基于 `PFAQ`
- `app/sections/Footer.tsx`：基于 `PFooter`
- `app/news/page.tsx`：新闻列表页改用新设计系统
- `app/news/[slug]/page.tsx`：新闻详情页改用新设计系统

### 建议同步修改（admin 视觉统一）
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/components/Sidebar.tsx`
- `app/admin/components/SectionEditor.tsx`
- `app/admin/components/FieldEditor.tsx`
- `app/admin/components/ListEditor.tsx`
- `app/admin/components/SaveButton.tsx`

### 迁移完成后删除
- `app/preview/` 整目录
- `app/preview/globals-preview.css`

## 设计令牌处理

将 `app/preview/globals-preview.css` 的内容提升到 `app/globals.css`，解除 `.preview-root` 作用域，让新设计令牌和 `.p-*` 工具类全局生效。

具体做法：
1. 把 CSS 变量 `--p-canvas`、`--p-paper`、`--p-warm`、`--p-ink`、`--p-muted`、`--p-accent`、`--p-lime`、`--p-rule` 提升到 `:root`。
2. 把 `.p-section`、`.p-inner`、`.p-display`、`.p-heading-*`、`.p-body*`、`.p-btn*`、`.p-chip` 等工具类复制到全局 `@layer components`。
3. 保留现有 Tailwind 颜色配置（`pale-canvas`、`deep-forest`、`foudre-pink`、`ash-whisper` 等），它们与 preview 色值对应，admin 与新闻页可继续使用。
4. 新组件统一使用直角、1px 细线风格，不使用旧 Tailwind 的圆角 token。

## 组件迁移说明

### 首页 Sections
- 全部改为 `'use client'` 组件，保留 GSAP + ScrollTrigger 动画。
- `Hero`：硬编码瑞士文案主标题，副标题从 `config.hero` 读取。
- `About`、`Pillars`、`Cases`、`Services`、`Audiences`、`Quote`：直接基于 preview 硬编码文案迁移，保证视觉效果。
- `News`、`FAQ`、`Footer`：从 `config` 和 `newsArticles` 接收 props。
- `Header`：基于 `PHeader`，移除 preview 顶部横幅，菜单锚点保持与 section ID 一致。

### 首页 page.tsx
- 保持 async Server Component。
- 直接 `fs.readFileSync` 读取 `data/site-config.json`。
- 生成 Organization、FAQPage、ItemList 三段 JSON-LD。
- 引入新 sections 并传入对应 props。
- 外层保留 `<SmoothScrollProvider>`，移除 `CursorSpotlight`。

### 新闻页
- `app/news/page.tsx`：保留 `listNewsArticles()` 和 `listSeoTopics()` 数据流，列表改用瑞士风格网格卡片。
- `app/news/[slug]/page.tsx`：保留 `getNewsArticle()`、JSON-LD、metadata，详情布局改为瑞士编辑风格。

### Admin 后台（可选但建议）
- 只改 className，不改业务逻辑。
- 登录页：深色背景 + 白色直角卡片。
- 侧边栏：`#0F1C1A` 背景，激活态白底黑字直角块。
- 编辑器组件：圆角改直角或近似直角，边框用 `ash-whisper`，主按钮用 `deep-forest` / `foudre-pink` hover。

## 执行步骤

1. **代码基线保护**：提交当前变更，切出 `feature/swiss-editorial-migration` 分支。
2. **合并设计令牌**：将 `globals-preview.css` 合并到 `globals.css`，移除 `.preview-root` 作用域。
3. **统一动画基础组件**：用 preview 版本更新 `AnimatedText`、`Reveal`、`Counter`。
4. **重写首页 Sections**：将 `app/preview/sections/` 迁移到 `app/sections/`，重写 `Header`。
5. **重写首页 page.tsx**：使用新 sections，保持 Server Component 和 JSON-LD。
6. **重写新闻页**：列表页和详情页应用新设计系统。
7. **Admin 视觉统一**（可选）：修改 admin 布局、登录页、编辑器组件样式。
8. **清理 preview 路由**：删除 `app/preview/` 目录。
9. **构建与验证**：`npm run build`、`npm run dev`，逐项验证。

## 验证清单

- [ ] `npm run build` 无 TypeScript / ESLint 错误。
- [ ] 首页源码包含 Organization、FAQPage、ItemList 三段 JSON-LD。
- [ ] Header 滚动背景变化、移动端菜单动画正常。
- [ ] Lenis 平滑滚动无报错。
- [ ] `/news` 分类筛选正常，`/news/[slug]` 详情页渲染正常。
- [ ] `/admin/login` 能登录，各配置页保存后首页可见更新。
- [ ] 响应式在 375px / 768px / 1440px 下无错位。
- [ ] `prefers-reduced-motion` 下动画被抑制。

## 风险与应对

| 风险 | 应对 |
|---|---|
| preview section 硬编码内容与 admin 配置脱节 | 先保证视觉迁移；后续再扩展 `site-config.json` 增加 cases/audiences/quote 等字段和对应 admin 页。 |
| GSAP class 选择器冲突 | 确保 `.p-hero-line`、`.p-case-row` 等选择器全局唯一。 |
| 删除旧 3D/磁吸组件影响其他页面 | 这些组件主要在首页使用，迁移后不再引入；如需保留，可先移动到 `app/components/_legacy/`。 |
| Admin 视觉改动破坏表单验证或保存 | 只修改 className，不修改 onChange / onSave / AuthGuard 逻辑；改完逐项测试保存。 |
