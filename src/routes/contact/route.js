module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [{ slug: 'contact' }],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => request.slug,
  data: ({ settings, data }) => {
    const description = `Connect with ${settings.sitename}. Let's chat!`;
    const keywords = 'reach out, ping, message, connect with';

    return { ...data, description, keywords };
  },
};
