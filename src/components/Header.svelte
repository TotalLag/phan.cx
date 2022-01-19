<script>
  export let data;
  import Notifications from '../components/Notifications.svelte';
</script>

<div class="flex items-center justify-between h-20 p-4 bg-white border border-l-0 border-gray-200 print:hidden">
  <div
    class="flex items-center w-full p-3 border border-gray-200 rounded-full shadow-sm sm:w-3/4 bg-gray-50 hover:border-gray-400"
  >
    <button class="outline-none focus:outline-none"
      ><svg
        class="w-5 h-5 text-gray-600 cursor-pointer "
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg
      ></button
    >
    <input
      type="search"
      name=""
      id=""
      placeholder="Search"
      x-model="q"
      class="w-full pl-4 text-sm bg-transparent outline-none focus:outline-none"
    />
  </div>

  <Notifications hydrate-client={{ class: 'relative hidden sm:inline-block', data: data.GHData }} />
</div>
