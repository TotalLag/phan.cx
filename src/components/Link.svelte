<script>
  export let link, text, request;
  let isActive = false;

  $: isActive = request.permalink == link || request.permalink.split('/')[1] == link.split('/')[1];
</script>

<a href={link}>
  <div
    class="flex py-2 pr-5 m-2 text-center text-gray-700 {isActive
      ? 'border-red-500'
      : 'border-transparent'} border-b-2 sm:border-b-0 sm:border-l-4"
  >
    <div class="flex inline-flex sm:ml-6">
      <button
        class="{isActive
          ? 'text-gray-800'
          : 'text-gray-400'} rounded-full hover:text-blue-600 focus:outline-none focus:text-gray-600"
        aria-label={text}
      >
        <slot />
      </button>
    </div>
    <div class="flex inline-flex mt-1 ml-2 sm:ml-6">
      <h2 class="mr-2 text-sm {isActive ? 'font-bold text-gray-800' : 'font-medium text-gray-400'}">{text}</h2>
    </div>
  </div>
</a>
