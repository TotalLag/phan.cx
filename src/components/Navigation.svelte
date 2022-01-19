<script>
  export let request;
  import Link from './Link.svelte';
  let blogActive = false;

  $: blogActive = request.route == 'blog';
</script>

<div class="flex flex-row flex-wrap justify-between sm:flex-col sm:-ml-6">
  <Link text="About" link="/" {request}>
    <svg
      class="w-6 h-6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
      />
    </svg>
  </Link>

  <div class="hidden {blogActive ? 'sm:inline' : ''} flex py-2 pr-5 m-2 text-center -ml-4 text-gray-700 bg-gray-50">
    <div class="flex inline-flex mt-1">
      <h3 class="mr-2 text-sm font-bold text-gray-800">Blog</h3>
    </div>
  </div>

  <Link text="Resume" link="/resume/" {request}>
    <svg
      class="w-6 h-6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  </Link>

  <Link text="Projects" link="/projects/" {request}>
    <svg
      class="w-6 h-6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  </Link>

  <Link text="Contact" link="/contact/" {request}>
    <svg
      class="w-6 h-6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  </Link>
</div>
