import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-gold': 'var(--color-warm-gold)',
        'honey': 'var(--color-honey)',
        'earth-brown': 'var(--color-earth-brown)',
        'dark-brown': 'var(--color-dark-brown)',
        'cream': 'var(--color-cream)',
        'warm-white': 'var(--color-warm-white)',
        'sage': 'var(--color-sage)',
        'sage-light': 'var(--color-sage-light)',
        'ivory': 'var(--color-ivory)',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'pill': 'var(--radius-pill)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'premium': 'var(--shadow-md)',
        'elevated': 'var(--shadow-lg)',
        'glow': 'var(--shadow-glow)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'luxe': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

export default config
