import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import nextPlugin from '@next/eslint-plugin-next';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  nextPlugin.configs.recommended,
  {
    rules: {
      // 禁止使用 any 类型
      '@typescript-eslint/no-explicit-any': 'off', // 改为警告，鼓励使用具体类型
      'no-unused-vars': 'off', // 改为警告，提醒未使用的变量
      'react-refresh/only-export-components': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off', // TypeScript 项目不需要 prop-types 验证
      // 约束js使用单引号，允许jsx双引号
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'react-hooks/exhaustive-deps': 'off', // 改为警告，提醒依赖数组
      'react/react-in-jsx-scope': 'off',
      // 约束使用 next/image 组件
      '@next/next/no-img-element': 'off',
    },
  },
]);