/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {cp} from 'fs/promises';
import {join, parse} from 'path';
import tinyGlob from 'tiny-glob';

// Glob(s) from which to copy story files
const storyDirectories = ['../*/demo'];
const dirPromises = storyDirectories.map(async (entry) => tinyGlob(entry));
const directories = (await Promise.all(dirPromises)).flat();

const parsedDirectories = directories.map((entry) => {
  // get the component name from the directory name
  const componentName = parse(parse(entry).dir).base;
  // set the destination to /catalog/stories/<component name>
  const destination = join('.', 'stories', componentName);

  console.log(`Copying ${entry} to ${destination}`);

  // recursively copy the files
  return cp(entry, destination, {recursive: true}, (err) => {
    if (err) throw err;
  });
});

await Promise.all(parsedDirectories);
