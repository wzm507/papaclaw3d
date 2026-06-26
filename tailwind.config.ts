import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pale-canvas': '#F7F7F5',
        'deep-forest': '#0F1C1A',
        'foudre-pink': '#B08D57',
        'ash-whisper': '#E5E5E0',
        'bubblegum-blush': '#C8FF00',
        'slate-tint': '#737373',
        'midnight-ink': '#0A0A0A',
        'paper-white': '#FFFFFF',
        'rule-ink': '#151515',
        'warm-gray': '#F0EFEC',
      },
      fontFamily: {
        display: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'],
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['clamp(3.2rem, 11vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-sm': ['clamp(2.4rem, 7vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '600' }],
        'heading-lg': ['clamp(2rem, 4.5vw, 3.8rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading': ['clamp(1.5rem, 3vw, 2.4rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'subheading': ['clamp(1.05rem, 1.6vw, 1.35rem)', { lineHeight: '1.6', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'badge': '999px',
        'card': '16px',
        'content': '12px',
        'button': '8px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'line-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'line-grow': 'line-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
export default config
