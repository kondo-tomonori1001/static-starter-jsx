module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': [
      true,
      { semi: true, singleQuote: true, trailingComma: 'all' },
    ],
  },
};
