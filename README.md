# Personal Website

See: [phan.cx](https://phan.cx).

My personal website. An MIT licensed, simple, easily modifiable, statically-exportable Svelte, Jamstack application that deploys automatically for using Netlify. Built using modern javascript, based on Elder.js with TailwindCSS, TestCafe, Github Actions, and many other useful technologies.

## Get started

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
git clone https://github.com/TotalLag/phan.cx.git your-app
cd your-app
```

### Install the dependencies:

```bash
npm install # or just yarn
```

### Start Project:

```bash
npm start # or npm run dev
```

Navigate to [localhost:3000](http://localhost:3000). You should see your app running.

This spawns a development server, so simply edit a file in `src`, save it, and reload the page to see your changes.

You can also see a live demo of this template: [https://elderjs.pages.dev/](https://elderjs.pages.dev/)

#### What to Expect

- A dev server is watching your files for changes. It will restart when it needs to.
- Rollup is watching your files for changes. It will restart when it needs to.
- If your `elder.config.js` has `@elderjs/plugin-browser-reload': {}` in it's plugins, your browser will automatically restart after the server restarts.

**esbuild**

If you are looking for a faster development experience run `npm run esbuild` this is experimental but will be improving rapidly.

### To Build HTML for Production:

```bash
npm run build
```

Let the build finish. It will put all of your statically generated files in `./public`.

If you wish to preview you can use:

```bash
npx sirv-cli public
```

### To Run in SSR Mode for Production:

```bash
npm run serve
```
