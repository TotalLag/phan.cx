<div class="flex flex-col p-4 bg-white border border-b-0 border-l-0 border-gray-200 w-fixed">
  <div class="flex hidden font-light h-14 sm:inline">
    <span class="font-light">Spotify Last Played </span>
  </div>

  <div class="flex items-center justify-between px-4 py-3 sm:text-center sm:flex-col">
    <div class="flex sm:flex-col">
      <div
        class="relative w-10 h-10 overflow-hidden border-red-300 rounded-full shadow-xl sm:w-24 sm:h-24 sm:mx-auto border-1 sm:border-4"
      >
        <img
          class="object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1502164980785-f8aa41d53611?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"
        />
      </div>
      <div class="ml-3 sm:ml-0">
        <span
          class="block text-sm antialiased font-semibold leading-tight text-gray-800 sm:pt-4 sm:text-base sm:font-bold"
          >Shinyballs</span
        >
        <span class="block text-xs font-semibold text-gray-400 sm:text-base">Texas, USA</span>
      </div>
    </div>
    <button class="relative inline-block sm:hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-gray-700 hover:text-blue-600"
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
      <span class="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-red-400 bg-red-600" />
    </button>
  </div>

  <div class="hidden sm:inline">
    <hr class="mt-6 mb-6 border-gray-300" />

    <div class="flex flex-row justify-between text-center">
      <div class="flex flex-col items-center w-full">
        <div class="font-bold">123</div>
        <div class="text-xs font-semibold text-gray-400 uppercase">Cups of coffee</div>
      </div>
      <div class="flex flex-col items-center w-full">
        <div class="font-bold">2021</div>
        <div class="text-xs font-semibold text-gray-400 uppercase">Lines of code</div>
      </div>
      <div class="flex flex-col items-center w-full">
        <div class="font-bold">1</div>
        <div class="text-xs font-semibold text-gray-400 uppercase">Cat</div>
      </div>
    </div>

    <hr class="mt-6 mb-6 border-gray-300" />
  </div>

  <div class="flex flex-row justify-between sm:flex-col sm:-ml-6">
    <div class="flex py-2 pr-5 m-2 text-center text-gray-700 border-b-2 border-red-500 sm:border-b-0 sm:border-l-4">
      <div class="flex inline-flex sm:ml-6">
        <button
          class="text-gray-800 border-transparent rounded-full hover:text-blue-600 focus:outline-none focus:text-gray-600"
          aria-label="Notifications"
        >
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
        </button>
      </div>
      <div class="flex inline-flex mt-1 ml-2 sm:ml-6">
        <h3 class="mr-2 text-sm font-bold text-gray-800">About</h3>
      </div>
    </div>

    <div class="flex py-2 pr-5 m-2 text-center text-gray-700 border-b-2 border-transparent sm:border-b-0 sm:border-l-4">
      <div class="flex inline-flex sm:ml-6">
        <button
          class="text-gray-400 border-transparent rounded-full hover:text-blue-600 focus:outline-none focus:text-gray-600"
          aria-label="Notifications"
        >
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
        </button>
      </div>
      <div class="flex inline-flex mt-1 ml-2 sm:ml-6">
        <h3 class="mr-2 text-sm font-medium text-gray-400">Resume</h3>
      </div>
    </div>

    <div class="flex py-2 pr-5 m-2 text-center text-gray-700 border-b-2 border-transparent sm:border-b-0 sm:border-l-4">
      <div class="flex inline-flex sm:ml-6">
        <button
          class="text-gray-400 border-transparent rounded-full hover:text-blue-600 focus:outline-none focus:text-gray-600"
          aria-label="Notifications"
        >
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
        </button>
      </div>
      <div class="flex inline-flex mt-1 ml-2 sm:ml-6">
        <h3 class="mr-2 text-sm font-medium text-gray-400">Projects</h3>
      </div>
    </div>

    <div class="flex py-2 pr-5 m-2 text-center text-gray-700 border-b-2 border-transparent sm:border-b-0 sm:border-l-4">
      <div class="flex inline-flex sm:ml-6">
        <button
          class="text-gray-400 border-transparent rounded-full hover:text-blue-600 focus:outline-none focus:text-gray-600"
          aria-label="Notifications"
        >
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
        </button>
      </div>
      <div class="flex inline-flex mt-1 ml-2 sm:ml-6">
        <h3 class="mr-2 text-sm font-medium text-gray-400">Contact</h3>
      </div>
    </div>
  </div>
</div>
