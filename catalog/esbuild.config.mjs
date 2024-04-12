/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import gzipPlugin from '@luncheon/esbuild-plugin-gzip';
import esbuild from 'esbuild';
import {copyFileSync} from 'fs';
import {createRequire} from 'node:module';
import {join} from 'path';
import tinyGlob from 'tiny-glob';

// dev mode build
const DEV = process.env.NODE_ENV === 'DEV';
// Output folder for TS files
const jsFolder = DEV ? 'lib' : 'build';

// can use glob syntax. this will create a bundle for those specific files.
// you want to add SSR'd files here so that you can hydrate them later with
// <lit-island import="js/components/element-definition.js"></lit-island>
const tsEntrypoints = [
  // entrypoints for hydrating lit-islands
  './src/hydration-entrypoints/**/*.ts',
  // also include a bundle for each individual page
  './src/pages/*.ts',
  // SSR stuff
  './src/ssr-utils/lit-hydrate-support.ts',
  './src/ssr-utils/lit-island.ts',
];
const filesPromises = tsEntrypoints.map(async (entry) => tinyGlob(entry));
const entryPoints = (await Promise.all(filesPromises)).flat();

// Shared esbuild config values
let config = {
  bundle: true,
  outdir: jsFolder,
  minify: false,
  format: 'esm',
  treeShaking: true,
  write: true,
  sourcemap: true,
  splitting: true,
};

let componentsBuild = Promise.resolve();

// development build
if (DEV) {
  componentsBuild = esbuild
                        .build({
                          ...config,
                          entryPoints,
                        })
                        .catch(() => process.exit(1));

  // production build
} else {
  // config must be same for SSR and client builds to prevent hydration template
  // mismatches because we minify the templates in prod
  config = {
    bundle: true,
    outdir: jsFolder,
    minify: true,
    format: 'esm',
    treeShaking: true,
    legalComments: 'external',
    plugins: [
      // This plugin currently breaks certain css props for SVGs
      // (circularprogress) minifyHTMLLiteralsPlugin({
      //   shouldMinify: (template) => {
      //     const tag = template.tag && template.tag.toLowerCase();
      //     return (
      //       !!tag &&
      //       (tag.includes('html') || tag.includes('svg')) &&
      //       // tag name interpolations break
      //       tag !== 'statichtml'
      //     );
      //   },
      // }),
      gzipPlugin({
        gzip: true,
      }),
    ],
    // Needs to be off per the gzipPlugin docs
    write: false,
    splitting: true,
  };

  componentsBuild = esbuild
                        .build({
                          ...config,
                          entryPoints,
                        })
                        .catch(() => process.exit(1));
}

// seperate build so that the SSR bundle doesn't affect bundling for the
// frontend
const ssrBuild = esbuild
                     .build({
                       ...config,
                       format: 'iife',
                       splitting: false,
                       conditions: ['node'],
                       entryPoints: ['src/ssr.ts'],
                     })
                     .catch(() => process.exit(1));

// Glob of files that will be inlined on the page in <script> tags
const tsInlineEntrypoints = [
  './src/ssr-utils/dsd-polyfill.ts',
  // Anything in this directory will be inlined
  './src/inline/*.ts',
];
const inlineFilesPromises =
    tsInlineEntrypoints.map(async (entry) => tinyGlob(entry));
const inlineEntryPoints = (await Promise.all(inlineFilesPromises)).flat();

// this code is inlined into the HTML because it is performance-sensitive
const inlineBuild = esbuild
                        .build({
                          ...config,
                          format: 'iife',
                          splitting: false,
                          entryPoints: inlineEntryPoints,
                        })
                        .catch(() => process.exit(1));

await Promise.all([componentsBuild, ssrBuild, inlineBuild]);

// Copy the playground-elements worker to the build folder
const require = createRequire(import.meta.url);
copyFileSync(
    require.resolve('playground-elements/playground-typescript-worker.js'),
    join(jsFolder, 'hydration-entrypoints/playground-typescript-worker.js'));

process.exit(0);
