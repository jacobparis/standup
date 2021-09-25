const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  purge: {
    content: ['./src/**/*.js', './src/**/*.mdx', './src/**/*.tsx'],
    options: {
      safelist: [
        'dark',
        'bg-green-300',
        'border-green-500',
        'bg-gray-50',
        'form-input',
      ],
    },
  },
  theme: {
    typography: (theme) => ({}),
    extend: {
      screens: {
        print: {raw: 'print'},
        screen: {raw: 'screen'},
      },
      colors: {
        blue: colors.sky,
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: 'white',
          },
        },
      }),
    },
  },
  variants: {
    typography: ['dark'],
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
