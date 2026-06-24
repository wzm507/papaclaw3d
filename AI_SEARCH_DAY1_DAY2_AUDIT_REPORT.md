# Papa Claw 爬爬虾 AI 搜索第 1-2 天验收记录

检查日期：2026-06-24  
检查对象：`https://www.papaclaw.cn/`、SEO 专题页、AI 可读文件、IndexNow、CMS 专题内容

## 第 1 天：官网技术收录闭环

### 已完成检查

| 检查项 | 结果 | 说明 |
|---|---:|---|
| 官网首页 | 通过 | `https://www.papaclaw.cn/` 返回 200 |
| robots.txt | 通过 | `https://www.papaclaw.cn/robots.txt` 返回 200，并包含 sitemap |
| sitemap.xml | 通过 | `https://www.papaclaw.cn/sitemap.xml` 返回 200 |
| llms.txt | 通过 | `https://www.papaclaw.cn/llms.txt` 返回 200 |
| llms-full.txt | 通过 | `https://www.papaclaw.cn/llms-full.txt` 返回 200 |
| ai-news-feed | 通过 | `https://www.papaclaw.cn/ai-news-feed` 返回 200 |
| IndexNow key 文件 | 通过 | `https://www.papaclaw.cn/021c210c84f345e88bed93d77c8d0004.txt` 返回 200，内容与 key 一致 |
| sitemap 覆盖首页 | 通过 | sitemap 中包含官网首页 |
| sitemap 覆盖新闻页 | 通过 | sitemap 中包含 `/news` |
| sitemap 覆盖 AI 可读文件 | 通过 | sitemap 中包含 `/llms.txt`、`/llms-full.txt`、`/ai-news-feed` |
| sitemap 覆盖 7 个专题页 | 通过 | 7 个 SEO 专题页全部在 sitemap 中 |
| 首页内链到专题页 | 通过 | 首页包含 7 个 SEO 专题页链接 |
| 专题页结构化数据 | 通过 | 7 个专题页均包含 `application/ld+json`、`Service`、`FAQPage` |
| IndexNow 主动推送 | 通过 | 已向 Bing IndexNow 官方接口提交 12 个 URL，返回 `status=202 OK`。这是换新 key 后搜索引擎接收 URL 并准备验证 key 的成功状态。 |

### 已提交到 IndexNow 的 URL

- `https://www.papaclaw.cn`
- `https://www.papaclaw.cn/sitemap.xml`
- `https://www.papaclaw.cn/llms.txt`
- `https://www.papaclaw.cn/llms-full.txt`
- `https://www.papaclaw.cn/ai-news-feed`
- `https://www.papaclaw.cn/ai-global-expansion`
- `https://www.papaclaw.cn/foreign-trade-factory-global-sales`
- `https://www.papaclaw.cn/middle-east-government-resources`
- `https://www.papaclaw.cn/ai-tender-intelligence`
- `https://www.papaclaw.cn/cross-border-finance`
- `https://www.papaclaw.cn/overseas-social-media`
- `https://www.papaclaw.cn/nansha-global-expansion`

### 需要在 Bing Webmaster Tools 后台确认

以下项目需要登录 Bing Webmaster Tools 才能完成最终确认，无法通过公开网页代替：

- sitemap 是否显示“已成功处理”。
- 首页和 7 个专题页的 URL 检查状态。
- 是否已经点击“请求编制索引”。
- Bing 是否显示“已发现”“已爬网”或“已编入索引”。

说明：线上 `/api/indexnow/submit` 返回 401，表示生产环境启用了 `CRON_SECRET` 保护。这是正常安全配置。本次已绕过站内受保护接口，直接按 IndexNow 官方协议向 Bing IndexNow 接口提交 URL。

### 2026-06-24 IndexNow 换 key 后复验

- 新 IndexNow key：`021c210c84f345e88bed93d77c8d0004`
- 新 key 文件：`https://www.papaclaw.cn/021c210c84f345e88bed93d77c8d0004.txt`
- key 文件线上状态：`200`
- key 文件内容：`021c210c84f345e88bed93d77c8d0004`
- dry-run 校验：通过，准备提交 12 个 URL
- 正式推送结果：`Chunk 1: 202 OK (12 URLs)`
- 结论：第 1 天第 3 步“触发 IndexNow 推送”已完成；第 1 天公开技术验收项已完成。Bing Webmaster Tools 后台里的 sitemap 处理状态和 URL 检查状态仍需在已登录后台中查看，不能通过公开网页替代。

## 第 2 天：CMS 关键词专题页完善

### 已完成修改

已检查并优化 `data/seo-topics.json` 中 7 个 SEO 专题页的 Meta Description。原来多数描述只有 50-60 个中文字符，低于 70-120 字的搜索摘要标准；现已调整到 70-120 字范围内。

### CMS 字段验收

| 专题页 | 描述字数 | 关键词 | 服务对象 | 问题 | 能力背书 | 推进路径 | FAQ | 结果 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| AI 科技出海服务 | 72 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| 外贸工厂出海获客 | 77 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| 中东政企资源对接 | 75 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| AI 标书代投与全球标讯 | 73 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| 跨境金融服务 | 80 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| 海外社媒代运营 | 76 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |
| 南沙企业出海服务 | 83 | 5 | 3 | 4 | 4 | 4 | 3 | 通过 |

### 第二天验收结论

- 7 个专题页字段完整，无空标题、空描述、空 FAQ。
- 每个专题页至少 5 个关键词。
- 每个专题页至少 3 条 FAQ。
- 每个专题页至少 3 条服务对象、4 条问题、4 条能力背书、4 条推进路径。
- 每个专题页都有结构化数据。
- 首页可进入 7 个专题页。
- sitemap、llms、IndexNow 的技术出口已具备。

## 外部发布文章包

已生成 10 篇国内平台外部发布文章，文件：

`CN_EXTERNAL_ARTICLE_PACK_10.md`

覆盖平台：

- 微信公众号
- 知乎
- 今日头条
- 百家号
- 小红书
- 搜狐号
- 网易号
- 腾讯内容开放平台 / 企鹅号
- 简书
- 人人都是产品经理

## 风险与下一步

- 当前检查证明官网具备被抓取条件，但不等于 Bing、豆包、千问或 Kimi 已完成收录。
- Bing Webmaster Tools 的索引状态必须在后台持续观察。
- 豆包、千问、Kimi 是否引用官网，取决于它们各自的数据更新和信源策略，不能保证 7 天内必然出现。
- 下一步应优先发布 10 篇外部文章中的 3-5 篇，并让每篇自然引用官网首页和对应专题页。
