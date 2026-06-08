# Agence Foudre 克隆网站 - 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 目标
基于 https://www.agencefoudre.com/ 的 UI/UX 和动效，开发一个功能完整、视觉效果一致的克隆网站。包含所有滚动动效、3D 镜头效果、交互细节。

### 1.2 设计系统
- **主题**: 明亮主题，大胆 energetic 风格
- **核心色彩**:
  - Pale Canvas `#fff8f6` - 页面背景
  - Deep Forest `#00522d` - 主文字、交互元素
  - Foudre Pink `#db3c8a` - 品牌强调色
  - Ash Whisper `#fce5df` - 次级背景
  - Bubblegum Blush `#f29ebd` - 按钮背景
  - Slate Tint `#d1cfe4` - 辅助文字
  - Midnight Ink `#000000` - 工具文字
- **字体**:
  - Beni (900 weight) - 展示标题，line-height 0.7
  - Clash Grotesk (400/500/700) - 正文，line-height 0.85/1.2
- **圆角**: badges/buttons 10px, cards 20px, content cards 25px

## 2. 页面结构

### 2.1 Header/导航
- 左侧: Menu 按钮（汉堡菜单）
- 中间: Agence Foudre Logo (SVG 字母动画 F-O-U-D-R-E)
- 右侧: WhatsApp 按钮
- 滚动时 Logo 隐藏/显示切换

### 2.2 Hero Section (首页首屏)
- **背景**: 白色
- **Logo 动画**: F-O-U-D-R-E 六个字母依次出现，带 stagger delay
- **卡片轮播**: 3 张团队照片卡片，自动轮播切换
  - 每张卡片带聊天气泡装饰（⚡ 表情）
  - 卡片有 3D 倾斜效果（perspective + rotateX/Y）
  - 卡片切换时带 scale/fade 过渡
- **大标题**: "Agence social média" (H1)
- **副标题**: "Human" + "Social Club" 分行显示

### 2.3 Agency Section (代理介绍)
- **左侧文字**: "Nous sommes le courant," (粉色)
- **中间视频**: 自动播放、静音的视频播放器
  - 带播放/暂停按钮
  - 带静音切换按钮
  - 显示剩余时间 "-0:22"
- **右侧文字**: "vous êtes l'histoire." (粉色)

### 2.4 Team Section (团队展示)
- **背景**: 粉色 `#fce5df`
- **标题**: "Nous électrisons *vos réseaux,*" (斜体强调)
- **聊天气泡**: 📱⚡️😜 表情气泡
- **团队成员卡片**: 5 张成员照片
  - Margaux, Mathieu, Florent, Johane, Lou
  - 点击成员名字切换照片
  - 照片有 3D 翻转/切换效果
  - 成员名字按钮带 hover 效果

### 2.5 Projects Section (项目展示)
- **标题**: "NOUS LES RENDONS, SOCIAUX"
- **项目缩略图**: Yelloh! Village, Solty Hôtel, Le Sac du Berger, Mamy Grand (+1)
- **项目轮播/滑块**:
  - 大图展示
  - 左右导航箭头
  - 底部指示点
  - "Consulter le projet" 链接
  - 标签: Création de contenu, Community management, Stratégie social media
  - "Love" 点赞按钮（心形动画）

### 2.6 Manifest Section (宣言)
- **全屏滚动动画**:
  - 背景: 闪电形状 SVG 图案滚动
  - 文字逐词出现动画: "C'est l'impact de votre sincérité"
  - "C'est viser juste et"
  - "FRAPPER" (大字)
  - "FORT." (大字)
- **闪电形状**: 左右两个 SVG 路径，随滚动变形/移动
- **3D 镜头效果**: 文字和形状有深度感

### 2.7 Expertises Section (专业能力)
- **标题**: "Raisonner pour mieux: résonner."
- **三个服务卡片**:
  1. Stratégie social media - 分析、基准、艺术方向、策略定义
  2. Création de contenu - 视频、照片、Instagram Reels、采访、企业、工作室、YouTube、TikTok
  3. Community management - 编辑计划、发布、Stories、日常审核、报告、项目管理
- **图标**: 👀📱📊 等表情图标

### 2.8 Process Section (流程)
- **标题**: "Nous préfèrerons cet ordre. Toujours."
- **5 个步骤**:
  1. Stratégie - 分析和定义沟通支柱
  2. Direction artistique - 揭示品牌 DNA
  3. Création de contenu - 照片和视频制作
  4. Community management - 账户管理和帖子安排
  5. Reporting & learnings - 详细报告和策略调整
- **编号**: 01, 02, 03, 04, 05
- **描述文字**

### 2.9 Why Section (为什么选择)
- **标题**: "POURQUOI CHOISIR FOUDRE"
- **4 个理由**:
  1. Experts social media - 近 10 年专业经验
  2. Premium & sur-mesure - 无标准化套餐，定制化服务
  3. Une méthode - 严谨与创意并重
  4. L'humain avant tout - 以人为本

### 2.10 FAQ Section (常见问题)
- **标题**: "Petites questions, grandes réponses"
- **手风琴/折叠面板**:
  - 6 个问题，点击展开/收起
  - 展开时箭头旋转动画
  - 内容淡入效果

### 2.11 Footer (页脚)
- **联系区域**: "Contact" + "Racontez-nous."
- **描述**: "Un mini quiz, 3 questions, moins d'une minute..."
- **按钮**: "Lancer le quiz"
- **版权**: "© 2026 FOUDRE, tous droits réservés."
- **社交链接**: Instagram, TikTok, Pinterest, LinkedIn
- **法律链接**: CONFIDENTIALITÉ, MENTIONS LÉGALES
- **制作方**: "SITE PAR TROA"

## 3. 动效规范

### 3.1 滚动系统
- **平滑滚动**: Lenis 或 GSAP ScrollSmoother
- **ScrollTrigger**: 基于滚动的动画触发
- **CSS 进度变量**: `--progress` 随滚动更新
- **Section 进入检测**: `is-inview` 类切换

### 3.2 Hero 区域动效
- **Logo 字母动画**: F→O→U→D→R→E 依次出现
  - 每个字母 delay: 50ms 递增
  - 入场: translateY + opacity
- **卡片 3D 效果**:
  - perspective: 1000px
  - rotateX, rotateY 基于鼠标位置
  - 过渡: 0.4s cubic-bezier(.23,1,.32,1)
- **卡片切换**:
  - 当前卡片: scale(1), opacity(1)
  - 离开卡片: scale(0.8), opacity(0)
  - 进入卡片: scale(1.1→1), opacity(0→1)
- **聊天气泡**:
  - 入场: scale(0→1) + rotate
  - 延迟出现

### 3.3 Agency 区域动效
- **文字入场**: 从两侧滑入
- **视频播放器**: 懒加载，进入视口时开始播放

### 3.4 Team 区域动效
- **标题入场**: 逐行出现
- **照片切换**:
  - 3D 翻转效果 (rotateY)
  - 淡入淡出
- **成员按钮 hover**:
  - 背景色变化
  - 文字滑动效果

### 3.5 Projects 区域动效
- **缩略图 hover**: scale(1.05) + 阴影
- **项目切换**:
  - 图片滑动过渡
  - 文字淡入
- **Love 按钮**:
  - 点击时心形填充动画
  - scale 弹跳效果

### 3.6 Manifest 区域动效 (核心 3D 效果)
- **文字逐词出现**:
  - 每个词包裹在 span 中
  - 滚动时依次出现
  - translateY + opacity
- **闪电形状 SVG**:
  - 随滚动变形 (morphSVG)
  - 左右两侧对称移动
  - 产生 3D 深度错觉
- **背景图案**:
  - 闪电纹理滚动
  - parallax 效果
- **3D 镜头感**:
  - 文字有 Z 轴位移
  - 透视变化
  - 相机移动效果

### 3.7 Expertises 区域动效
- **卡片入场**: stagger 延迟
- **图标动画**: 轻微浮动

### 3.8 Process 区域动效
- **步骤出现**: 滚动触发，依次显示
- **编号动画**: 数字计数效果

### 3.9 Why 区域动效
- **卡片入场**: 从下方滑入
- **hover 效果**: 轻微上浮

### 3.10 FAQ 区域动效
- **手风琴展开**:
  - 高度动画: 0→auto
  - 箭头旋转: 135deg→0deg
  - 内容淡入: opacity 0→1
- **颜色变化**:
  - 关闭: 粉色文字
  - 打开: 深粉色文字 + 粉色按钮背景

### 3.11 全局动效
- **页面过渡**: Barba.js 或类似页面切换动画
- **菜单打开**:
  - 全屏覆盖
  - 左右面板滑入
  - 链接 stagger 出现
- **按钮 hover**:
  - 下划线从左到右展开
  - 背景色过渡
- **链接 hover**:
  - 文字滑动替换效果

## 4. 交互规范

### 4.1 鼠标交互
- **卡片 3D 倾斜**: 基于鼠标位置的 rotateX/Y
- **按钮 hover**: 背景/文字颜色变化
- **链接 hover**: 下划线动画

### 4.2 触摸交互
- **滑动手势**: 项目轮播、卡片切换
- **点击**: 手风琴展开、菜单切换

### 4.3 键盘交互
- **Tab 导航**: 焦点状态可见
- **Enter/Space**: 按钮激活
- **Escape**: 关闭菜单/弹窗

## 5. 响应式设计

### 5.1 断点
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: >= 1024px
- Large Desktop: >= 1440px

### 5.2 移动端适配
- Hero 卡片单列
- 团队照片堆叠
- 项目轮播全宽
- 菜单全屏

## 6. 性能要求

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- 动画帧率 >= 60fps
- 图片懒加载
- 视频懒加载
- 字体预加载

## 7. 无障碍

- 语义化 HTML
- ARIA 标签
- 键盘导航
- 焦点可见
- 颜色对比度 WCAG AA
- 减少动效偏好支持
