import type { Component } from 'solid-js';
import { Switch, Match, createSignal, onMount } from 'solid-js';
import CircleButton from './CircleButton';
import { toggleTheme, theme } from '../../stores/theme';
import { createLogger } from '../../utils/logger';

const themeToggleLogger = createLogger('ThemeToggle');

const ThemeToggle: Component = () => {
  const [isReady, setReady] = createSignal(false);

  themeToggleLogger.debug('Initializing ThemeToggle component');

  onMount(() => {
    // Wait for next tick to ensure theme is initialized
    setTimeout(() => {
      setReady(true);
      themeToggleLogger.debug(`Theme initialized: ${theme()}`);
    }, 0);
  });

  return (
    <CircleButton
      label={
        theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      onClick={() => {
        themeToggleLogger.info(`Toggling theme from ${theme()} to ${theme() === 'dark' ? 'light' : 'dark'}`);
        toggleTheme();
      }}
    >
      <Switch>
        <Match when={!isReady()}>
          <svg
            class="h-5 w-5 animate-spin text-icon"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </Match>
        <Match when={theme() === 'dark'}>
          <svg
            class="h-5 w-5 text-icon hover:text-icon-hover"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </Match>
        <Match when={true}>
          <svg
            class="h-5 w-5 text-icon hover:text-icon-hover"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </Match>
      </Switch>
    </CircleButton>
  );
};

export default ThemeToggle;
