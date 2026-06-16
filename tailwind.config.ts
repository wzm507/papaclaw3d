import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pale-canvas': '#f7f3ea',
        'deep-forest': '#153827',
        'foudre-pink': '#9f1748',
        'ash-whisper': '#ebe5da',
        'bubblegum-blush': '#cfa699',
        'slate-tint': '#70786f',
        'midnight-ink': '#11110f',
        'paper-white': '#fffdf7',
        'rule-ink': '#2c2a24',
      },
      fontFamily: {
        beni: ['Georgia', 'Times New Roman', 'serif'],
        clash: ['Inter', 'Arial', 'sans-serif'],
        editorial: ['Georgia', 'Times New Roman', 'Songti SC', 'SimSun', 'serif'],
        utility: ['Inter', 'Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(4.25rem, 12vw, 10rem)', { lineHeight: '0.86' }],
        'heading-lg': ['clamp(2.35rem, 5vw, 4.9rem)', { lineHeight: '0.98' }],
        'heading': ['clamp(1.65rem, 3vw, 2.65rem)', { lineHeight: '1.08' }],
        'subheading': ['clamp(1.125rem, 1.7vw, 1.45rem)', { lineHeight: '1.55' }],
        'body': ['1rem', { lineHeight: '1.85' }],
        'caption': ['0.75rem', { lineHeight: '1.45' }],
      },
      borderRadius: {
        'badge': '999px',
        'card': '8px',
        'content': '8px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(.23,1,.32,1)',
        'bounce': 'cubic-bezier(.17,.67,.3,1.33)',
      },
    },
  },
  plugins: [],
}
export default config
