/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xs: 'clamp(0.75rem, calc(0.75rem + 0.25vw), 0.875rem)',
        sm: 'clamp(0.875rem, calc(0.875rem + 0.25vw), 1rem)',
        base: 'clamp(1rem, calc(1rem + 0.25vw), 1.125rem)',
        lg: 'clamp(1.125rem, calc(1.125rem + 0.5vw), 1.375rem)',
        xl: 'clamp(1.25rem, calc(1.25rem + 0.75vw), 1.75rem)',
        '2xl': 'clamp(1.5rem, calc(1.5rem + 1vw), 2.25rem)',
      },
      colors: {
        surface: {
          primary: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
          hover: '#f3f4f6',
          active: '#e5e7eb',
          disabled: '#f9fafb',
        },
        border: {
          DEFAULT: '#e5e7eb',
          focus: '#9ca3af',
          hover: '#d1d5db',
          disabled: '#e5e7eb',
        },
        icon: {
          DEFAULT: '#6b7280',
          muted: '#9ca3af',
          hover: '#4b5563',
          disabled: '#d1d5db',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          muted: '#60a5fa',
        },
        overlay: {
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(0, 0, 0, 0.7)',
          modal: 'rgba(0, 0, 0, 0.4)',
        },
      },
      borderColor: {
        profile: '#ee6633', // Orange-500
      },
      borderRadius: {
        input: '9999px',
        button: '9999px',
        card: '0.5rem',
        lg: '0.75rem',
        pill: '9999px',
        profile: '9999px',
      },
      spacing: {
        'button-p': '0.75rem',
        'input-px': '1rem',
        'input-py': '0.25rem',
        'icon-button': '0.5rem',
        'dropdown-item': '0.5rem',
        section: '2rem',
        'container-px': '1.5rem',
        stack: '1.5rem',
        inline: '0.75rem',
        sidebar: '260px',
        profile: '6rem', // 96px for profile image
      },
      boxShadow: {
        button: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        dropdown:
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        modal:
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      zIndex: {
        dropdown: '1000',
        sticky: '1020',
        banner: '1030',
        overlay: '1040',
        modal: '1050',
        popover: '1060',
        toast: '1070',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        modal: '400ms',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        emphasis: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
      },
    },
  },
  plugins: [],
};
