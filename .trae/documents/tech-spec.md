# Agence Foudre 克隆网站 - 技术架构文档

## 1. 技术栈

### 1.1 核心框架
- **Next.js 14** (App Router) - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统
- **shadcn/ui** - UI 组件库

### 1.2 动画库
- **GSAP + ScrollTrigger** - 核心动画引擎
- **@gsap/react** - GSAP React 集成
- **Lenis** - 平滑滚动
- **Framer Motion** - React 组件动画（备选/辅助）

### 1.3 3D 效果
- **Three.js** - 3D 渲染
- **React Three Fiber** - Three.js React 集成
- **@react-three/drei** - R3F 辅助组件

### 1.4 字体
- **@fontsource** 或 Google Fonts - Clash Grotesk
- **本地字体** - Beni (需要获取或替代方案)

## 2. 项目结构

```
app/
├── sections/              # 页面区块组件
│   ├── Hero.tsx          # 首屏区域
│   ├── Agency.tsx        # 代理介绍
│   ├── Team.tsx          # 团队展示
│   ├── Projects.tsx      # 项目展示
│   ├── Manifest.tsx      # 宣言区域 (3D 效果)
│   ├── Expertises.tsx    # 专业能力
│   ├── Process.tsx       # 流程
│   ├── Why.tsx           # 为什么选择
│   ├── FAQ.tsx           # 常见问题
│   └── Footer.tsx        # 页脚
├── components/           # 可复用组件
│   ├── Header.tsx        # 导航头部
│   ├── Menu.tsx          # 全屏菜单
│   ├── Logo.tsx          # SVG Logo 动画
│   ├── Card3D.tsx        # 3D 卡片组件
│   ├── VideoPlayer.tsx   # 视频播放器
│   ├── ProjectSlider.tsx # 项目轮播
│   ├── Accordion.tsx     # 手风琴组件
│   ├── ChatBubble.tsx    # 聊天气泡
│   ├── PinButton.tsx     # 成员按钮
│   └── SmoothScroll.tsx  # 平滑滚动包装器
├── hooks/                # 自定义 Hooks
│   ├── useScrollProgress.ts
│   ├── useMousePosition.ts
│   ├── useInView.ts
│   └── useSmoothScroll.ts
├── lib/                  # 工具函数
│   ├── utils.ts
│   └── animations.ts     # GSAP 动画配置
├── types/                # TypeScript 类型
│   └── index.ts
├── page.tsx              # 主页面
├── layout.tsx            # 根布局
└── globals.css           # 全局样式
components/ui/            # shadcn/ui 组件
public/                   # 静态资源
├── images/              # 图片
├── fonts/               # 字体文件
└── videos/              # 视频
```

## 3. 核心动画实现方案

### 3.1 平滑滚动系统
```typescript
// hooks/useSmoothScroll.ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);
}
```

### 3.2 Hero 区域动画
```typescript
// 字母动画
const logoAnimation = () => {
  const letters = gsap.utils.toArray('.logo-letter');
  gsap.fromTo(letters, 
    { y: 100, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.8, 
      stagger: 0.05,
      ease: 'power3.out'
    }
  );
};

// 3D 卡片倾斜
const cardTilt = (e: MouseEvent, card: HTMLElement) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;
  
  gsap.to(card, {
    rotateX,
    rotateY,
    duration: 0.4,
    ease: 'power2.out'
  });
};
```

### 3.3 Manifest 3D 效果
```typescript
// React Three Fiber 场景
const ManifestScene = () => {
  const { scrollYProgress } = useScroll();
  
  // 文字逐词出现
  const words = useRef([]);
  
  useFrame(() => {
    const progress = scrollYProgress.get();
    words.current.forEach((word, i) => {
      if (word) {
        word.position.z = Math.max(0, (progress * 10) - i * 0.5);
        word.material.opacity = Math.min(1, progress * 2 - i * 0.2);
      }
    });
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      {/* 闪电形状 */}
      <LightningShape position={[-2, 0, 0]} />
      <LightningShape position={[2, 0, 0]} rotation={[0, Math.PI, 0]} />
      
      {/* 文字 */}
      {wordsList.map((word, i) => (
        <Text
          key={i}
          ref={el => words.current[i] = el}
          position={[0, 2 - i * 0.5, 0]}
        >
          {word}
        </Text>
      ))}
    </Canvas>
  );
};
```

### 3.4 ScrollTrigger 配置
```typescript
// lib/animations.ts
export const createScrollAnimations = () => {
  // Section 进入动画
  gsap.utils.toArray('.section').forEach((section: HTMLElement) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => section.classList.add('is-inview'),
      onLeaveBack: () => section.classList.remove('is-inview'),
    });
  });

  // Manifest 文字动画
  gsap.to('.manifest-word', {
    scrollTrigger: {
      trigger: '.manifest-section',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
    },
    y: 0,
    opacity: 1,
    stagger: 0.1,
  });

  // 闪电形状变形
  gsap.to('.lightning-path', {
    scrollTrigger: {
      trigger: '.manifest-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
    morphSVG: { shape: '#lightning-end' },
  });
};
```

## 4. 组件规格

### 4.1 Header
```typescript
interface HeaderProps {
  isScrolled: boolean;
  onMenuOpen: () => void;
}

// 滚动时 Logo 隐藏
const { scrollY } = useScroll();
const isScrolled = useTransform(scrollY, [0, 100], [false, true]);
```

### 4.2 Card3D
```typescript
interface Card3DProps {
  image: string;
  bubble?: string;
  index: number;
  isActive: boolean;
}

// 3D 变换样式
const cardStyle = {
  transformStyle: 'preserve-3d',
  perspective: '1000px',
};
```

### 4.3 VideoPlayer
```typescript
interface VideoPlayerProps {
  src: string;
  poster: string;
  autoPlay?: boolean;
  muted?: boolean;
}

// 自定义控制按钮
// 播放/暂停切换
// 静音切换
// 时间显示
```

### 4.4 ProjectSlider
```typescript
interface Project {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  link: string;
}

// 轮播逻辑
// 缩略图点击切换
// 左右箭头导航
// 指示点
```

### 4.5 Accordion (FAQ)
```typescript
interface FAQItem {
  question: string;
  answer: string;
}

// 展开/收起动画
// 箭头旋转
// 高度动画
```

## 5. 样式系统

### 5.1 Tailwind 配置
```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'pale-canvas': '#fff8f6',
        'deep-forest': '#00522d',
        'foudre-pink': '#db3c8a',
        'ash-whisper': '#fce5df',
        'bubblegum-blush': '#f29ebd',
        'slate-tint': '#d1cfe4',
        'midnight-ink': '#000000',
      },
      fontFamily: {
        beni: ['Beni', 'sans-serif'],
        clash: ['Clash Grotesk', 'sans-serif'],
      },
      fontSize: {
        'display': ['230px', { lineHeight: '0.7' }],
        'heading-lg': ['46px', { lineHeight: '0.7' }],
        'heading': ['30px', { lineHeight: '0.85' }],
        'subheading': ['20px', { lineHeight: '0.85' }],
        'body': ['14px', { lineHeight: '0.85' }],
        'caption': ['10px', { lineHeight: '0.85' }],
      },
      borderRadius: {
        'badge': '10px',
        'card': '20px',
        'content': '25px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(.23,1,.32,1)',
        'bounce': 'cubic-bezier(.17,.67,.3,1.33)',
      },
    },
  },
};
```

### 5.2 全局样式
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-pale-canvas: #fff8f6;
    --color-deep-forest: #00522d;
    --color-foudre-pink: #db3c8a;
    --color-ash-whisper: #fce5df;
    --color-bubblegum-blush: #f29ebd;
    --color-slate-tint: #d1cfe4;
    --color-midnight-ink: #000000;
  }

  html {
    scroll-behavior: auto; /* Lenis 控制滚动 */
  }

  body {
    @apply bg-pale-canvas text-deep-forest font-clash;
    overflow-x: hidden;
  }
}

@layer components {
  .section {
    @apply relative w-full;
  }

  .is-inview {
    /* 进入视口时的样式 */
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## 6. 性能优化

### 6.1 图片优化
- 使用 Next.js Image 组件
- AVIF/WebP 格式
- 响应式 sizes
- 懒加载

### 6.2 动画优化
- `will-change` 属性
- `transform` 和 `opacity` 优先
- `requestAnimationFrame`
- 减少重排重绘

### 6.3 代码分割
- 动态导入大型组件
- 按需加载 GSAP 插件
- 分离 Three.js 场景

## 7. 开发计划

### 阶段 1: 基础搭建
1. 初始化 Next.js 项目
2. 配置 Tailwind CSS
3. 安装动画库
4. 设置字体

### 阶段 2: 核心组件
1. Header + Menu
2. Hero Section
3. Smooth Scroll 系统

### 阶段 3: 内容区块
1. Agency Section
2. Team Section
3. Projects Section

### 阶段 4: 高级动效
1. Manifest 3D 效果
2. 滚动触发动画
3. 交互细节

### 阶段 5: 完善
1. FAQ Section
2. Footer
3. 响应式适配
4. 性能优化

## 8. 依赖列表

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.0.0",
    "lenis": "^1.0.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.90.0",
    "framer-motion": "^10.16.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/three": "^0.160.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```
