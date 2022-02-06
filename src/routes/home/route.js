module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [{ slug: '/' }],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => request.slug,
  data: ({ settings, data }) => {
    // The data function populates what data should be in available in our Svelte template.
    // Since we will be listing out Elder.js's hooks, we make sure to populate that on the data object so it can be looped through
    // in our Svelte template.
    const title = `${settings.sitename} | Professional Mistake Maker`;
    const description = `${settings.sitename} is a professional mistake maker and problem solver. He helps you make better decisions by understanding your processes, letting go of perfectionism, and gathering information to weigh all the options.`;
    const keywords = 'consulting, programming, professional services, engineer, ci, solutions';

    return { ...data, title, description, keywords };
  },
};