const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs-extra');
const os = require('os');
const fetch = require('node-fetch');

require('dotenv').config();
const Instagram = require('instagram-web-api');
const { username, password } = process.env;

const client = new Instagram({ username, password });

const getPhotos = async () => {
  const photos = await client.getPhotosByUsername({ username: 'the_daily_spaz' });

  return photos.user.edge_owner_to_timeline_media.edges.map((res) => {
    const image = res.node.display_url;

    return image;
  });
};

const downloadFile = async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  console.log(`Downloading to '${path}'`);
  return path;
};

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Hooks! 
 * 
 * Lifecycle hooks are the backbone of how you can have complete control over the output of your site.
 * Hooks are enforced via the hookInterface 'contract' defined here: 
        https://github.com/Elderjs/elderjs/blob/master/src/hookInterface/hookInterface.ts
 *
 * If you read the hookInterface spec closely you'll see that each defined hook gets specific 'props' along with which of those props is 'mutable'.
 * 
 * If you're a fan of 'pure' functions in JS, mutating props will probably set off alarm bells in your head. Fear not, instead of burying 
 * what is mutating things deep in your application, you'll know it is probably in this file.
 *
 * Also, to help keep mutation predictable each 'hook' limits which 'props' can be manipulated and where. 
 * 
 */

const hooks = [
  {
    hook: 'bootstrap',
    name: 'addInstagramData',
    description: 'Adds Instagram external data to the data object available in all hooks and routes.',
    run: async ({ data }) => {
      const filepath = path.join(__dirname, '..', 'assets/instagram/');
      try {
        fs.mkdirSync(filepath, { recursive: true });
      } catch {
        pass;
      }
      const filecount = fs.readdirSync(filepath)?.length;
      const pass = await exists(filepath + '0.jpg');
      let newFile = [];

      if (!pass) {
        console.log('Logging in');
        await client.login();

        console.log('Getting photos');
        const IGPhotos = await getPhotos();

        console.log('Iterating...');
        IGPhotos.map((photo, i) => {
          downloadFile(photo, path.join(filepath, `${i}.jpg`));
          newFile.push(`instagram/${i}.jpg`);
        });
        console.log('Done!');
      } else {
        console.log('Files exists. Not downloading.');
        for (let i = 0; i < filecount; i++) {
          newFile.push(`instagram/${i}.jpg`);
        }
      }

      return {
        data: {
          ...data,
          newFile,
        },
      };
    },
  },
  {
    hook: 'bootstrap',
    name: 'runLineCount',
    description:
      'Estimate the count amount of javascript lines for this project. (Ok ok, it includes Style/HTML in Svelte files)',
    run: ({ settings }) => {
      const buffer = execSync('npm run count:lines').toString().split('\n');
      const lineCount = buffer[buffer.length - 2];
      return {
        settings: {
          ...settings,
          lineCount,
        },
      };
    },
  },
  {
    hook: 'bootstrap',
    name: 'addGitHubData',
    description: 'Adds GitHub releases data to the data object available in all hooks and routes.',
    run: async ({ settings, data }) => {
      const externalData = await fetch('https://api.github.com/repos/TotalLag/phan.cx/releases').then((res) =>
        res.json(),
      );
      const GHData = externalData.map((res) => {
        const id = res.id;
        const name = res.name;
        const date = res.published_at;
        const tag = res.tag_name;
        const body = res.body;

        return {
          id,
          name,
          date,
          tag,
          body,
        };
      });

      return {
        data: {
          ...data,
          GHData, // this data is now available in the `all` and `data` functions of your `/routes/routeName/route.js`.
        },
      };
    },
  },
  // {
  //   hook: 'html',
  //   name: 'compressHtml',
  //   description: "Uses regex to compress html. This is a big no-no, but let's give it a whirl.",
  //   priority: 1, // last please :D
  //   run: async ({ htmlString }) => {
  //     // this function takes the 'htmlString' prop, compresses it with Regex, then returns it.
  //     return {
  //       htmlString: htmlString
  //         .replace(/[ \t]/gi, ' ')
  //         .replace(/[ \n]/gi, ' ')
  //         .replace(/[ ]{2,}/gi, ' ')
  //         .replace(/>\s+</gi, '><'),
  //     };
  //   },
  // },
  {
    hook: 'bootstrap',
    name: 'copyAssetsToPublic',
    description:
      'Copies ./assets/ to the "distDir" defined in the elder.config.js. This function helps support the live reload process.',
    run: ({ settings }) => {
      // note that this function doesn't manipulate any props or return anything.
      // It is just executed on the 'bootstrap' hook which runs once when Elder.js is starting.

      // copy assets folder to public destination
      glob.sync(path.resolve(settings.rootDir, './assets/**/*')).forEach((file) => {
        const parsed = path.parse(file);
        // Only write the file/folder structure if it has an extension
        if (parsed.ext && parsed.ext.length > 0) {
          const relativeToAssetsFolder = path.relative(path.join(settings.rootDir, './assets'), file);
          const outputPath = path.resolve(settings.distDir, relativeToAssetsFolder);
          fs.ensureDirSync(path.parse(outputPath).dir);
          fs.outputFileSync(outputPath, fs.readFileSync(file));
        }
      });
    },
  },

  // Below are some hooks to try and play with to get a better feel of what is possible.

  // {
  //   hook: 'data',
  //   name: 'addSomethingToData',
  //   description: 'Use this hook to add a key to the "data" object on the "home" route. ',
  //   priority: 50,
  //   run: async ({ request, data }) => {
  //     // when you uncomment this, check the homepage for a new box at the top.
  //     // IMPORTANT: If you want to add data to a specific route only, you should probably do it in your /route.js for that route.
  //     if (request.route === 'home') {
  //       return {
  //         data: {
  //           ...data,
  //           testingHooks: true,
  //         },
  //       };
  //     }
  //   },
  // },

  // {
  //   hook: 'bootstrap',
  //   name: 'populateDataForAllRequests',
  //   description:
  //     'The goal of this hook is to show you that you can get data from anywhere and add it to the data object.',
  //   priority: 50,
  //   run: async ({ data }) => {
  //     // when you uncomment this, check the homepage for a new box at the top.
  //     return {
  //       data: {
  //         ...data,
  //         testingHooks: true,
  //         // here we are using the 'os' node.js native, and passing in data on the number of CPUs
  //         cpus: os.cpus(),

  //         // NOTE: here we are polluting the global data object across all 'requests' because we are using the 'bootstrap' hook.
  //         // This is bad practice in this example because cpus is only used by Home.svelte, but it is illustrated to show how you could
  //         // add global data.

  //         // IMPORTANT: If you want to add data to a specific route only, you should probably do it in your /route.js for that route.
  //       },
  //     };
  //   },
  // },

  // If you'd like to see specific examples of how to do things that you think could help improve the template please create a GH issue.
];
module.exports = hooks;
