module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:prettier/recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'off'
  },
  parserOptions: {
    ecmaVersion: '2017',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  }
}
