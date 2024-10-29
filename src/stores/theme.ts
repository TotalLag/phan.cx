import { createSignal } from 'solid-js';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

// Create a signal to track theme state
const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (savedTheme) return savedTheme;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Toggle theme function
function toggleTheme(): void {
  const newTheme: Theme = theme() === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme);
  updateDocumentClass(newTheme);
}

// Update document class
function updateDocumentClass(newTheme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(newTheme);
}

// Initialize theme on page load and handle view transitions
function initializeTheme(): void {
  // Apply theme immediately
  const currentTheme = theme();
  updateDocumentClass(currentTheme);

  if (typeof window === 'undefined') return;

  // Handle system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const userTheme = localStorage.getItem(STORAGE_KEY);
    // Only update if user hasn't manually set a theme
    if (!userTheme) {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      updateDocumentClass(newTheme);
    }
  });
}

export { theme, toggleTheme, initializeTheme, type Theme };
