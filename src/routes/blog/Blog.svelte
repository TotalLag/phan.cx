<script>
  export let data, request, settings; // data is mainly being populated from the @elderjs/plugin-markdown
  const { html, frontmatter } = data;
</script>

<style global lang="postcss">
  /* purgecss start ignore */
  /* Markdown Styles */
  /* Global */
  .markdown {
    @apply leading-relaxed text-sm;
  }

  @screen sm {
    .markdown {
      @apply text-base;
    }
  }

  @screen lg {
    .markdown {
      @apply text-lg;
    }
  }

  /* Headers */
  .markdown h1,
  .markdown h2 {
    @apply text-xl my-6 font-semibold;
  }
  .markdown h3,
  .markdown h4,
  .markdown h5,
  .markdown h6 {
    @apply text-lg my-3 font-semibold;
  }

  @screen sm {
    .markdown h1,
    .markdown h2 {
      @apply text-2xl;
    }
    .markdown h3,
    .markdown h4,
    .markdown h5,
    .markdown h6 {
      @apply text-xl;
    }
  }

  /* Links */
  .markdown a {
    @apply text-blue-600;
  }
  .markdown a:hover {
    @apply underline;
  }
  /* Paragraph */
  .markdown p {
    @apply mb-4;
  }
  /* Lists */
  .markdown ul,
  .markdown ol {
    @apply mb-4 ml-8;
  }
  .markdown li > p,
  .markdown li > ul,
  .markdown li > ol {
    @apply mb-0;
  }
  .markdown ol {
    @apply list-decimal;
  }
  .markdown ul {
    @apply list-disc;
  }
  /* Blockquotes */
  .markdown blockquote {
    @apply p-2 mx-6 bg-gray-100 mb-4 border-l-4 border-gray-400 italic;
  }
  .markdown blockquote > p {
    @apply mb-0;
  }
  /* Tables */
  .markdown td,
  .markdown th {
    @apply px-2 py-1 border border-gray-400;
  }
  .markdown tr:nth-child(odd) {
    @apply bg-gray-100;
  }
  .markdown table {
    @apply mb-6;
  }

  /* Wrap any inline highlights `that are really long`, but don't modify
   the setting for codeblocks (inside ```), which are rendered in as:
   <pre><code>...
*/
  .markdown :not(pre) > code.language-javascript {
    @apply block whitespace-pre-line;
  }

  .markdown pre {
    @apply block whitespace-pre overflow-x-auto p-4 font-medium text-gray-600 bg-gray-100;
  }

  .markdown pre code::before {
    @apply pl-0;
  }
  .markdown pre code::after {
    @apply pr-0;
  }

  .markdown code::before {
    @apply pl-1;
  }
  .markdown code::after {
    @apply pr-1;
  }
  /* purgecss end ignore */
</style>

<svelte:head>
  <title>{settings.sitename} - {frontmatter.title}</title>
  <meta name="description" content={frontmatter.excerpt} />
  <link href="{settings.origin}{request.permalink}" rel="canonical" />
</svelte:head>

<a href="/" class="print:hidden">&LeftArrow; Home</a>

{#if html}
  <article class="flex flex-col w-full mx-auto mt-6 md:w-4/5 markdown print:p-10">
    <div class="mx-5 my-3 text-sm">
      <a href="" class="font-bold tracking-widest text-red-600 ">{frontmatter.topic ?? ''}</a>
    </div>
    <div class="px-5 text-4xl font-bold leading-none text-gray-800">
      {frontmatter.title}
    </div>

    <div class="px-5 pt-2 pb-5 text-gray-500">
      {frontmatter.excerpt}
    </div>

    {#if frontmatter.cover}
      <div class="mx-5">
        <img class="object-cover {frontmatter.top?'object-top':''} {frontmatter.bottom?'object-bottom':''} w-screen max-h-96" src={frontmatter.cover} alt={frontmatter.caption} />
      </div>
    {/if}

    <div class="mx-5 text-gray-600 text-normal">
      <p class="py-3 text-xs italic text-gray-400 border-b">{frontmatter.caption ?? ''}</p>
    </div>

    <div class="px-5 pt-3 italic font-thin text-gray-600">
      <span class="flex flex-col text-xs">
        Posted on {new Date(frontmatter.date).toLocaleString('default', { dateStyle: 'long' })}<br />
        {#if frontmatter.updated}
          Updated: {new Date(frontmatter.updated).toLocaleString('default', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}
        {/if}
      </span>
    </div>

    <div class="p-5 mx-auto mt-5">
      {@html html}
    </div>
  </article>
{:else}
  <h1>Oops!! Markdown not found!</h1>
{/if}
