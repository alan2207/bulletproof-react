module.exports = {
  root: true,
  plugins: ['eslint-plugin-cypress'],
  parser: '@typescript-eslint/parser',
  env: { 'cypress/globals': true },
};
