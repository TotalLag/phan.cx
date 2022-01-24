require('dotenv').config();
module.exports = {
  origin: process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:3000', // TODO: update this. The URL of your site's root, without a trailing slash
  sitename: 'Chris Phan',
  TRACKING_ID: process.env.TRACKING_ID,
  lang: 'en',
  srcDir: 'src',
  distDir: 'public',
  rootDir: process.cwd(),
  build: {},
  prefix: '', // If you want your site to be built within a sub folder within your `distDir` you can use this.
  server: {},
  props: {
    hydration: 'hybrid',
    compress: false,
  },
  debug: {
    stacks: false, // output details of the stack consolidation process.
    hooks: false, // outputs the details of each hook as they are run.
    performance: false, // outputs a full performance report of how long it took to run each page.
    build: false, // gives additional details about the build process.
    automagic: false,
  },
  hooks: {
    // disable: ['elderWriteHtmlFileToPublic'], // this is used to disable internal hooks. Uncomment this hook to disabled writing your files during build.
  },
  plugins: {
    '@elderjs/plugin-sitemap': {
      origin: process.env.URL, // the https://yourdomain.com
      exclude: ['404/'], // an array of permalinks or permalink prefixes. So you can do ['500'] and it will match /500**
      routeDetails: {
        blog: {
          priority: 0.8,
          changfreq: 'daily',
        }
      }, // set custom priority and change freq if not it falls back to default
      lastUpdate: {
        blog: async () => {
          return new Date(Date.now());
        }
      }, // configurable last update for each route type.
    },
    '@elderjs/plugin-markdown': {
      routes: ['blog', 'project'],
    },
    '@elderjs/plugin-browser-reload': {
      // this reloads your browser when nodemon restarts your server.
      port: 8080,
      reload: true, // if you are having issues with reloading not working, change to true.
    },
    '@elderjs/plugin-seo-check': {
      display: ['errors', 'warnings'], // If the errors are too verbose remove 'warnings'
      //writeLocation: './report.json', // if you want to write a report of errors
    },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
