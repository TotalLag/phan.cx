module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [{ slug: 'projects' }],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => request.slug,
  data: ({ settings, data }) => {
    const { projects } = require('./projects.json');
    const description = `I am a professional mistake maker. I make mistakes on purpose so that you don't have to. Learn more about my solutions for you and your business!`;
    const keywords = 'python, front-end, professional services, automation, ci, devops, solutions, marketing';

    return { data, projects, description, keywords };
  },
};
