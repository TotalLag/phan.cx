module.exports = {
  // the all function returns an array of all of the 'request' objects of a route. Since this is the homepage, there is only one.
  all: () => [
    { slug: 'resume', resume: { type: '' } },
    { slug: 'resume', resume: { type: 'technical' } },
  ],
  // the permalink function takes a 'request' object and returns a relative permalink. In this case "/"
  permalink: ({ request }) => `${request.slug}/${request.resume.type}`,
  data: ({ request, data }) => {
    let { resume } = require('./resume.json');

    if (request.resume.type === 'technical') {
      resume = require('./resume-tech.json').resume;
    }

    return { ...data, resume: { type: request.resume.type, ...resume } };
  },
};
