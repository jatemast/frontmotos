/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: '#0F1215',
          900: '#15181C',
          800: '#1E2227',
          700: '#262B31',
          600: '#333A42',
          500: '#4A535C',
        },
        headlight: {
          400: '#F6B45C',
          500: '#F2A33D',
          600: '#D9862A',
        },
        steel: {
          400: '#5FC2BE',
          500: '#3FA7A4',
          600: '#2C8683',
        },
        ember: {
          400: '#F0757A',
          500: '#E5484D',
          600: '#C13B40',
        },
        moss: {
          400: '#8CD98F',
          500: '#6FCF7B',
          600: '#4FAE5C',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
