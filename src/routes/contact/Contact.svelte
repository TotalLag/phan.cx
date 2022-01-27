<script>
  import ContactForm from '../../components/ContactForm.svelte';
</script>

<div class="flex flex-col">
  <div class="container mx-auto">
    <div class="max-w-2xl mx-auto rounded-md shadow-sm">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-semibold text-gray-700">Say Hello</h1>
        <p class="text-gray-400">What's up? I'm waiting for your message below.</p>
      </div>
      <div class="m-7">
        <ContactForm hydrate-client={{}} />
      </div>
    </div>
  </div>
</div>
