/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.njk', './_site/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#2e4066',
          700: '#243352',
          800: '#1a2640',
          900: '#0f172a',
          950: '#0a0e1a',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        'site': '1152px',
      },
      animation: {
        'fade-up': 'fadeUp 600ms ease-out forwards',
        'fade-in': 'fadeIn 400ms ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
