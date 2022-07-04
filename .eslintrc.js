module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  /**
   * 0或off 表示关闭规则
   * warn或1 表示打开规则作为警告 （不会中断代码）
   * error或2 表示打开规则作为错误抛出（会中断代码）
   */
  rules: {
    'no-undef': 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
    'react/function-component-definition': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/button-has-type': 'off',
    eqeqeq: 2,
  },
};
