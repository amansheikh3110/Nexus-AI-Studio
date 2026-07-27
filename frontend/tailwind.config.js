/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        // CSS variable-backed colors
        base:    'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        raised:  'rgb(var(--c-elevated) / <alpha-value>)',
        accent:  'rgb(var(--c-accent) / <alpha-value>)',
        accent2: 'rgb(var(--c-accent-2) / <alpha-value>)',
        'c-text': 'rgb(var(--c-text) / <alpha-value>)',
        'c-muted':'rgb(var(--c-muted) / <alpha-value>)',
        bubble:  'rgb(var(--c-user-bubble) / <alpha-value>)',
      },
      boxShadow: {
        'glow':    '0 0 20px rgba(124,58,237,0.35), 0 0 60px rgba(124,58,237,0.1)',
        'glow-sm': '0 0 10px rgba(124,58,237,0.2)',
        'card':    '0 1px 3px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-up':   'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':  'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 0.25s ease forwards',
        'shimmer':   'shimmer 1.6s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:'0', transform:'translateY(10px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        scaleIn:  { from:{ opacity:'0', transform:'scale(0.96)' }, to:{ opacity:'1', transform:'scale(1)' } },
        fadeIn:   { from:{ opacity:'0' }, to:{ opacity:'1' } },
        shimmer:  { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}