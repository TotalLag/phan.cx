module.exports = {
  // WARNING: Here be dragons and magic of all sorts.

  // 'data' and 'all' for this route are populated by /plugins/elder-plugin/markdown/index.js
  // This example is designed to show you the power of plugins.

  // If you look in your `elder.config.js` you will see that the plugin is configured as so:
  // 'elderjs-plugin-markdown': {
  //   routes: ['blog'],
  // },

  // This is telling the simple markdown plugin, which route to control.
  all: () => [],
  permalink: '/blog/:slug/',
  data: ({ settings, request, data }) => {
    const { frontmatter } = data.markdown.blog.find((e) => e.slug == request.slug);

    const title = `${settings.sitename} - ${frontmatter.title}`;
    const description = frontmatter.excerpt;
    const keywords = frontmatter.keywords;

    return { ...data, title, description, keywords };
  },
};
