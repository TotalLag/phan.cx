module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [{ slug: 'projects' }],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => request.slug,
  data: ({ settings, data }) => {
    const { projects } = require('./projects.json');
    const description = `${settings.sitename} is the best candidate for your project with his diverse range of experience.`;
    const keywords = 'python, front-end, professional services, automation, ci, devops';

    return { data, projects, description, keywords };
  },
};
