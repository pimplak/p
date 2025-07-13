module.exports = {
  plugins: {
    'postcss-preset-mantine': {
      autoRem: true, // Automatically converts px to rem
    },
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    'postcss-nested': {},
  },
};
