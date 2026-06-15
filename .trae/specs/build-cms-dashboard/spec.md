# PAPACLAW 官网 CMS 管理系统 Spec

## Why
当前官网所有内容（企业信息、团队成员、项目案例、FAQ等）都硬编码在组件中，修改任何内容都需要直接编辑代码。需要一个可视化的 CMS 管理后台，让非技术人员也能便捷地管理运营官网内容。

## What Changes
- 新增 `/admin` 路由作为 CMS 管理后台入口
- 新增 JSON 文件作为内容数据源（`data/site-config.json`）
- 重构所有 section 组件，从 JSON 数据源读取内容而非硬编码
- 新增 CMS 管理页面：企业信息配置、内容编辑、预览、发布
- 新增 API 路由用于读写数据
- **BREAKING**: 所有 section 组件改为从数据源读取内容，移除硬编码数据

## Impact
- Affected specs: 所有 section 组件的数据来源方式
- Affected code:
  - `app/sections/*.tsx` — 所有 section 组件需改为读取数据源
  - `app/page.tsx` — 需传递数据到各 section
  - 新增 `app/admin/` — CMS 管理后台页面
  - 新增 `app/api/` — 数据读写 API
  - 新增 `data/site-config.json` — 内容数据文件

## ADDED Requirements

### Requirement: CMS 管理后台
系统 SHALL 提供一个基于 Web 的 CMS 管理后台，路径为 `/admin`。

#### Scenario: 访问管理后台
- **WHEN** 用户访问 `/admin` 路径
- **THEN** 显示 CMS 管理后台登录页面
- **AND** 登录后显示管理后台仪表盘

#### Scenario: 管理后台导航
- **GIVEN** 用户已登录管理后台
- **WHEN** 查看侧边栏导航
- **THEN** 显示以下管理模块：企业信息、首页配置、团队管理、项目管理、专业服务、工作流程、优势理由、FAQ管理、页脚配置
- **AND** 每个模块可点击进入对应的编辑页面

### Requirement: 企业信息配置
系统 SHALL 允许管理员配置企业基本信息。

#### Scenario: 编辑企业信息
- **WHEN** 管理员在企业信息页面编辑内容
- **THEN** 可修改以下字段：企业名称、企业标语、企业描述、WhatsApp 链接、社交媒体链接（Instagram、TikTok、Pinterest、LinkedIn）
- **AND** 修改后点击保存，数据写入 `data/site-config.json`

### Requirement: 首页配置（Hero）
系统 SHALL 允许管理员配置首页 Hero 区域内容。

#### Scenario: 编辑 Hero 内容
- **WHEN** 管理员在首页配置页面编辑 Hero 区域
- **THEN** 可修改：主标题、副标题1、副标题2、背景图片URL、卡片图片列表
- **AND** 保存后官网 Hero 区域自动更新

### Requirement: 团队管理
系统 SHALL 允许管理员管理团队成员信息。

#### Scenario: 管理团队成员
- **WHEN** 管理员在团队管理页面操作
- **THEN** 可添加、编辑、删除团队成员
- **AND** 每个成员包含：姓名、头像URL
- **AND** 可拖拽调整成员显示顺序

### Requirement: 项目管理
系统 SHALL 允许管理员管理项目案例。

#### Scenario: 管理项目案例
- **WHEN** 管理员在项目管理页面操作
- **THEN** 可添加、编辑、删除项目
- **AND** 每个项目包含：标题、缩略图URL、标签列表
- **AND** 可拖拽调整项目显示顺序

### Requirement: 专业服务管理
系统 SHALL 允许管理员管理专业服务/专长内容。

#### Scenario: 管理专业服务
- **WHEN** 管理员在专业服务页面操作
- **THEN** 可添加、编辑、删除服务项
- **AND** 每个服务项包含：图标（emoji）、标题、描述
- **AND** 区域标题和副标题也可编辑

### Requirement: 工作流程管理
系统 SHALL 允许管理员管理工作流程步骤。

#### Scenario: 管理工作流程
- **WHEN** 管理员在工作流程页面操作
- **THEN** 可添加、编辑、删除步骤
- **AND** 每个步骤包含：序号、标题、描述
- **AND** 区域标题和副标题也可编辑

### Requirement: 优势理由管理
系统 SHALL 允许管理员管理"为什么选择我们"内容。

#### Scenario: 管理优势理由
- **WHEN** 管理员在优势理由页面操作
- **THEN** 可添加、编辑、删除理由项
- **AND** 每个理由包含：标题、描述
- **AND** 区域标题和副标题也可编辑

### Requirement: FAQ 管理
系统 SHALL 允许管理员管理常见问答。

#### Scenario: 管理 FAQ
- **WHEN** 管理员在 FAQ 管理页面操作
- **THEN** 可添加、编辑、删除问答
- **AND** 每个问答包含：问题、答案
- **AND** 区域标题和副标题也可编辑

### Requirement: 页脚配置
系统 SHALL 允许管理员配置页脚内容。

#### Scenario: 编辑页脚
- **WHEN** 管理员在页脚配置页面编辑
- **THEN** 可修改：联系标题、联系描述、CTA按钮文字、社交媒体列表、版权信息、法律链接

### Requirement: 实时预览
系统 SHALL 提供官网实时预览功能。

#### Scenario: 预览官网
- **WHEN** 管理员在管理后台点击"预览"按钮
- **THEN** 在新标签页或 iframe 中打开官网预览
- **AND** 预览使用当前编辑中的数据（包含未保存的修改）
- **AND** 预览页面顶部显示"预览模式"标识条

### Requirement: 发布官网
系统 SHALL 提供一键发布功能。

#### Scenario: 发布内容
- **WHEN** 管理员点击"发布"按钮
- **THEN** 系统将当前数据保存到 `data/site-config.json`
- **AND** 触发 Next.js 重新构建（`next build`）
- **AND** 显示发布状态（成功/失败）

### Requirement: 简易登录认证
系统 SHALL 提供简易的管理后台登录功能。

#### Scenario: 登录管理后台
- **WHEN** 用户访问 `/admin` 并输入正确密码
- **THEN** 跳转到管理后台仪表盘
- **AND** 会话信息存储在 localStorage 中
- **WHEN** 用户输入错误密码
- **THEN** 显示错误提示

## MODIFIED Requirements

### Requirement: Section 组件数据来源
所有 section 组件 SHALL 从数据源读取内容，而非硬编码。

- Hero 组件从 props 接收标题、副标题、图片等数据
- Team 组件从 props 接收团队成员列表
- Projects 组件从 props 接收项目列表
- Expertises 组件从 props 接收服务列表
- Process 组件从 props 接收步骤列表
- Why 组件从 props 接收理由列表
- FAQ 组件从 props 接收问答列表
- Footer 组件从 props 接收页脚配置
- Agency 组件从 props 接收文案和视频URL
- Header 组件从 props 接收菜单项和链接
