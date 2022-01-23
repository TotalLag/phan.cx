<script>
  export let data;
</script>

Hello Project

{#each data.markdown.project as project}
  {JSON.stringify(project)}
{/each}