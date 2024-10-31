import { createSignal, onMount, onCleanup, Show, For, type Component } from 'solid-js'
import { useSearch } from '../../stores/searchStore'
import { getSnippet } from '../../utils/search'
import type { SearchResult } from '../../types/search'

interface Props {
  placeholder?: string;
}

const SearchInputLogic: Component<Props> = (props) => {
  const store = useSearch()
  const [isOpen, setIsOpen] = createSignal(false)
  let searchRef: HTMLDivElement | undefined

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef && !searchRef.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', handleClickOutside)
      // Reset navigation state on mount
      store.setIsNavigating(false)

      // Handle Astro view transitions
      document.addEventListener('astro:after-swap', () => {
        store.setIsNavigating(false)
      })

      // Fallback for regular navigation
      window.addEventListener('load', () => store.setIsNavigating(false))
    }
  })

  onCleanup(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('load', () => store.setIsNavigating(false))
      document.removeEventListener('astro:after-swap', () => store.setIsNavigating(false))
    }
  })

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    store.setQuery(e.currentTarget.value)
    setIsOpen(true)
  }

  const handleResultClick = (e: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
    store.setIsNavigating(true)
    setIsOpen(false)
  }

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
        />
        <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Show 
            when={store.isNavigating()}
            fallback={
              <svg 
                class="w-5 h-5 text-icon-muted" 
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
              class="w-5 h-5 animate-spin text-icon-muted"
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

      <Show when={isOpen() && store.query().trim().length >= 3}>
        <div class="absolute z-modal w-full mt-2 border rounded-lg shadow-lg border-border bg-surface-primary max-h-[80vh] overflow-y-auto">
          <Show when={!store.isLoading()}>
            <Show when={store.results().length > 0}>
              <div class="divide-y divide-border">
                <For each={store.results()}>
                  {(result: SearchResult) => (
                    <a
                      href={result.url}
                      onClick={handleResultClick}
                      class="block p-3 hover:bg-surface-hover transition-colors duration-base ease-soft"
                    >
                      {/* Title */}
                      <div class="font-medium text-primary">
                        {result.matches.title.positions.length > 0 ? (
                          <span innerHTML={getSnippet(result.title, result.matches.title.positions[0], 100)} />
                        ) : (
                          result.title
                        )}
                      </div>

                      {/* Excerpt */}
                      <div class="text-sm text-secondary mt-1">
                        {result.matches.excerpt.positions.length > 0 ? (
                          <span innerHTML={getSnippet(result.excerpt, result.matches.excerpt.positions[0], 100)} />
                        ) : (
                          result.excerpt
                        )}
                      </div>

                      {/* Content matches - limited to top 2 */}
                      <Show when={result.matches.content.positions.length > 0}>
                        <div class="px-3 py-2 mt-2 -mx-3 space-y-1 text-xs text-muted">
                          <div class="px-3 bg-surface-secondary rounded">
                            <For each={result.matches.content.positions}>
                              {(position) => (
                                <div innerHTML={getSnippet(result.content, position)} />
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
              <div class="p-4 text-center text-muted">
                No results found
              </div>
            </Show>
          </Show>

          <Show when={store.isLoading()}>
            <div class="p-4 text-center text-muted">
              Searching...
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default SearchInputLogic
