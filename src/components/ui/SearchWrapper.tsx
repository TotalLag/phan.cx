import { type Component, createSignal, onMount, Show } from 'solid-js';
import { SearchProvider } from '../../stores/searchStore';
import SearchInputLogic from './SearchInputLogic';
import { createLogger } from '../../utils/logger';

const searchWrapperLogger = createLogger('SearchWrapper');

interface Props {
  placeholder?: string;
}

const SearchWrapper: Component<Props> = (props) => {
  const [isReady, setReady] = createSignal(false);

  searchWrapperLogger.debug('Initializing SearchWrapper component');

  onMount(() => {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      setReady(true);
      searchWrapperLogger.debug('SearchWrapper component ready');
    }, 0);
  });

  return (
    <Show
      when={isReady()}
      fallback={
        <div class="relative h-[38px] w-full overflow-hidden rounded bg-surface-secondary">
          <div class="image-shimmer" />
        </div>
      }
    >
      <SearchProvider>
        <SearchInputLogic placeholder={props.placeholder} />
      </SearchProvider>
    </Show>
  );
};

export default SearchWrapper;
