import { onMount, onCleanup } from 'solid-js';
import { theme, initializeTheme, type Theme } from '../stores/theme';

export default function ThemeScript() {
  onMount(() => {
    // Initialize theme
    initializeTheme();

    // Handle view transitions
    const handleBeforePreparation = () => {
      // Store current theme state before navigation starts
      const currentTheme = theme();
      localStorage.setItem('theme', currentTheme);
    };

    const handleBeforeSwap = (event: any) => {
      // Apply theme to the new document before it becomes visible
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        event.newDocument.documentElement.classList.remove('light', 'dark');
        event.newDocument.documentElement.classList.add(savedTheme);
      }
    };

    // Handle system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemTheme = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    };

    // Add event listeners
    document.addEventListener('astro:before-preparation', handleBeforePreparation);
    document.addEventListener('astro:before-swap', handleBeforeSwap);
    mediaQuery.addEventListener('change', handleSystemTheme);

    // Cleanup
    onCleanup(() => {
      document.removeEventListener('astro:before-preparation', handleBeforePreparation);
      document.removeEventListener('astro:before-swap', handleBeforeSwap);
      mediaQuery.removeEventListener('change', handleSystemTheme);
    });
  });

  return null;
}
