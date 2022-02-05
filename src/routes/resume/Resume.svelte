<script>
  export let request, data;
  const { resume } = data;
  const { name, address, phone, email } = resume.info;
  const { summary, qualifications, experience, education } = resume;
</script>

<style>
  article {
    @apply leading-relaxed text-sm print:leading-snug print:text-xs tracking-wide;
  }

  h1 {
    @apply text-4xl tracking-wider uppercase;
  }
  h2 {
    @apply font-bold tracking-widest uppercase print:font-semibold;
  }

  .summary {
    @apply print:tracking-wide;
  }

  h3 {
    @apply font-semibold tracking-wide;
  }

  ul {
    @apply list-disc pl-4;
  }

  .selected {
    @apply text-gray-800 border-gray-700 font-bold;
  }
</style>

<svelte:head>
  <meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

<div class="grid items-center grid-cols-3 justify-self-stretch print:hidden">
  <div class="p-4 justify-self-start whitespace-nowrap">🖨️-friendly 😉</div>
  <ul class="flex my-4 text-sm font-medium flex-nowrap sm:justify-self-center justify-self-between">
    <a href={request.slug}
      ><li
        class="px-4 py-2 text-gray-400 list-none border-b-8 cursor-pointer"
        class:selected={resume.type !== 'technical'}
      >
        Strategic
      </li></a
    >
    <a href="{request.slug}/technical"
      ><li
        class="px-4 py-2 text-gray-400 list-none border-b-8 cursor-pointer"
        class:selected={resume.type === 'technical'}
      >
        technical
      </li></a
    >
  </ul>
</div>

<div class="flex flex-col p-6 mx-auto align-middle border-8 print:-mt-2 print:border-0 print:max-w-[49rem] md:w-4/5">
  <article class="border-0 border-b border-black">
    <div class="flex flex-col pb-2 border-0 border-b-2 border-black">
      <div class="flex mx-auto">
        <h1>{name}</h1>
      </div>
    </div>

    <div class="flex p-1 border-0 border-b-2 border-black">
      <div class="flex mx-auto">
        <span> {address} | {phone} | {@html email} </span>
      </div>
    </div>

    <div class="flex p-4">
      <div class="mx-auto">
        <h2 class="summary">{summary.map((i) => i.item).join(' ◆ ')}</h2>
      </div>
    </div>
  </article>

  <article>
    <div class="flex pb-1 mb-3 border-0 border-b border-gray-200">
      <div class="flex flex-col">
        <h2>Summary of Qualifications</h2>
      </div>
    </div>

    <div class="flex pb-2 border-0 border-b border-black">
      <ul>
        {#each qualifications as line}
          <li>{line.item}</li>
        {/each}
      </ul>
    </div>
  </article>

  <article class="mb-1 border-0 border-b border-black">
    <div class="flex pb-1 mb-3 border-0 border-b border-gray-200">
      <div class="flex flex-col">
        <h2>Work Experience</h2>
      </div>
    </div>

    {#each experience as job}
      <div class="flex justify-between">
        <h3>{job.title} | {job.company} <span class="font-light">| {job.location}</span></h3>
        <span> {job.dateFrom} &mdash; {job.dateTo} </span>
      </div>
      <div class="flex mb-3">
        <ul>
          {#each job.work as line}
            <li>{line.item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </article>

  <article>
    <div class="flex pb-1 mb-3 border-0 border-b border-gray-200">
      <div class="flex flex-col">
        <h2>Education</h2>
      </div>
    </div>

    {#each education as school}
      <div class="flex justify-between mb-4">
        <h3>{school.degree} | {school.name} <span class="font-light">| {school.location}</span></h3>
        <span> {school.dateFrom} &mdash; {school.dateTo} </span>
      </div>
    {/each}
  </article>
</div>
