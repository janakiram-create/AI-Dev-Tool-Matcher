/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEEDF9',
          100: '#D5D3F2',
          200: '#ABA8E4',
          300: '#817DD7',
          400: '#5752C9',
          500: '#534AB7',
          600: '#453D99',
          700: '#363079',
          800: '#272258',
          900: '#181438',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
