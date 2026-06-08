# Tasks

- [x] Task 1: 升级 Manifest3D 组件实现滚动联动相机
  - [x] SubTask 1.1: 使用 `useScroll` 从 @react-three/drei 获取滚动进度
  - [x] SubTask 1.2: 实现相机沿 Z 轴推进（z=10 → z=2）
  - [x] SubTask 1.3: 添加相机轻微旋转摆动
  - [x] SubTask 1.4: 使用 `useFrame` 平滑插值相机位置

- [x] Task 2: 实现文字元素的 Z 轴深度动画
  - [x] SubTask 2.1: 将文字改为 3D Text 组件并设置初始 Z 位置
  - [x] SubTask 2.2: 根据滚动进度计算每个文字的 translateZ
  - [x] SubTask 2.3: 添加 opacity 和 rotateX 随滚动变化
  - [x] SubTask 2.4: 使用 GSAP ScrollTrigger 同步 HTML 文字和 3D 文字

- [x] Task 3: 实现闪电形状的透视变形
  - [x] SubTask 3.1: 将 SVG 闪电替换为 3D 网格或保持 SVG 但添加 CSS 3D 变换
  - [x] SubTask 3.2: 实现随滚动的 X 轴偏移和 scale 变化
  - [x] SubTask 3.3: 添加 rotateY 旋转增强 3D 感

- [x] Task 4: 增强粒子场的视差深度
  - [x] SubTask 4.1: 创建多层粒子（近、中、远三层）
  - [x] SubTask 4.2: 每层以不同速度响应滚动
  - [x] SubTask 4.3: 粒子大小和透明度随深度变化

- [x] Task 5: 协调 GSAP 和 R3F 动画
  - [x] SubTask 5.1: 确保 GSAP ScrollTrigger 和 R3F useScroll 使用同一滚动源
  - [x] SubTask 5.2: 添加 prefers-reduced-motion 支持
  - [x] SubTask 5.3: 测试性能，确保 60fps
