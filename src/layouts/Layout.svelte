<script>
  export let templateHtml, request, settings, data;
  import SideBar from '../components/SideBar.svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
</script>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    body {
      @apply w-full;
    }
  }

  @media (min-width: 640px) {
    .w-fixed {
      flex: 0 1 260px;
      min-width: 260px;
    }
  }
</style>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="robots" content="index, follow" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="language" content="English" />
  <meta name="author" content="chris@phan.cx" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Inter:400|Noto+Sans:400|Roboto+Mono:400&subset=latin"
  />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.ico" />
  <base href={settings.origin} />
  <title>{settings.sitename} - Consulting | Competitive Intelligence | Quality Solutions</title>
</svelte:head>

<main class="flex flex-col w-full sm:h-screen z-1">
  <div class="h-full overflow-hidden sm:flex grow z-1">
    <SideBar {request} {settings} {data} />
    <!-- <Spotify /> -->
    <div class="flex flex-col sm:max-w-[calc(100%-16.25rem)] grow z-1">
      <Header {data} />
      <div class="h-full px-2 py-4 overflow-y-auto bg-white grow print:-m-10">
        <div class="container z-0 print:block">
          {@html templateHtml}
        </div>
      </div>
    </div>
  </div>
  <Footer />
</main>
