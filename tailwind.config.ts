import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#080808',
          dark:   '#111111',
          card:   '#161616',
          border: 'rgba(255,255,255,0.07)',
          gold:   '#C8A45A',
          'gold-light': '#E2BF7A',
          'gold-dim':   'rgba(200,164,90,0.12)',
          orange: '#FF5C00',
          blue:   '#00C2FF',
          gray:   '#888888',
          light:  '#F0F0F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease both',
        'fade-in':    'fadeIn 0.5s ease both',
        'float':      'float 4s ease-in-out infinite',
        'scan':       'scan 2.5s ease-in-out infinite',
        'marquee':    'marquee 22s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'slide-in':   'slideIn 0.4s cubic-bezier(0.23,1,0.32,1) both',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        scan:     { '0%,100%': { opacity: '0.3', transform: 'scaleX(0.4)' }, '50%': { opacity: '1', transform: 'scaleX(1)' } },
        marquee:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        slideIn:  { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}

export default config
