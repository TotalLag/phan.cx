<script>
  export let data;
</script>

<style>
  .node {
    @apply text-purple-600 bg-purple-200;
  }
  .python, .docker {
    @apply text-blue-600 bg-blue-200;
  }
  .react {
    @apply text-sky-600 bg-sky-200;
  }
  .svelte {
    @apply text-orange-600 bg-orange-200;
  }
</style>

<div class="mx-auto min-w-fit sm:w-5/6">
  <div class="my-6 bg-white rounded shadow-md min-w-fit">
    <table class="w-full table-auto">
      <thead class="border">
        <tr class="text-center uppercase bg-gray-100">
          <th class="px-2 py-3 sm:w-32">Project</th>
          <th class="px-2 py-3">What</th>
          <th class="px-2 py-3">Why</th>
          <th class="px-2 py-3 sm:w-60">Tech</th>
        </tr>
      </thead>
      <tbody class="text-sm font-light">
        {#each data.projects as project}
          <tr>
            <td class="px-2 py-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center">
                <a href={project.link}>
                  <span class="font-medium">{project.name}</span>
                </a>
              </div>
            </td>
            <td class="px-2 py-3 text-center">
              <div class="flex items-center justify-center">
                <span>{project.what}</span>
              </div>
            </td>
            <td class="px-2 py-3 text-center">
              <div class="flex items-center justify-center">
                <span>{project.why}</span>
              </div>
            </td>
            <td class="px-2 py-3 text-center">
              {#each project.tech as tech}
                <span
                  class="m-0.5 px-3 py-1 text-gray-600 bg-gray-200 text-xs rounded-full whitespace-nowrap inline-block {tech}"
                  >{tech}</span
                >
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
