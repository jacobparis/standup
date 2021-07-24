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
        blue: {
          950: '#242C42',
        },
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
