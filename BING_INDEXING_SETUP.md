# Bing 收录与 IndexNow 主动推送操作说明

本文用于让 Papa Claw 爬爬虾官网更快被 Bing 抓取、索引，并通过 IndexNow 主动推送新增或更新的 URL。

## 已完成的网站侧配置

- Sitemap：`https://www.papaclaw.cn/sitemap.xml`
- Robots：`https://www.papaclaw.cn/robots.txt`
- IndexNow key 文件：`https://www.papaclaw.cn/d9b1f6a2c8e74f30b5a19d6c42e8f0ab.txt`
- IndexNow key：`d9b1f6a2c8e74f30b5a19d6c42e8f0ab`
- 手动推送命令：`npm run indexnow:submit`
- 公众号新闻同步后，会自动推送首页、新闻列表、AI 新闻 feed 和新闻详情页。

## 第一步：开通 Bing Webmaster Tools

1. 打开 Bing Webmaster Tools：`https://www.bing.com/webmasters/about`
2. 使用微软账号登录。
3. 添加站点：`https://www.papaclaw.cn`
4. 推荐使用 DNS 验证。如果域名 DNS 不方便操作，也可以使用 HTML 文件或 meta tag 验证。
5. 完成验证后，进入该站点后台。

## 第二步：提交 Sitemap

在 Bing Webmaster Tools 中找到 Sitemaps，提交：

```text
https://www.papaclaw.cn/sitemap.xml
```

提交后检查状态是否为成功读取。Sitemap 已包含：

- 首页
- `/llms.txt`
- `/llms-full.txt`
- `/news`
- `/ai-news-feed`
- 新闻详情页

## 第三步：确认 IndexNow key 文件

上线后在浏览器打开：

```text
https://www.papaclaw.cn/d9b1f6a2c8e74f30b5a19d6c42e8f0ab.txt
```

页面内容必须只有这一行：

```text
d9b1f6a2c8e74f30b5a19d6c42e8f0ab
```

如果返回 404，说明部署还没有包含 `public` 里的 key 文件，需要重新部署。

## 第四步：主动推送全站 URL

在本地或 CI 环境运行：

```bash
SITE_URL=https://www.papaclaw.cn npm run indexnow:submit
```

脚本会读取：

```text
https://www.papaclaw.cn/sitemap.xml
```

然后把 sitemap 中的 URL 提交到 Bing IndexNow。IndexNow 每次最多提交 10,000 个 URL，脚本会自动分批。

如果只想推送指定 URL：

```bash
SITE_URL=https://www.papaclaw.cn npm run indexnow:submit -- /news /ai-news-feed
```

如果想先预览提交内容：

```bash
SITE_URL=https://www.papaclaw.cn npm run indexnow:submit -- --dry-run
```

## Vercel 环境变量

建议在 Vercel 中配置：

```text
INDEXNOW_KEY=d9b1f6a2c8e74f30b5a19d6c42e8f0ab
INDEXNOW_ENDPOINT=https://www.bing.com/indexnow
NEXT_PUBLIC_SITE_URL=https://www.papaclaw.cn
```

如果未来要更换 key：

1. 生成新的 8-128 位 key。
2. 在 `public` 下新增 `{新key}.txt`，内容为新 key。
3. 更新 `INDEXNOW_KEY`。
4. 重新部署。
5. 使用新 key 重新提交 URL。

## 验收标准

- `robots.txt` 中能看到 sitemap 地址。
- `sitemap.xml` 能被浏览器打开，且包含核心页面。
- IndexNow key 文件能被浏览器打开，内容与 key 完全一致。
- `npm run indexnow:submit -- --dry-run` 能列出准备提交的 URL。
- 正式提交后，命令返回 `200 OK` 或 `202 OK/Accepted`。
- Bing Webmaster Tools 中能看到 sitemap 状态和 IndexNow 提交记录。
