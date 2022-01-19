<script>
  export let name, location;
</script>

<div class="flex sm:flex-col">
  <div
    class="relative w-10 h-10 overflow-hidden border-red-400 rounded-full shadow-xl sm:w-24 sm:h-24 sm:mx-auto border-1 sm:border-4"
  >
    <slot />
  </div>
  <div class="ml-3 sm:ml-0">
    <span class="block text-sm antialiased font-semibold leading-tight text-gray-800 sm:pt-4 sm:text-base sm:font-bold"
      >{name}</span
    >
    <span class="block text-xs font-semibold text-gray-400 sm:text-base">{location}</span>
  </div>
</div>
