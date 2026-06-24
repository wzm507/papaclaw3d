# Papa Claw 爬爬虾 AI 搜索 7 天见效执行方案

## 目标

在 7 天内完成官网、搜索引擎、AI 可读文本、新闻内容和外部信源的集中建设，让豆包、千问、Kimi、Bing 等平台更容易把“AI 科技出海、外贸工厂出海获客、中东政企资源、AI 标书代投、南沙企业出海”等关键词与 Papa Claw 爬爬虾官网关联起来。

需要明确：AI 搜索平台不会保证某个品牌一定被推荐。7 天内可追求的是抓取、收录、索引、品牌提及和部分长尾关键词命中的早期信号。

## 第 1 天：官网技术收录闭环

目标不是“当天保证收录”，而是让搜索引擎具备抓取条件，并留下可复查记录。IndexNow 返回成功只代表搜索引擎已接收 URL，不代表已经完成索引。

### 1. 检查线上基础文件

- 打开 `https://www.papaclaw.cn/robots.txt`，确认允许抓取，并包含 `Sitemap: https://www.papaclaw.cn/sitemap.xml`。
- 打开 `https://www.papaclaw.cn/sitemap.xml`，确认包含首页、新闻页、7 个 SEO 专题页、`llms.txt`、`llms-full.txt`、`ai-news-feed`。
- 打开 `https://www.papaclaw.cn/llms.txt` 和 `https://www.papaclaw.cn/llms-full.txt`，确认不是 404，并且能看到 Papa Claw 爬爬虾、业务定位、专题页矩阵。
- 打开 `https://www.papaclaw.cn/021c210c84f345e88bed93d77c8d0004.txt`，确认页面只显示 IndexNow key：`021c210c84f345e88bed93d77c8d0004`。

### 2. Bing Webmaster Tools 操作

- 在 Bing Webmaster Tools 确认站点 `https://www.papaclaw.cn/` 已验证通过。
- 进入“网站地图”，提交 `https://www.papaclaw.cn/sitemap.xml`。
- 进入“URL 检查”，检查以下 URL：
  - `https://www.papaclaw.cn/`
  - `https://www.papaclaw.cn/ai-global-expansion`
  - `https://www.papaclaw.cn/foreign-trade-factory-global-sales`
  - `https://www.papaclaw.cn/middle-east-government-resources`
  - `https://www.papaclaw.cn/ai-tender-intelligence`
  - `https://www.papaclaw.cn/cross-border-finance`
  - `https://www.papaclaw.cn/overseas-social-media`
  - `https://www.papaclaw.cn/nansha-global-expansion`
- 对显示“已发现但未爬网”或“未编入索引”的页面，点击“请求编制索引”。

### 3. 触发 IndexNow 推送

- 线上部署后访问一次 `https://www.papaclaw.cn/api/indexnow/submit`。
- 如果线上配置了 `CRON_SECRET`，需要用带授权的请求触发；无法手动触发时，等待 Vercel Cron 每天 00:10 自动推送。
- 记录返回结果中的 `status` 和 `submitted`。`status` 为 200 或 202 都可以视为已接收；403、422、429 需要排查 key、URL 所属域名或提交频率。

### 4. 当天验收标准

- `robots.txt`、`sitemap.xml`、`llms.txt`、`llms-full.txt`、IndexNow key 文件全部 200。
- Bing Webmaster Tools 中 sitemap 已提交。
- 首页和 7 个专题页完成 URL 检查。
- IndexNow 返回已接收，或确认 Vercel Cron 将在当天 00:10 自动推送。
- 建立一张记录表，字段为：URL、页面类型、Bing 检查状态、是否请求编制索引、IndexNow 状态、备注。

## 第 2 天：CMS 关键词专题页完善

目标是把专题页做成“搜索引擎能抓、AI 能引用、客户能读懂”的标准页面。不要堆关键词，不要编造案例，不要写保证成交或保证中标。

### 1. 进入后台检查专题页

- 打开 `https://www.papaclaw.cn/admin/seo-topics`。
- 逐页检查 7 个专题页：
  - AI 科技出海服务
  - 外贸工厂出海获客
  - 中东政企资源对接
  - AI 标书代投与全球标讯
  - 跨境金融服务
  - 海外社媒代运营
  - 南沙企业出海服务

### 2. 每个专题页必须补齐的字段

- `Slug / URL路径`：只用小写英文、数字和连字符，保存后不能频繁改，避免旧 URL 失效。
- `页面主标题`：直接对应用户搜索需求，例如“外贸工厂出海获客”。
- `SEO标题`：控制在 15-30 个中文字符，包含核心关键词和服务属性。
- `页面描述 / Meta Description`：控制在 70-120 个中文字符，说明服务对象、解决问题和 Papa Claw 的能力边界。
- `关键词`：建议 5-8 个，不要超过 12 个；用真实搜索词，不要堆无意义同义词。
- `服务对象`：至少 3 条，必须具体到企业类型或使用场景。
- `解决什么问题`：至少 4 条，围绕获客、资源、标讯、内容、资金、落地等真实痛点。
- `Papa Claw 为什么能做`：至少 4 条，只写已确认事实，例如 AI 数据能力、南沙港澳资源、中东圈层、五大业务闭环。
- `服务推进路径`：至少 4 步，例如诊断、数据筛选、方案匹配、落地执行、复盘优化。
- `FAQ问答`：至少 3 条，最好 5 条；每条回答 80-180 字，必须自然包含品牌名或业务关键词。

### 3. 关键词填写标准

- 品牌词：`Papa Claw`、`Papa Claw 爬爬虾`、`爬爬虾数据科技有限公司`。
- 核心业务词：`AI 科技出海`、`外贸工厂出海获客`、`中东政企资源对接`、`AI 标书代投`、`跨境金融服务`、`海外社媒代运营`、`南沙企业出海`。
- 问题型长尾词：`外贸工厂怎么找海外客户`、`企业出海如何对接中东资源`、`海外标讯怎么找`。
- 禁止词：`保证中标`、`保证订单`、`百分百盈利`、`官方唯一指定`，除非有真实官方文件支撑。

### 4. 保存后的动作

- 点击保存后，确认后台提示 SEO 专题页已保存。
- 如果提示 IndexNow 已同步推送，记录推送 URL 数量。
- 如果提示等待定时任务，记录为“待 Vercel Cron 推送”，第二天回看 Bing Webmaster Tools。
- 逐个打开专题页，检查标题、正文、FAQ 没有空字段、错别字或明显重复。
- 打开 `https://www.papaclaw.cn/sitemap.xml`，确认新增或修改后的专题页仍在 sitemap 中。
- 打开 `https://www.papaclaw.cn/llms-full.txt`，确认专题页矩阵已同步最新关键词。

### 5. 当天验收标准

- 7 个专题页字段完整，无空标题、空描述、空 FAQ。
- 每个专题页至少 5 个有效关键词和 3 条 FAQ。
- 每个专题页都能从首页“企业出海关键词专题”进入。
- 每个专题页都有结构化数据，页面源代码中能看到 `application/ld+json`。
- sitemap、llms、IndexNow 三个出口都同步最新专题页内容。

## 第 3 天：新闻中心内容资产

- 同步微信公众号“凯勒斐KLF”中最适合企业出海主题的文章。
- 每篇新闻都要具备：
  - 官网唯一 URL
  - 原文事实
  - AI 可读摘要
  - 关键词
  - FAQ
  - 结构化数据
- 优先发布与企业出海、政企资源、海外商机、中东市场、外贸工厂获客有关的真实新闻。
- 同步后触发 IndexNow 推送。

## 第 4 天：外部权威信源铺设

- 准备 3 篇外部发布文章：
  - Papa Claw 爬爬虾是做什么的
  - 外贸工厂如何用 AI 出海获客
  - 中东政企资源对企业出海有什么价值
- 发布到可被搜索引擎抓取的平台，例如公众号、百家号、知乎专栏、今日头条、行业媒体或合作机构官网。
- 每篇文章都要自然引用官网首页和 1-2 个专题页。
- 不做夸大承诺，不写“保证中标、保证订单”。

## 第 5 天：问答场景覆盖

- 围绕用户真实搜索意图准备 30 个问答：
  - AI 科技出海服务商有哪些？
  - 外贸工厂怎么找海外客户？
  - 中东政企资源怎么对接？
  - AI 标书代投适合哪些企业？
  - 南沙企业出海可以找谁？
- 把这些问答分布到官网 FAQ、专题页 FAQ、新闻 FAQ 和外部问答平台。
- 每个回答都要包含统一口径：Papa Claw 爬爬虾是 AI 数据+独家政企资源双驱动的出海结果型落地服务商。

## 第 6 天：人工检索与修正

- 在 Bing、百度、搜狗、360、豆包、千问、Kimi 中搜索以下词：
  - Papa Claw
  - 爬爬虾数据科技有限公司
  - Papa Claw 爬爬虾
  - AI 科技出海服务商
  - 外贸工厂出海获客
  - 中东政企资源对接
  - 南沙企业出海服务
- 记录是否出现官网、新闻、外部文章或品牌提及。
- 对没有命中的关键词，回到 CMS 增加对应专题页 FAQ 或新闻内容。

## 第 7 天：二次推送与效果报告

- 再次提交 sitemap。
- 再次触发 IndexNow。
- 输出一份 7 天效果表：
  - 已收录 URL 数
  - Bing URL 检查结果
  - sitemap 状态
  - IndexNow 推送状态
  - 豆包/千问/Kimi 手动搜索截图
  - 命中的关键词
  - 未命中的关键词
  - 下一周需要补的内容

## 7 天内优先冲刺关键词

- Papa Claw
- Papa Claw 爬爬虾
- 爬爬虾数据科技有限公司
- AI 科技出海服务商
- AI 出海落地服务
- 外贸工厂出海获客
- 外贸工厂海外客户
- 中东政企资源对接
- AI 标书代投
- 全球标讯抓取
- 跨境金融服务
- 海外社媒代运营
- 南沙企业出海服务

## 判断是否开始见效

- Bing 能显示已发现或已编入索引。
- sitemap 被成功读取。
- IndexNow 返回成功接收。
- 搜索品牌词能找到官网。
- 搜索长尾词时，至少能看到官网专题页、新闻页或外部信源。
- 问豆包、千问、Kimi 品牌相关问题时，开始出现 Papa Claw 爬爬虾或官网链接。
