<script>
  export let blog;
  export let helpers;
</script>

<article
  class="relative w-40 h-64 overflow-hidden transition duration-300 ease-in-out bg-center bg-cover rounded-lg shadow-lg shrink-0 group hover:shadow-2xl"
  style="background-image: url('{blog.frontmatter.cover}');"
>
  <div class="absolute inset-0 transition duration-300 ease-in-out bg-black bg-opacity-50 group-hover:opacity-75" />
  <div class="relative flex items-end justify-center w-full h-full px-4 py-3">
    <h3 class="text-center">
      <a class="text-sm font-bold text-center text-white" href={helpers.permalinks.blog({ slug: blog.slug })}>
        <span class="absolute inset-0 px-4 py-3">{blog.frontmatter.topic ?? ''}</span>
        {blog.frontmatter.title}
      </a>
    </h3>
  </div>
</article>
