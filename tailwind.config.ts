import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Brand colors from the reference files
      colors: {
        // Primary Brand (Green System)
        brand: {
          deepest: '#061D14',
          deep: '#134232',
          DEFAULT: '#245542',
          light: '#4a7b6f',
        },
        // Accent (Gold/Tan)
        accent: {
          DEFAULT: '#AB9F80',
          light: '#C9B892',
          dark: '#d4a574',
        },
        // Neutral
        surface: {
          bg: '#F6F6F6',
          DEFAULT: '#FFFFFF',
          subtle: '#FDFCFA',
          muted: '#f8f6f3',
        },
        // Semantic colors
        border: '#E3E6E5',
        input: '#E3E6E5',
        ring: '#AB9F80',
        background: '#FDFDFD',
        foreground: '#201F1E',
        // Status colors
        status: {
          published: '#10b981',
          pending: '#f59e0b',
          review: '#3b82f6',
          draft: '#6b7280',
          rejected: '#ef4444',
        },
        // Add emerald colors for the badge classes
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'IBM Plex Sans Arabic Fallback', 'Noto Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
