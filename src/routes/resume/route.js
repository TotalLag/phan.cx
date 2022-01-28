module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [{ slug: 'resume' }],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => request.slug,
  data: ({ data }) => {
    const { resume } = require('./resume.json');

    return { ...data, resume };
  },
};
