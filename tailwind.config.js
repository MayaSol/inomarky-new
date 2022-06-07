module.exports = {
  content: [
    "./*.html",
    "./vendor/**/*.js",
    "./js/**/*.js"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1024px',
      '2xl': '1200px',
      '3xl': '1440px'
    },
      extend: {
        spacing: {
          "25": "25px"
        },
      colors: {
        gray: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#5e5d72',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      }
      }
  },
  plugins: [],
  corePlugins: {
    boxShadow: false,
  },
}
