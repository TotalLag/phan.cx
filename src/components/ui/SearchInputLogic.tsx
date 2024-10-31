import { createSignal, onMount, onCleanup, Show, For, type Component } from 'solid-js'
import { useSearch } from '../../stores/searchStore'
import { cleanDisplayText, getSnippet } from '../../utils/search'

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
    }
  })

  onCleanup(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    store.setQuery(e.currentTarget.value)
    setIsOpen(true)
  }

  return (
    <div ref={searchRef} class="w-full">
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

      <Show when={isOpen() && store.query().trim().length >= 3}>
        <div class="absolute z-modal w-full mt-2 border rounded-lg shadow-lg border-border bg-surface-primary max-h-[80vh] overflow-y-auto">
          <Show when={!store.isLoading()}>
            <Show when={store.results().length > 0}>
              <div class="divide-y divide-border">
                <For each={store.results()}>
                  {(result) => (
                    <a
                      href={result.url}
                      class="block p-3 hover:bg-surface-hover transition-colors duration-base ease-soft"
                    >
                      {/* Title */}
                      <div class="font-medium text-text-primary">
                        {result.match.title ? (
                          <For each={result.terms}>
                            {(term) => (
                              <span innerHTML={getSnippet(result.title, term, result.match.title[0][0])} />
                            )}
                          </For>
                        ) : (
                          cleanDisplayText(result.title)
                        )}
                      </div>

                      {/* Excerpt */}
                      <div class="text-sm text-text-secondary mt-1">
                        {result.match.excerpt ? (
                          <For each={result.terms}>
                            {(term) => (
                              <span innerHTML={getSnippet(result.excerpt, term, result.match.excerpt[0][0])} />
                            )}
                          </For>
                        ) : (
                          cleanDisplayText(result.excerpt)
                        )}
                      </div>

                      {/* Content matches */}
                      <Show when={result.match.content?.length}>
                        <div class="text-sm text-text-muted mt-2 space-y-1">
                          <For each={result.match.content}>
                            {(contentMatch) => (
                              <For each={result.terms}>
                                {(term) => (
                                  <div innerHTML={getSnippet(result.content, term, contentMatch[0])} />
                                )}
                              </For>
                            )}
                          </For>
                        </div>
                      </Show>
                    </a>
                  )}
                </For>
              </div>
            </Show>

            <Show when={store.results().length === 0}>
              <div class="p-4 text-center text-text-muted">
                No results found
              </div>
            </Show>
          </Show>

          <Show when={store.isLoading()}>
            <div class="p-4 text-center text-text-muted">
              Searching...
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default SearchInputLogic
