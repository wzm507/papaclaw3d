import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pale-canvas': '#f5f5f7',
        'deep-forest': '#111111',
        'foudre-pink': '#0071e3',
        'ash-whisper': '#e8e8ed',
        'bubblegum-blush': '#d7ff38',
        'slate-tint': '#6e6e73',
        'midnight-ink': '#000000',
        'paper-white': '#ffffff',
        'rule-ink': '#1d1d1f',
      },
      fontFamily: {
        beni: ['Inter', 'Arial', 'sans-serif'],
        clash: ['Inter', 'Arial', 'sans-serif'],
        editorial: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'],
        utility: ['Inter', 'Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8.6vw, 7.4rem)', { lineHeight: '0.94' }],
        'heading-lg': ['clamp(2.15rem, 4.6vw, 4.5rem)', { lineHeight: '1.02' }],
        'heading': ['clamp(1.45rem, 2.4vw, 2.25rem)', { lineHeight: '1.12' }],
        'subheading': ['clamp(1.05rem, 1.45vw, 1.3rem)', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.75' }],
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
