# Tasks

- [x] Task 1: 创建数据层 — JSON 数据文件和 API 路由
  - [x] SubTask 1.1: 创建 `data/site-config.json`，将所有硬编码数据提取为 JSON 结构
  - [x] SubTask 1.2: 创建 `app/api/config/route.ts` — GET 读取配置，POST 保存配置
  - [x] SubTask 1.3: 创建 `app/api/publish/route.ts` — 触发重新构建的发布接口

- [x] Task 2: 重构所有 Section 组件，从数据源读取内容
  - [x] SubTask 2.1: 重构 Hero.tsx — 从 props 接收标题、副标题、图片数据
  - [x] SubTask 2.2: 重构 Agency.tsx — 从 props 接收文案和视频URL
  - [x] SubTask 2.3: 重构 Team.tsx — 从 props 接收团队成员列表
  - [x] SubTask 2.4: 重构 Projects.tsx — 从 props 接收项目列表
  - [x] SubTask 2.5: 重构 Expertises.tsx — 从 props 接收服务列表和区域标题
  - [x] SubTask 2.6: 重构 Process.tsx — 从 props 接收步骤列表和区域标题
  - [x] SubTask 2.7: 重构 Why.tsx — 从 props 接收理由列表和区域标题
  - [x] SubTask 2.8: 重构 FAQ.tsx — 从 props 接收问答列表和区域标题
  - [x] SubTask 2.9: 重构 Footer.tsx — 从 props 接收页脚配置
  - [x] SubTask 2.10: 重构 Header.tsx — 从 props 接收菜单和链接
  - [x] SubTask 2.11: 重构 page.tsx — 从 JSON 读取数据并传递给各 section

- [x] Task 3: 创建 CMS 管理后台 UI 框架
  - [x] SubTask 3.1: 创建 `app/admin/layout.tsx` — 管理后台布局（侧边栏 + 内容区）
  - [x] SubTask 3.2: 创建 `app/admin/page.tsx` — 仪表盘首页
  - [x] SubTask 3.3: 创建 `app/admin/login/page.tsx` — 登录页面
  - [x] SubTask 3.4: 创建 `app/admin/components/Sidebar.tsx` — 侧边栏导航组件
  - [x] SubTask 3.5: 创建 `app/admin/components/AuthGuard.tsx` — 登录鉴权守卫

- [x] Task 4: 创建各内容管理编辑页面
  - [x] SubTask 4.1: 创建 `app/admin/company/page.tsx` — 企业信息配置页
  - [x] SubTask 4.2: 创建 `app/admin/hero/page.tsx` — 首页 Hero 配置页
  - [x] SubTask 4.3: 创建 `app/admin/team/page.tsx` — 团队管理页
  - [x] SubTask 4.4: 创建 `app/admin/projects/page.tsx` — 项目管理页
  - [x] SubTask 4.5: 创建 `app/admin/expertises/page.tsx` — 专业服务管理页
  - [x] SubTask 4.6: 创建 `app/admin/process/page.tsx` — 工作流程管理页
  - [x] SubTask 4.7: 创建 `app/admin/why/page.tsx` — 优势理由管理页
  - [x] SubTask 4.8: 创建 `app/admin/faq/page.tsx` — FAQ 管理页
  - [x] SubTask 4.9: 创建 `app/admin/footer/page.tsx` — 页脚配置页

- [x] Task 5: 创建通用编辑组件
  - [x] SubTask 5.1: 创建 `app/admin/components/FieldEditor.tsx` — 字段编辑器（文本、图片URL、emoji）
  - [x] SubTask 5.2: 创建 `app/admin/components/ListEditor.tsx` — 列表编辑器（增删改排序）
  - [x] SubTask 5.3: 创建 `app/admin/components/SectionEditor.tsx` — 区域编辑器包装组件
  - [x] SubTask 5.4: 创建 `app/admin/components/SaveButton.tsx` — 保存按钮组件
  - [x] SubTask 5.5: 创建 `app/admin/components/ImagePreview.tsx` — 图片预览组件
  - [x] SubTask 5.6: 创建 `app/admin/hooks/useConfig.ts` — 配置数据 hook

- [x] Task 6: 实现预览和发布功能
  - [x] SubTask 6.1: 创建 `app/preview/page.tsx` — 预览页面，从 API 读取数据渲染官网
  - [x] SubTask 6.2: 实现发布功能 — 保存数据并触发重新构建
  - [x] SubTask 6.3: 在管理后台顶部添加预览模式标识条

# Task Dependencies
- [Task 2] depends on [Task 1] — 组件需要从 JSON 读取数据
- [Task 4] depends on [Task 3] — 编辑页面需要管理后台框架
- [Task 4] depends on [Task 5] — 编辑页面需要通用编辑组件
- [Task 6] depends on [Task 1] — 预览和发布需要 API 路由
