module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier'
  ],
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      customSyntax: '@stylelint/postcss-css-in-js',
      rules: {
        'string-quotes': null,
        'declaration-colon-newline-after': null,
        'no-eol-whitespace': null,
        'no-missing-end-of-source-newline': null,
        'no-empty-first-line': null,
        'function-name-case': null,
        'function-no-unknown': null
      }
    }
  ]
}