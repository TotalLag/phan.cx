import { createSignal } from 'solid-js';
import { createLogger } from '../utils/logger';

// Create a module-specific logger
const themeLogger = createLogger('ThemeStore');

type Theme = 'light' | 'dark';
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

const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

function toggleTheme(): void {
  const newTheme: Theme = theme() === 'dark' ? 'light' : 'dark';
  
  themeLogger.info(`Toggling theme from ${theme()} to ${newTheme}`);
  
  setTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
  updateDocumentClass(newTheme);
}

function updateDocumentClass(newTheme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
  
  themeLogger.debug(`Updated document class to: ${newTheme}`);
}

function initializeTheme(): void {
  const currentTheme = theme();
  updateDocumentClass(currentTheme);
  
  themeLogger.info(`Initializing theme: ${currentTheme}`);

  // Handle system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const userTheme = localStorage.getItem(STORAGE_KEY);
      if (!userTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        
        themeLogger.debug(`System theme changed. New theme: ${newTheme}`);
        
        setTheme(newTheme);
        updateDocumentClass(newTheme);
      }
    });
}

export { theme, toggleTheme, initializeTheme, type Theme };
