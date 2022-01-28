<script>
  export let data, helpers, request, settings;
  import BlogTeaser from '../../components/BlogTeaser.svelte';
  import PhotoGram from '../../components/PhotoGram.svelte';

  const sorted_blog = data.markdown.blog.sort((a, b) => {
    const aa = a.frontmatter.hasOwnProperty('featured') ? 1 : -1;
    const bb = b.frontmatter.hasOwnProperty('featured') ? 1 : -1;
    return bb - aa;
  });
</script>

<style>
  h1,
  h2 {
    @apply text-2xl font-bold;
  }
  p {
    @apply mb-6;
  }
</style>

<div class="mx-auto mt-6 md:w-4/5 print:p-10">
  <h1 class="uppercase">
    A beautiful, responsive, statically-generated, Svelte application written with modern JavaScript.
  </h1>

  <span class="block pt-6">
    <p>
      Welcome to my website! Please feel free to read my musings, or you can check out my resume, projects, random
      stats, or contact me.
    </p>
    <p>
      This site serves as my portfolio and there will be many aspects that will be ongoing development. As the pieces
      come together, you can expect to see more of what makes up all parts for this website; but until then enjoy seeing
      how things are put together on GitHub!
    </p>
    <p>
      Source available <a href="https://github.com/TotalLag/phan.cx" class="underline">here</a>.
    </p>
  </span>

  <hr class="mt-6 mb-6 border-gray-300" />

  <div class="flex flex-col mb-10">
    <div class="flex justify-between">
      <h2>Featured Posts</h2>
      <div class="relative inline-flex">
        <svg
          class="absolute -top-0.5 right-0 w-2 h-2 m-4 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 412 232"
          ><path
            d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
            fill-rule="nonzero"
          /></svg
        >
        <select
          class="h-8 pl-5 pr-8 text-sm font-bold text-gray-600 border border-gray-300 rounded-full appearance-none bg-gray-50 hover:border-gray-400 focus:outline-none"
        >
          <option>All Time</option>
          <option>This Month</option>
          <option>Current Year</option>
          <option>Last Year</option>
        </select>
      </div>
    </div>

    <div class="flex gap-6 pt-5 pb-5 overflow-x-auto flex-nowrap">
      {#each sorted_blog as blog}
        <BlogTeaser {blog} {helpers} />
      {/each}
    </div>
  </div>

  <div class="flex flex-col mb-10">
    <div class="flex justify-between">
      <h2>Instagram Photo Feed</h2>
      <div class="relative inline-flex">
        <svg
          class="absolute -top-0.5 right-0 w-2 h-2 m-4 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 412 232"
          ><path
            d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
            fill-rule="nonzero"
          /></svg
        >
        <select
          class="h-8 pl-5 pr-8 text-sm font-bold text-gray-600 border border-gray-300 rounded-full appearance-none bg-gray-50 hover:border-gray-400 focus:outline-none"
        >
          <option>All Time</option>
          <option>For {new Date().getFullYear()}</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col gap-10 pt-5 pb-5 mx-auto sm:grid sm:grid-cols-2 md:grid-cols-3">
      {#each data.newFile as photos}
        <PhotoGram {photos} {helpers} />
      {/each}
    </div>
  </div>
</div>
