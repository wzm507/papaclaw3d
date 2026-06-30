# Week 1-2 SEO 技术基础交付物完成记录

**完成日期：** 2026 年 6 月 26 日  
**执行团队：** software-papaclaw-seo  
**目标：** 完成 90 天 SEO 行动计划中 Week 1-2 的所有交付物

---

## 一、已完成的代码修改

### 1. 首页 SEO 元数据优化

**文件：** `app/layout.tsx`

| 元素 | 修改前 | 修改后 |
|---|---|---|
| 默认 Title | `Papa Claw爬爬虾｜不铺摊子，只铺结果` | `Papa Claw爬爬虾｜AI科技出海与政企资源落地服务商` |
| Description | 偏短，含营销口号 | 完整覆盖核心业务关键词和 CTA |
| Keywords | 11 个 | 15 个，增加长尾词 |
| Open Graph image | 无 | `/images/og-image.jpg`（1200x630） |
| Twitter Card | 无 | `summary_large_image` |
| Hreflang | 无 | `zh-CN` |

新增关键词包括：
- AI科技出海服务商
- 外贸工厂出海
- 海外社媒代运营
- 中东政企资源
- 南沙企业出海

### 2. OG 图片生成

**文件：** `public/images/og-image.jpg`

- 尺寸：1200x630
- 文件大小：约 49KB
- 内容：Papa Claw 爬爬虾品牌名 + 定位语 + Slogan + 官网 URL
- 配色：深蓝灰背景 + 金色强调线 + 白色文字
- 用途：Open Graph、Twitter Card、社交分享

### 3. 无效链接修复

**文件：** `data/site-config.json`

| 位置 | 修改前 | 修改后 | 说明 |
|---|---|---|---|
| `company.whatsappUrl` | `https://wa.me/` | `""` | 移除无效 WhatsApp 链接 |
| `header.whatsappUrl` | `https://wa.me/` | `""` | 同上 |
| `company.socialLinks.公众号` | `#` | `""` | 移除无效锚点 |
| `company.socialLinks.视频号` | `#` | `""` | 同上 |
| `company.socialLinks.LinkedIn` | `#` | `""` | 同上 |
| `footer.socialLinks.公众号` | `#` | `""` | 同上 |
| `footer.socialLinks.视频号` | `#` | `""` | 同上 |
| `footer.socialLinks.LinkedIn` | `#` | `""` | 同上 |
| `footer.legalLinks.隐私政策` | `#` | `/privacy` | 指向隐私政策页（待创建） |
| `footer.legalLinks.法律声明` | `#` | `/legal` | 指向法律声明页（待创建） |

> **注意：** 小红书链接 `https://www.xiaohongshu.com/` 保留，但建议后续替换为品牌官方主页。WhatsApp、公众号、视频号、LinkedIn 需要用户提供真实链接后替换。

### 4. BreadcrumbList 结构化数据

**新增文件：** `app/components/BreadcrumbJsonLd.tsx`

- 创建了可复用的 BreadcrumbList JSON-LD 组件
- 接受 `items: { name: string; url: string }[]` 参数
- 自动生成位置序号和 schema 标记

**已注入页面：**

| 页面 | 面包屑路径 |
|---|---|
| 首页 `/` | 首页 |
| 专题页 `/[topic]` | 首页 > 专题标题 |
| 新闻列表 `/news` | 首页 > 新闻中心 |
| 新闻详情 `/news/[slug]` | 首页 > 新闻中心 > 文章标题 |

### 5. IndexNow 推送验证

**Key 文件：** `public/021c210c84f345e88bed93d77c8d0004.txt`  
**Key 内容：** `021c210c84f345e88bed93d77c8d0004` ✅

**执行命令：**
```bash
node scripts/indexnow-submit.mjs
```

**结果：**
```
Chunk 1: 200 OK (21 URLs)
```

本次成功向 Bing IndexNow 提交了 21 个 URL，包括：
- 官网首页
- `/news`
- `/llms.txt`
- `/llms-full.txt`
- `/ai-news-feed`
- 7 个 SEO 专题页
- 11 篇新闻详情页

### 6. 构建验证

**执行命令：**
```bash
npm run build
```

**结果：** ✅ 构建成功
- 40 个静态页面生成成功
- 仅有一个 ESLint 警告（`Card3D.tsx` 使用原生 `<img>`，已在 Week 3-4 性能优化计划中）
- 无类型错误
- 无构建错误

---

## 二、需要在搜索引擎后台手动完成的步骤

虽然代码层面已经完成提交入口配置，但搜索引擎站长平台的注册和 sitemap 提交需要登录后台手动操作（或配置环境变量自动验证）。

### 百度站长平台

1. 访问：https://ziyuan.baidu.com/
2. 添加站点：`https://www.papaclaw.cn`
3. 选择验证方式（推荐 HTML 文件验证或 DNS 验证）
4. 验证成功后，进入「资源提交」→「Sitemap」
5. 提交：`https://www.papaclaw.cn/sitemap.xml`
6. 在「资源提交」→「普通收录」中手动提交首页和 7 个专题页 URL

### Bing Webmaster Tools

1. 访问：https://www.bing.com/webmasters
2. 添加站点：`https://www.papaclaw.cn`
3. 验证站点（推荐 HTML 文件验证）
4. 进入「Sitemaps」
5. 提交：`https://www.papaclaw.cn/sitemap.xml`
6. 进入「URL Inspection」，检查首页和专题页索引状态

### Google Search Console

1. 访问：https://search.google.com/search-console
2. 添加站点：`https://www.papaclaw.cn`
3. 验证站点
4. 进入「Sitemaps」
5. 提交：`https://www.papaclaw.cn/sitemap.xml`

---

## 三、需要用户补充的信息

以下链接当前被设置为空字符串，以避免搜索引擎追踪无效锚点。请提供真实链接后替换：

| 项目 | 当前值 | 需要补充 |
|---|---|---|
| WhatsApp | `""` | 真实 WhatsApp 号码，格式如 `https://wa.me/86138xxxxxxxx` |
| 公众号 | `""` | 公众号文章主页或二维码页面链接 |
| 视频号 | `""` | 视频号主页链接 |
| LinkedIn | `""` | LinkedIn Company Page 链接 |
| 小红书 | `https://www.xiaohongshu.com/` | 建议替换为品牌官方主页 |

> 补充方式：直接修改 `data/site-config.json` 中对应字段，然后重新部署。

---

## 四、下一步建议

Week 1-2 已完成后，建议立即进入 Week 3-4 的性能优化阶段：

1. **静态生成优化**：移除首页和专题页的 `export const dynamic = 'force-dynamic'`，改为 ISR
2. **图片优化**：将 Unsplash 外链图片迁移到本地，使用 Next.js `<Image>` 组件
3. **3D 效果降级**：在移动端禁用 Three.js 背景
4. **字体和预加载优化**

同时，搜索引擎站长平台的提交应尽快完成，以便爬虫尽快发现更新后的页面。

---

## 五、验收清单

- [x] 首页 Title/Description 优化完成
- [x] OG 图片生成并放入 public/images
- [x] Twitter Card 配置完成
- [x] Hreflang 配置完成
- [x] 社媒/联系链接中的 `#` 占位符已移除
- [x] BreadcrumbList 组件创建并在核心页面注入
- [x] IndexNow 推送验证成功（21 URLs, 200 OK）
- [x] Next.js 构建成功
- [x] 交付文档已创建
- [ ] 百度站长平台注册并提交 sitemap（需用户手动操作）
- [ ] Bing Webmaster Tools 注册并提交 sitemap（需用户手动操作）
- [ ] Google Search Console 注册并提交 sitemap（需用户手动操作）
- [ ] 提供真实 WhatsApp/社媒链接替换空字符串

---

**本交付物状态：** 代码部分完成，搜索引擎后台提交和外部链接补充需要用户配合。
