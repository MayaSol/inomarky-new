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
        }
      }
  },
  plugins: [],
  corePlugins: {
    boxShadow: false,
  },
}
