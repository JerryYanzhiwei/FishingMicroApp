module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:tt/recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'tt/attribute-per-line': ['error', { maxAttributes: 4 }],
  },
  plugins: ['tt', 'prettier'],
  // 添加文件处理器配置
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.ttml', '.json']
      }
    }
  }
};
