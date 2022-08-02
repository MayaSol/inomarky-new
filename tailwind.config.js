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
    fontSize: {
      sm: ['16px', '24px'],
      base: ['18px', '27px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
      xxl: ['28px', '34px']
    },
    extend: {
      spacing: {
        "25": "25px"
      },
      colors: {
        gray: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#f1f2f3',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#5e5d72',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        '1/2': '1fr 2fr',
        '1/3': '1fr 3fr'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
  corePlugins: {
    boxShadow: false,
    aspectRatio: false,
  },
}
