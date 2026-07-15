/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#12B76A',
          50:  '#f0fdf6',
          100: '#dcfce9',
          500: '#12B76A',
          600: '#0ea05e',
          700: '#0b8a50',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs:   ['12px', '16px'],
        sm:   ['13px', '20px'],
        base: ['14px', '20px'],
      },
    },
  },
  plugins: [],
}

