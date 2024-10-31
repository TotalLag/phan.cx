import { onMount, onCleanup } from 'solid-js';
import { theme, initializeTheme, type Theme } from '../stores/theme';

export default function ThemeScript() {
  onMount(() => {
    // Initialize theme immediately
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

    // Add event listeners
    document.addEventListener('astro:before-preparation', handleBeforePreparation);
    document.addEventListener('astro:before-swap', handleBeforeSwap);

    // Cleanup
    onCleanup(() => {
      document.removeEventListener('astro:before-preparation', handleBeforePreparation);
      document.removeEventListener('astro:before-swap', handleBeforeSwap);
    });
  });

  return null;
}
