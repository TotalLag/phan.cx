import {
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
  type Component,
} from 'solid-js';
import { useSearch } from '../../stores/searchStore';
import { getSnippet } from '../../utils/search';
import type { SearchResult } from '../../types/search';
import { createLogger } from '../../utils/logger';

const searchInputLogger = createLogger('SearchInputLogic');

interface Props {
  placeholder?: string;
}

const SearchInputLogic: Component<Props> = (props) => {
  const store = useSearch();
  const [isOpen, setIsOpen] = createSignal(false);
  let searchRef: HTMLDivElement | undefined;

  searchInputLogger.debug('Initializing SearchInputLogic component');

  // Create stable function references
  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef && !searchRef.contains(event.target as Node)) {
      searchInputLogger.debug('Clicked outside search input, closing results');
      setIsOpen(false);
    }
  };

  const handleNavigationReset = () => {
    searchInputLogger.debug('Resetting navigation state');
    store.setIsNavigating(false);
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      searchInputLogger.debug('Adding event listeners for search input');
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('load', handleNavigationReset);
      document.addEventListener('astro:after-swap', handleNavigationReset);
      
      // Initial navigation state
      handleNavigationReset();
    }
  });

  onCleanup(() => {
    if (typeof window !== 'undefined') {
      searchInputLogger.debug('Removing event listeners for search input');
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('load', handleNavigationReset);
      document.removeEventListener('astro:after-swap', handleNavigationReset);
    }
  });

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const query = e.currentTarget.value;
    searchInputLogger.debug(`Search input changed: ${query}`);
    store.setQuery(query);
    setIsOpen(true);
  };

  const handleResultClick = () => {
    searchInputLogger.info('Search result clicked, navigating');
    store.setIsNavigating(true);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} class="w-full">
      <div class="relative">
        <input
          type="search"
          value={store.query()}
          onInput={handleInput}
          placeholder={props.placeholder}
          class="search-input"
          role="searchbox"
          autocomplete="off"
          spellcheck={false}
          disabled={!store.isInitialized()}
        />
        <div class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
          <Show
            when={store.isNavigating() || !store.isInitialized()}
            fallback={
              <svg
                class="h-5 w-5 text-icon-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          >
            <svg
              class="h-5 w-5 animate-spin text-icon-muted"
              xmlns="http://www.w3.org/2000/svg"
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
          </Show>
        </div>
      </div>

      <Show
        when={
          isOpen() && store.query().trim().length >= 3 && store.isInitialized()
        }
      >
        <div class="absolute z-modal mt-2 max-h-[80vh] w-full overflow-y-auto rounded-lg border border-border bg-surface-primary shadow-lg">
          <Show when={!store.isLoading()}>
            <Show when={store.results().length > 0}>
              <div class="divide-y divide-border">
                <For each={store.results()}>
                  {(result: SearchResult) => (
                    <a
                      href={result.url}
                      onClick={handleResultClick}
                      class="block p-3 transition-colors duration-base ease-soft hover:bg-surface-hover"
                    >
                      {/* Title */}
                      <div class="text-primary font-medium">
                        {result.matches.title.positions.length > 0 ? (
                          <span
                            innerHTML={getSnippet(
                              result.title,
                              result.matches.title.positions[0],
                              100
                            )}
                          />
                        ) : (
                          result.title
                        )}
                      </div>

                      {/* Excerpt */}
                      <div class="text-secondary mt-1 text-sm">
                        {result.matches.excerpt.positions.length > 0 ? (
                          <span
                            innerHTML={getSnippet(
                              result.excerpt,
                              result.matches.excerpt.positions[0],
                              100
                            )}
                          />
                        ) : (
                          result.excerpt
                        )}
                      </div>

                      {/* Content matches - limited to top 2 */}
                      <Show when={result.matches.content.positions.length > 0}>
                        <div class="text-muted -mx-3 mt-2 space-y-1 px-3 py-2 text-xs">
                          <div class="rounded bg-surface-secondary px-3">
                            <For each={result.matches.content.positions}>
                              {(position) => (
                                <div
                                  innerHTML={getSnippet(
                                    result.content,
                                    position
                                  )}
                                />
                              )}
                            </For>
                          </div>
                        </div>
                      </Show>
                    </a>
                  )}
                </For>
              </div>
            </Show>

            <Show when={store.results().length === 0}>
              <div class="text-muted p-4 text-center">No results found</div>
            </Show>
          </Show>

          <Show when={store.isLoading()}>
            <div class="text-muted p-4 text-center">Searching...</div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default SearchInputLogic;
