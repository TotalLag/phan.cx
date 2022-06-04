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
    const description = `${settings.sitename} made all the mistakes that you're about to make - so, you don't have to! Now, he helps people to adopt and use technology services so they can get back to doing what they love.`;
    const keywords = 'consulting, web development, professional services, solutions engineer, market intelligence, human design';

    return { ...data, title, description, keywords };
  },
};