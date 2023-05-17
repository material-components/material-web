import { cp, writeFile, readFile } from 'fs/promises';
import { join, relative } from 'path';
import tinyGlob from 'tiny-glob';

async function copyImages() {
  await cp(
    join('..', 'docs', 'components', 'images'),
    join('site', 'components', 'images'),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
}

async function getReadmeFiles() {
  const readmeFilesGlob = ['../docs/components/**/*.md'];
  const readmeFiles = readmeFilesGlob.map(async (entry) => tinyGlob(entry));
  return (await Promise.all(readmeFiles)).flat();
}

const transforms = [
  {
    before: /<!-- catalog-only-start -->(\n)*?<!--\s*/gm,
    after: '',
  },
  {
    before: /\s*-->(\n)*?<!-- catalog-only-end -->/gm,
    after: '',
  },
  {
    before: /\s*<!-- github-only-start -->(.|\n)*?<!-- github-only-end -->\s*/gm,
    after: '\n\n',
  },
  {
    before: /images\//gm,
    after: '../images/',
  },
];

/**
 * @param {Array<string>} filepaths The readme file paths to transform.
 */
async function transformReadmes(filepaths) {
  const readmePromises = filepaths.map(async (entry) => {
    let readme = await readFile(entry, 'utf8');
    console.log(`Transforming ${entry}`);

    transforms.forEach((transform) => {
      readme = readme.replaceAll(transform.before, transform.after);
    });

    const outputPath = join('site', relative(join('..','docs'), entry));
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