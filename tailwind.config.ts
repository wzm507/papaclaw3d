import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        beni: ['Beni', 'Arial Black', 'sans-serif'],
        clash: ['Clash Grotesk', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(80px,15vw,230px)', { lineHeight: '0.7' }],
        'heading-lg': ['clamp(32px,4vw,46px)', { lineHeight: '0.7' }],
        'heading': ['clamp(24px,3vw,30px)', { lineHeight: '0.85' }],
        'subheading': ['clamp(16px,2vw,20px)', { lineHeight: '0.85' }],
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
  plugins: [],
}
export default config
