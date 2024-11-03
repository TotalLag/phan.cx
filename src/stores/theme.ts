import { createSignal } from 'solid-js';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (savedTheme) return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

function toggleTheme(): void {
  const newTheme: Theme = theme() === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
  updateDocumentClass(newTheme);
}

function updateDocumentClass(newTheme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
}

function initializeTheme(): void {
  const currentTheme = theme();
  updateDocumentClass(currentTheme);

  // Handle system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const userTheme = localStorage.getItem(STORAGE_KEY);
      if (!userTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        updateDocumentClass(newTheme);
      }
    });
}

export { theme, toggleTheme, initializeTheme, type Theme };
