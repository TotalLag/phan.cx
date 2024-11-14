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
        xs: 'clamp(0.625rem, calc(0.625rem + 0.2vw), 0.75rem)',
        sm: 'clamp(0.875rem, calc(0.875rem + 0.25vw), 1rem)',
        base: 'clamp(1rem, calc(1rem + 0.25vw), 1.125rem)',
        lg: 'clamp(1.125rem, calc(1.125rem + 0.5vw), 1.375rem)',
        xl: 'clamp(1.25rem, calc(1.25rem + 0.75vw), 1.75rem)',
        '2xl': 'clamp(1.5rem, calc(1.5rem + 1vw), 2.25rem)',
      },
      colors: {
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
          disabled: 'var(--surface-disabled)',
        },
        border: {
          DEFAULT: 'var(--border)',
          focus: 'var(--border-focus)',
          hover: 'var(--border-hover)',
          disabled: 'var(--border-disabled)',
        },
        icon: {
          DEFAULT: 'var(--icon)',
          muted: 'var(--icon-muted)',
          hover: 'var(--icon-hover)',
          disabled: 'var(--icon-disabled)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
        },
        overlay: {
          light: 'var(--overlay-light)',
          dark: 'var(--overlay-dark)',
          modal: 'var(--overlay-modal)',
        },
      },
      borderColor: {
        profile: 'var(--border-profile)',
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
        'button-p': 'clamp(0.5rem, 2vw, 0.75rem)',
        'input-px': 'clamp(0.75rem, 2.5vw, 1rem)',
        'input-py': 'clamp(0.2rem, 1vw, 0.25rem)',
        'icon-button': 'clamp(0.4rem, 1.5vw, 0.5rem)',
        'dropdown-item': 'clamp(0.4rem, 1.5vw, 0.5rem)',
        section: 'clamp(1.5rem, 5vw, 2rem)',
        'container-px': 'clamp(1rem, 3vw, 1.5rem)',
        stack: 'clamp(1rem, 3vw, 1.5rem)',
        inline: 'clamp(0.5rem, 2vw, 0.75rem)',
        sidebar: 'clamp(220px, 20vw, 260px)',
        profile: 'clamp(5rem, 10vw, 6rem)',
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
        base: '0',
        content: '1',
        dropdown: '1000',
        sticky: '1020',
        sidebar: '1030',
        banner: '1040',
        overlay: '1050',
        modal: '1060',
        popover: '1070',
        toast: '1080',
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
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text-secondary)',
            '--tw-prose-headings': 'var(--text-primary)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-bold': 'var(--text-primary)',
            '--tw-prose-counters': 'var(--text-muted)',
            '--tw-prose-bullets': 'var(--text-muted)',
            '--tw-prose-hr': 'var(--border)',
            '--tw-prose-quotes': 'var(--text-muted)',
            '--tw-prose-quote-borders': 'var(--border)',
            '--tw-prose-captions': 'var(--text-muted)',
            '--tw-prose-code': 'var(--text-primary)',
            '--tw-prose-pre-code': 'var(--text-primary)',
            '--tw-prose-pre-bg': 'var(--surface-tertiary)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
          },
        },
        unrestricted: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
