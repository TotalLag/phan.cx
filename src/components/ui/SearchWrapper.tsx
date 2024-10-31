import { type Component } from 'solid-js'
import { SearchProvider } from '../../stores/searchStore'
import SearchInputLogic from './SearchInputLogic'
import type { SearchContextType } from '../../stores/searchStore'

interface Props {
  placeholder?: string;
}

const SearchWrapper: Component<Props> = (props) => {
  return (
    <SearchProvider>
      <SearchInputLogic placeholder={props.placeholder} />
    </SearchProvider>
  )
}

export default SearchWrapper
