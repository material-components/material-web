# 11ty and Lit

This repo is an example of using 11ty and Lit together.

## Technologies

- [Lit](https://lit.dev)
- [11ty](https://www.11ty.dev/)
- [11ty-islands](https://github.com/11ty/is-land)
- [@lit-labs/ssr](https://github.com/lit/lit/tree/main/packages/labs/ssr)
- [@lit-labs/eleventy-plugin-lit](https://github.com/lit/lit/tree/main/packages/labs/eleventy-plugin-lit)
- [Wireit](https://github.com/google/wireit)

## Quickstart

Dev mode:

```bash
npm i && npm run dev
```

Prod mode:

```bash
npm i && npm start
```

## Explanation

11ty is a static site builder. Lit is a library that makes it easy to build Web Components. In this example, we combine the two so that you can sprinkle interactivity in a static site with Lit. We also use 11ty islands to make it easy to SSR your components and control how they are hydrated to provide an "island of interactivity".

### Directory Structure

#### `site` directory

This directory holds your 11ty templates. See the 11ty docs for more info.

#### `site/_includes` directory

This is for templates global to the 11ty templating system. Here we have a `default.html` layout and a `layouts` directory for layouts that are specific to a page or set of pages.

Make sure to include `default.html` in your layouts and in your 11ty `json` config files or simply extend them in nunjucks.

#### `site/css` directory

This holds your css files. Later, you may want to minify these.

#### `site/fonts` and `site/images` directories

These hold your fonts and images. They are empty right now, but they will be copied over to the `dist` directory.

#### `site/*` (everything else)

Most of these are for templating in 11ty. See the 11ty docs for more info. If you'd like to hook into the 11ty data system you may want to add a `_data` directory and consult the 11ty docs.

#### `src/components` directory

This directory holds your Lit components. If you add a component here, to hook it up to SSR, add it to the `src/ssr.ts` file and make sure to add it to `tsEntrypoints` in `esbuild.config.mjs` to make sure it's included in the bundler. If you don't want to SSR a component, you can add it to the appropriate file in `src/pages/<your page name>.ts`;

#### `src/pages` directory

This is a place to put logic for individual pages. If you want to add a component to a page, you can import it here and just use it in your templates. These files are automatically added to the build.

#### `src/ssr.ts` file

This loads the files onto the server for Server-side rendering. 11ty will then server-side render any components on the page.

#### `esbuild.config.mjs` file

This creates your bundles. It uses esbuild to bundle your components and your pages. You can add more entrypoints here if you want to add more entrypoints for hydration. The output of this will then be copied over to 11ty's appropriate output directory into the `/js` directory. e.g. dev mode will output `_dev/js/` and prod mode will output `_prod/js/`.

#### `eleventy.cjs` file

This is the configuration file for 11ty. Please consult the docs.

#### `eleventy-helpers` directory

This directory includes some files that modularize and organize the 11ty config file so that it does not become a giant mess of a file.
