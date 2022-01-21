<script>
  let isSubmitting = false;
  let doneSubmit = false;

  const handleSubmit = (e) => {
    let myForm = document.getElementById('contact');
    let formData = new FormData(myForm);
    isSubmitting = true;
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        console.log('Form successfully submitted');
        isSubmitting = false;
        doneSubmit = true;
        myForm.reset();
      })
      .catch((error) => {
        alert(error);
        isSubmitting = false;
      });
  };
</script>

<form form id="contact" name="contact" on:submit|preventDefault={handleSubmit} netlify netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <input type="text" name="bot-field" style="opacity: 0" />
  <input type="checkbox" name="botcheck" id="" style="display: none;" />

  <div class="flex flex-col justify-between sm:flex-row sm:gap-10">
    <div class="w-full mb-6">
      <label for="name" class="block mb-2 text-sm text-gray-700">Full Name</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="John Doe"
        required
        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:text-gray-700"
      />
    </div>
    <div class="w-full mb-6">
      <label for="company" class="block mb-2 text-sm text-gray-700">Company</label>
      <input
        type="company"
        name="company"
        id="company"
        placeholder="ACME, Inc."
        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:text-gray-700"
      />
    </div>
  </div>

  <div class="flex flex-col justify-between sm:flex-row sm:gap-10">
    <div class="w-full mb-6">
      <label for="email" class="block mb-2 text-sm text-gray-700">Email Address</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="you@company.com"
        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:text-gray-700"
      />
    </div>
    <div class="w-full mb-6">
      <label for="phone" class="block mb-2 text-sm text-gray-700">Phone Number</label>
      <input
        type="text"
        name="phone"
        id="phone"
        placeholder="(xxx) xxx-xxxx"
        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:text-gray-700"
      />
    </div>
  </div>

  <div class="mb-6">
    <label for="message" class="block mb-2 text-sm text-gray-700 dark:text-gray-400">Your Message</label>

    <textarea
      rows="5"
      name="message"
      id="message"
      placeholder="Your Message"
      class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100 focus:text-gray-700"
      required
    />
  </div>
  <div class="mb-6">
    <button
      disabled={isSubmitting}
      type="submit"
      class="w-full px-3 py-4 text-white bg-blue-600 rounded-md focus:bg-blue-700 focus:outline-none"
    >
      {#if !isSubmitting}
        <div class="flex items-center justify-center space-x-1 text-sm">
          <svg fill="none" class="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
          <div>Submitting...</div>
        </div>
      {:else}
        Send Message
      {/if}
    </button>
  </div>
  {#if doneSubmit}
    <p class="text-base text-center text-gray-400" id="result">
      Thank you for reaching out. I'll get back to you as soon possible!
    </p>
  {/if}
</form>
