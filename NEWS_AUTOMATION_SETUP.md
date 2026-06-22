# Papa Claw 新闻自动化上线说明

本文用于把“凯勒斐KLF”微信公众号文章自动同步到 Papa Claw 爬爬虾官网新闻中心，并生成可被搜索引擎、豆包、千问、Kimi 等问答类 AI 读取的公开文本。

## 已完成的官网能力

- 新闻列表页：`/news`
- 新闻详情页：`/news/[slug]`
- 新闻列表接口：`/api/news`
- 手动/定时同步接口：`/api/news/sync`
- AI 可读新闻文本：`/ai-news-feed`
- Sitemap 动态收录：`/sitemap.xml`
- AI 知识文件入口：`/llms.txt`、`/llms-full.txt`
- Vercel Cron：每天北京时间 00:00 自动请求 `/api/news/sync`

## 同步流程

1. Vercel Cron 在每天北京时间 00:00 触发 `/api/news/sync`。
2. 同步接口使用微信公众号 AppID 和 AppSecret 获取 `access_token`。
3. 调用微信公众号已发布文章接口读取文章标题、链接、发布时间、HTML 正文。
4. 官网保留文章正文事实，清洗 HTML，生成纯文本内容。
5. 如配置 `OPENAI_API_KEY`，系统会生成更适合搜索和问答类 AI 抓取的标题、摘要和关键词。
6. 文章写入 Vercel KV，并自动出现在 `/news`、`/news/[slug]`、`/ai-news-feed` 和 sitemap 中。

## Vercel 环境变量

在 Vercel Project Settings -> Environment Variables 中配置：

| 变量名 | 用途 | 是否必填 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 官网正式域名，例如 `https://www.papaclaw.com` | 是 |
| `WECHAT_APP_ID` | 微信公众号 AppID，当前为 `wx4331c2eca38d85e7` | 是 |
| `WECHAT_APP_SECRET` | 微信公众号 AppSecret | 是 |
| `WECHAT_ACCOUNT_NAME` | 公众号名称，当前为 `凯勒斐KLF` | 是 |
| `WECHAT_ORIGINAL_ID` | 公众号原始 ID，当前为 `gh_9bf649b358fa` | 是 |
| `WECHAT_SYNC_LIMIT` | 每次同步文章数量，建议 `20` | 否 |
| `KV_REST_API_URL` | Vercel KV / Upstash Redis REST URL | 是 |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash Redis REST Token | 是 |
| `OPENAI_API_KEY` | 用于生成 AI 可读标题、摘要、关键词 | 建议 |
| `OPENAI_NEWS_MODEL` | 文本优化模型，当前按需求配置为 `gpt-5.5` | 否 |
| `CRON_SECRET` | 保护同步接口，防止外部随意触发 | 是 |

## 微信公众号后台设置

需要在微信公众号后台确认以下事项：

- AppSecret 已生成，并且只配置在 Vercel 环境变量中。
- 公众号已认证，具备读取已发布文章的接口权限。
- 如果微信后台开启 IP 白名单，需要把服务端出口 IP 加入白名单。
- Vercel Serverless 默认出口 IP 不固定。如微信要求固定 IP，建议加一层固定出口代理或云函数中转，再由官网同步接口调用。

## 手动测试

上线并配置环境变量后，可手动触发同步：

```bash
curl -X POST https://www.papaclaw.com/api/news/sync \
  -H "Authorization: Bearer <CRON_SECRET>"
```

成功返回示例：

```json
{
  "ok": true,
  "synced": 10,
  "latest": [
    {
      "title": "文章标题",
      "slug": "article-slug"
    }
  ]
}
```

## 验收标准

- `/api/news/sync` 在缺少或错误 `CRON_SECRET` 时返回 401。
- 手动触发同步后，`/api/news` 能看到文章列表。
- `/news` 能看到新闻列表。
- `/news/[slug]` 能打开文章详情，并包含正文、摘要、关键词和 FAQ。
- `/ai-news-feed` 输出纯文本，适合 AI 抓取。
- `/sitemap.xml` 包含 `/news` 和新闻详情页。
- `/llms.txt` 和 `/llms-full.txt` 包含新闻中心入口。

## 内容边界

新闻中心只做事实保留、结构整理和关键词增强，不应编造公众号原文不存在的信息。涉及商业承诺时，仍遵守 Papa Claw 统一口径：不宣称百分百中标、百分百盈利或保证订单，应表达为数据托底、资源赋能、务实落地、结果导向。
