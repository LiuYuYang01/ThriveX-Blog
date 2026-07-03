import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        primary: '#539dfd', // 添加自定义颜色
        'black-a': '#232931',
        'black-b': '#2c333e',
        // 微信朋友圈风格
        wx: {
          bg: '#ededed',
          blue: '#576b95',
          text: '#111111',
          gray: '#f7f7f7',
          light: '#b2b2b2',
          border: '#e5e5e5',
        },
      },
      boxShadow: {
        'wx-menu': '0 0 8px rgba(0, 0, 0, 0.15)',
        'like-btn': '0 8px 24px rgba(244, 63, 94, 0.45), 0 0 0 4px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
        'like-btn-hover': '0 12px 32px rgba(244, 63, 94, 0.55), 0 0 0 6px rgba(244, 63, 94, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        'like-btn-combo': '0 12px 36px rgba(244, 63, 94, 0.65), 0 0 0 8px rgba(251, 146, 60, 0.25), 0 0 40px rgba(244, 63, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        'like-hero': '0 2px 8px rgba(233, 30, 99, 0.4)',
        'like-combo': '0 4px 14px rgba(239, 68, 68, 0.45)',
      },
      keyframes: {
        'like-heart-pop': {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.28) rotate(-8deg)' },
          '50%': { transform: 'scale(0.92) rotate(4deg)' },
          '75%': { transform: 'scale(1.12) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'like-particle-float': {
          '0%': { opacity: '1', transform: 'translate(0, 0) scale(0.6) rotate(0deg)' },
          '100%': {
            opacity: '0',
            transform: 'translate(var(--tx, 0), var(--ty, -48px)) scale(1.2) rotate(var(--rot, 15deg))',
          },
        },
        'like-ripple': {
          '0%': { opacity: '0.8', transform: 'scale(0.85)' },
          '100%': { opacity: '0', transform: 'scale(1.8)' },
        },
        'like-number-bump': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.45)' },
          '100%': { transform: 'scale(1)' },
        },
        'like-combo-pop': {
          '0%': { transform: 'scale(0.5) translateY(4px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'like-combo-shake': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '20%': { transform: 'rotate(-6deg) scale(1.05)' },
          '40%': { transform: 'rotate(6deg) scale(1.08)' },
          '60%': { transform: 'rotate(-4deg) scale(1.05)' },
          '80%': { transform: 'rotate(3deg) scale(1.02)' },
        },
        'like-glow-pulse': {
          '0%': { opacity: '0.8', transform: 'scale(0.9)' },
          '100%': { opacity: '0', transform: 'scale(1.4)' },
        },
      },
      animation: {
        'like-heart-pop': 'like-heart-pop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'like-particle-float': 'like-particle-float 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'like-ripple': 'like-ripple 0.65s ease-out forwards',
        'like-number-bump': 'like-number-bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'like-combo-pop': 'like-combo-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'like-combo-shake': 'like-combo-shake 0.28s ease-in-out',
        'like-glow-pulse': 'like-glow-pulse 0.6s ease-out',
      },
      transitionDuration: {
        'DEFAULT': '300ms', // 添加默认过渡时间为0.3秒
      }
    },
  },
  darkMode: 'class',
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          background: '#232931',
        },
      },
    }
  })]
};
export default config;
