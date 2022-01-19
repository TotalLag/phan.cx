<script>
  let className = '';
  export { className as class };
  export let data,
    isActive = false;

  import { scale } from 'svelte/transition';
  import SvelteMarkdown from 'svelte-markdown';

  let show = false; // menu state
  let menu = null; // menu wrapper DOM reference

  const handleClick = (event) => {
    show = !show;
    localStorage.setItem('phan_ids', getNewIdList());
  };

  const handleOutsideClick = (event) => {
    if (show && !menu.contains(event.target)) {
      show = false;
    }
  };

  const handleEscape = (event) => {
    if (show && event.key === 'Escape') {
      show = false;
    }
  };

  const getNewIdList = () => {
    return data.map((e) => e.id);
  };

  const getStoredIdList = () => {
    return localStorage.getItem('phan_ids') || [];
  };

  Array.prototype.diff = function (arr2) {
    return this.filter((x) => !arr2.includes(x));
  };

  $: if (typeof window !== 'undefined') {
    isActive = !show && getNewIdList().diff(getStoredIdList())?.length !== 0;
  }
</script>

<style global lang="postcss">
  /* purgecss start ignore */
  .github {
    @apply leading-relaxed text-xs;
  }

  @screen sm {
    .github {
      @apply text-sm;
    }
  }

  /* Headers */
  .github h1,
  .github h2,
  .github h3 {
    @apply text-base mt-0 font-semibold;
  }
  .github h4,
  .github h5,
  .github h6 {
    @apply text-sm mt-0 font-semibold;
  }

  @screen sm {
    .github h1,
    .github h2 {
      @apply text-base;
    }
    .github h3,
    .github h4,
    .github h5,
    .github h6 {
      @apply text-sm;
    }
  }

  /* Links */
  .github a {
    @apply text-blue-600;
  }
  .github a:hover {
    @apply underline;
  }
  /* Paragraph */
  .github p {
    @apply mb-4;
  }
  /* Lists */
  .github ul {
    @apply mb-4 ml-8;
  }
  .github li > p,
  .github li > ul {
    @apply mb-0;
  }
  .github ul {
    @apply list-disc;
  }
  /* purgecss end ignore */
</style>

<svelte:window on:keyup={handleEscape} on:click={handleOutsideClick} />

<div class={className} bind:this={menu}>
  <button on:click={handleClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 {show ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
    <span
      class="absolute top-1 right-0.5 block h-1 w-1 rounded-full {isActive
        ? 'animate-ping ring-2 ring-red-400 bg-red-600'
        : ''}"
    />
  </button>

  {#if show}
    <div
      in:scale={{ duration: 100, start: 0.95 }}
      out:scale={{ duration: 75, start: 0.95 }}
      class="absolute z-50 py-2 mt-1 overflow-y-auto origin-top-right bg-white border border-gray-200 rounded shadow-md -right-5 sm:right-0 w-80 sm:w-96 h-80"
    >
      <ul class="absolute left-0 right-0 p-2 bg-white rounded-md">
        <li class="px-5 pb-2 mb-2 text-xs text-gray-400 uppercase border-b border-solid border-gray">Releases</li>

        {#if data}
          {#each data as release}
            <li class="flex items-start px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 github">
              <div class="flex flex-col w-24 text-xs">
                <span class="flex p-2"
                  >{new Date(release.date).toLocaleString('default', { month: 'short', day: 'numeric' })}</span
                >
                <span class="flex items-center">
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    class="octicon octicon-tag"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"
                    />
                  </svg>
                  <span class="p-2">{release.tag} </span>
                </span>
              </div>
              <div class="flex flex-col pl-2 border-l border-solid border-gray">
                <h3>{release.name}</h3>
                <div class="mt-1 text-sm text-gray-600 font-regular github">
                  <SvelteMarkdown source={release.body.replace(/(\r\n|\\r)/gm, '')} />
                </div>
              </div>
            </li>
          {/each}
        {:else}
          <li class="flex items-start px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 github">
            <div class="flex flex-col pl-2 border-l border-solid border-gray">
              <h3>Error</h3>
              <div class="mt-1 text-sm text-gray-600 font-regular github">There was a problem getting data.</div>
            </div>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</div>
