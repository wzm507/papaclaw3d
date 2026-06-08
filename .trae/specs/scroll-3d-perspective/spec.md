# 滚动 3D 透视效果 Spec

## Why
当前网站的 Manifest 区域缺少真正的滚动驱动 3D 透视深度效果。用户期望在滚动时体验到类似 Agence Foudre 官网的沉浸式 3D 镜头感——元素随滚动在 Z 轴上移动，产生强烈的透视和深度错觉。

## What Changes
- 在 Manifest 区域实现滚动驱动的 3D 透视系统
- 文字元素随滚动在 Z 轴方向移动（从远处飞入/飞出）
- 左右闪电形状随滚动产生透视变形和位移
- 背景粒子场随滚动产生视差深度效果
- 整体相机视角随滚动推进，产生"穿越"感
- **BREAKING**: 替换现有的简单 GSAP 动画为滚动联动的 3D 变换

## Impact
- Affected specs: Manifest 区域视觉表现
- Affected code: `app/sections/Manifest.tsx`, `app/components/Manifest3D.tsx`

## ADDED Requirements

### Requirement: 滚动 3D 透视系统
The system SHALL provide a scroll-driven 3D perspective effect in the Manifest section.

#### Scenario: 滚动时文字产生 Z 轴深度
- **GIVEN** 用户在 Manifest 区域滚动页面
- **WHEN** 滚动进度从 0% 到 100%
- **THEN** 文字元素在 Z 轴上从远处（translateZ(-500px)）向近处（translateZ(0)）移动
- **AND** 文字同时产生 opacity 变化（0 -> 1）
- **AND** 文字有轻微的 rotateX 倾斜变化

#### Scenario: 闪电形状透视变形
- **GIVEN** 用户在 Manifest 区域滚动
- **WHEN** 滚动进度推进
- **THEN** 左右闪电 SVG 沿 X 轴向两侧偏移
- **AND** 闪电产生 scale 变化（模拟近大远小）
- **AND** 闪电有 rotateY 旋转，增强 3D 感

#### Scenario: 背景粒子视差
- **GIVEN** 3D 场景中的粒子场
- **WHEN** 用户滚动
- **THEN** 粒子以不同速度在 Z 轴移动（多层视差）
- **AND** 粒子透明度随深度变化

#### Scenario: 相机推进效果
- **GIVEN** React Three Fiber 场景
- **WHEN** 滚动进度变化
- **THEN** 相机位置沿 Z 轴推进（从 z=10 到 z=2）
- **AND** 相机有轻微的旋转摆动，增强动态感

## MODIFIED Requirements
### Requirement: Manifest 区域动画
- 现有 GSAP ScrollTrigger 文字动画保留作为降级方案
- 3D 效果作为增强层，在支持 WebGL 的浏览器上启用
- 两者需协调工作，避免冲突
