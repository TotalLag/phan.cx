import { type Component, createSignal, onMount, Show } from 'solid-js'
import { SearchProvider } from '../../stores/searchStore'
import SearchInputLogic from './SearchInputLogic'

interface Props {
  placeholder?: string;
}

const SearchWrapper: Component<Props> = (props) => {
  const [isReady, setReady] = createSignal(false)
  
  onMount(() => {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => setReady(true), 0)
  })

  return (
    <Show when={isReady()} fallback={
      <div class="relative w-full h-[38px] bg-surface-secondary rounded overflow-hidden">
        <div class="image-shimmer" />
      </div>
    }>
      <SearchProvider>
        <SearchInputLogic placeholder={props.placeholder} />
      </SearchProvider>
    </Show>
  )
}

export default SearchWrapper
