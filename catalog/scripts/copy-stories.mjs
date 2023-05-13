import { cp } from 'fs';
import { parse, join } from 'path';
import tinyGlob from 'tiny-glob';

const storyDirectories = ['../*/demo'];
const dirPromises = storyDirectories.map(async (entry) => tinyGlob(entry));
const directories = (await Promise.all(dirPromises)).flat();

const parsedDirectories = directories.map((entry) => {
  const componentName = parse(parse(entry).dir).base;
  const destination = join('.', 'stories', componentName);
  console.log(`Copying ${entry} to ${destination}`);
  return cp(entry, destination, {recursive: true}, (err) => {
    if (err) throw err;
  });
});

await Promise.all(parsedDirectories);
