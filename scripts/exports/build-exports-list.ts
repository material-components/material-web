import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import pathlib from 'node:path';
import {fileURLToPath} from 'node:url';
import {COMPONENT_CUSTOM_ELEMENTS} from '../component-custom-elements.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathlib.dirname(__filename);

type ExportEntry = {import: string; types: string};

let exports: {[path: string]: ExportEntry} = {
  './all.js': {
    import: './all.js',
    types: './all.d.ts',
  },
};

Object.keys(COMPONENT_CUSTOM_ELEMENTS).forEach((component) => {
  const paths: string[] = [];
  paths.push(
    ...COMPONENT_CUSTOM_ELEMENTS[
      component as keyof typeof COMPONENT_CUSTOM_ELEMENTS
    ],
  );

  // add internals to the list of paths.
  const componentName = component.toLocaleLowerCase();
  const internalDir = pathlib.resolve(
    `${__dirname}/../../${componentName}/internal/`,
  );
  try {
    const internals = readdirSync(internalDir, {withFileTypes: true})
      .filter(
        (f) =>
          f.isFile() &&
          f.name.endsWith('.ts') &&
          !f.name.endsWith('.d.ts') &&
          !f.name.includes('_test') &&
          !f.name.includes('-styles'),
      )
      .map((f) => `${componentName}/internal/${f.name}`);

    paths.push(...internals);
  } catch {
    // no internal directory → ignore
  }

  paths.forEach((filepath) => {
    const path = filepath.replace(/\.ts$/, '');
    exports[`./${path}.js`] = {
      import: `./${path}.js`,
      types: `./${path}.d.ts`,
    };
  });
});

const packageLocation = pathlib.resolve(
  `${__dirname}/../../package.json`,
);

const packageJson = JSON.parse(
  readFileSync(packageLocation).toString(),
);

packageJson.exports = exports;

writeFileSync(
  packageLocation,
  JSON.stringify(packageJson, null, 2) + '\n',
);
