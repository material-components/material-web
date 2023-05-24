/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {cp, readFile, writeFile} from 'fs/promises';
import {join, relative} from 'path';
import tinyGlob from 'tiny-glob';

/**
 * Recursively copies the images from
 *
 * /docs/components/images
 * to
 * /catalog/site/components/images
 */
async function copyImages() {
  await cp(
      join('..', 'docs', 'components', 'images'),
      join('site', 'components', 'images'), {recursive: true}, (err) => {
        if (err) throw err;
      });
}

/**
 * Finds and returns all the filepaths of markdown files in
 * /docs/components/
 *
 * @return A promise of all the markdwon filepaths in /docs/components/
 */
async function getReadmeFiles() {
  const readmeFilesGlob = ['../docs/components/**/*.md'];
  const readmeFiles = readmeFilesGlob.map(async (entry) => tinyGlob(entry));
  return (await Promise.all(readmeFiles)).flat();
}

/**
 * Transforms to apply to the markdown files
 */
const transforms = [
  // catalog-only code comments are removed
  {
    before: /<!-- catalog-only-start -->(\n)*?<!--\s*/gm,
    after: '',
  },
  {
    before: /\s*-->(\n)*?<!-- catalog-only-end -->/gm,
    after: '',
  },
  // removes everything in between github-only-start and github-only-end
  // comments
  {
    before:
        /\s*<!-- github-only-start -->(.|\n)*?<!-- github-only-end -->\s*/gm,
    after: '\n\n',
  },
  // eleventy pages end with `/` so `components/checkbox.md` will turn into the
  // url `/components/checkbox`. Thus we need to transform the relative
  // `./images` links to `../images`.
  {
    before: /images\//gm,
    after: '../images/',
  },
];

/**
 * Applies the transforms to readme files at the given filepaths and outputs the
 * result to /catalog/site/components/<component-name>.md
 *
 * @param {Array<string>} filepaths The readme file paths to transform.
 */
async function transformReadmes(filepaths) {
  const readmePromises = filepaths.map(async (entry) => {
    let readme = await readFile(entry, 'utf8');
    console.log(`Transforming ${entry}`);

    transforms.forEach((transform) => {
      readme = readme.replaceAll(transform.before, transform.after);
    });

    // The `components/<component-name>.md` path.
    const localPath = relative(join('..', 'docs'), entry);
    // The output path at
    // /catalog/site/components/<?local path>/<component name>.md
    const outputPath = join('site', localPath);
    console.log(`Writing trasnformed file to: ${outputPath}`);
    return writeFile(outputPath, readme);
  });

  await Promise.all(readmePromises);
}

const readmeFiles = await getReadmeFiles();

console.log('Copying images...');
await copyImages();
console.log('Images copied!');
console.log('Transforming readmes...');
await transformReadmes(readmeFiles);
console.log('Transformations complete!');
