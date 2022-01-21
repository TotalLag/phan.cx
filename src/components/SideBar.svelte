<script>
  export let request, settings, data;
  import Profile from '../components/Profile.svelte';
  import Notifications from '../components/Notifications.svelte';
  import Stats from '../components/Stats.svelte';
  import Navigation from './Navigation.svelte';
  import SocialMedia from './SocialMedia.svelte';
</script>

<aside class="flex flex-col p-4 bg-white border border-b-0 border-gray-200 w-fixed print:hidden">
  <div class="flex hidden font-light min-h-[3.5rem] sm:inline animate-pulse">
    <span class="font-extrabold underline">></span> ⱧɆⱠⱠØ ₩ØⱤⱠĐ!
  </div>

  <div class="flex items-center justify-between px-4 py-3 sm:text-center sm:flex-col">
    <Profile name="Chris Phan" location="Texas, USA">
      <img class="object-cover w-full h-full" src="{settings.origin}/me.jpg" alt="Me" />
    </Profile>

    <Notifications hydrate-client={{ class: 'relative inline-block sm:hidden', data: data.GHData }} />
  </div>

  <div class="hidden sm:inline">
    <hr class="mt-6 mb-6 border-gray-300" />

    <Stats code={settings.lineCount} cat="1" />

    <hr class="mt-6 mb-6 border-gray-300" />
  </div>

  <Navigation {request} />

  <SocialMedia />
</aside>
