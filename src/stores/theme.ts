import { createSignal, createEffect } from 'solid-js';
import { createLogger } from '../utils/logger';

// Create a module-specific logger
const themeLogger = createLogger('ThemeStore');

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (savedTheme) {
    themeLogger.debug(`Retrieved saved theme: ${savedTheme}`);
    return savedTheme;
  }

  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = prefersDarkMode ? 'dark' : 'light';
  
  themeLogger.debug(`Determined initial theme based on system preference: ${initialTheme}`);
  return initialTheme;
}

// Create theme signal
const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

// Update document class when theme changes
function updateDocumentClass(newTheme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
  
  themeLogger.debug(`Updated document class to: ${newTheme}`);
}

// Toggle theme function
function toggleTheme(): void {
  const newTheme: Theme = theme() === 'dark' ? 'light' : 'dark';
  
  themeLogger.info(`Toggling theme from ${theme()} to ${newTheme}`);
  
  // Update theme signal
  setTheme(newTheme);
  
  // Persist theme preference
  localStorage.setItem(STORAGE_KEY, newTheme);
  
  // Update document class
  updateDocumentClass(newTheme);
}

// Initialize theme and handle system preference changes
function initializeTheme(): () => void {
  const currentTheme = getInitialTheme();
  
  // Set initial theme
  setTheme(currentTheme);
  updateDocumentClass(currentTheme);
  
  themeLogger.info(`Initializing theme: ${currentTheme}`);

  // Handle Astro view transitions
  const handleBeforePreparation = (event: any) => {
    const currentTheme = theme();
    themeLogger.debug(`Saving current theme before navigation: ${currentTheme}`);
    localStorage.setItem(STORAGE_KEY, currentTheme);
  };

  const handleBeforeSwap = (event: any) => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme;
    themeLogger.debug(`Applying saved theme during navigation: ${savedTheme}`);
    
    if (savedTheme) {
      event.newDocument.documentElement.classList.remove('light', 'dark');
      event.newDocument.documentElement.classList.add(savedTheme);
    }
  };

  // Add event listeners for Astro view transitions
  document.addEventListener('astro:before-preparation', handleBeforePreparation);
  document.addEventListener('astro:before-swap', handleBeforeSwap);

  // Handle system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleThemeChange = (e: MediaQueryListEvent) => {
    // Only change if no theme is explicitly set
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (!savedTheme) {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      
      themeLogger.debug(`System theme changed. New theme: ${newTheme}`);
      
      setTheme(newTheme);
      updateDocumentClass(newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleThemeChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('astro:before-preparation', handleBeforePreparation);
    document.removeEventListener('astro:before-swap', handleBeforeSwap);
    mediaQuery.removeEventListener('change', handleThemeChange);
  };
}

export { theme, setTheme, toggleTheme, initializeTheme, updateDocumentClass };
