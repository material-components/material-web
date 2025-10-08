import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {COMPONENT_CUSTOM_ELEMENTS} from '../component-custom-elements.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let exports: {[path: string]: {import: string; types: string}} = {
  './all.js': {
    import: './all.js',
    types: './all.d.ts',
  },
};

Object.keys(COMPONENT_CUSTOM_ELEMENTS).forEach((component) => {
  let paths: string[] = [];
  paths.push(
    ...COMPONENT_CUSTOM_ELEMENTS[
      component as keyof typeof COMPONENT_CUSTOM_ELEMENTS
    ],
  );

  // add internals to the list of paths.
  const componentDirname = component.toLocaleLowerCase();
  const internalDir = path.resolve(
    `${__dirname}/../../${componentDirname}/internal/`,
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
      .map((f) => path.join(componentDirname, 'internal', f.name));

    paths.push(...internals);
  } catch {
    // no internal directory → ignore
  }

  paths.forEach((filepath) => {
    filepath = filepath.replace(/\.ts$/, '');
    exports[`./${filepath}.js`] = {
      import: `./${filepath}.js`,
      types: `./${filepath}.d.ts`,
    };
  });
});

const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../package.json')).toString(),
);

packageJson.exports = exports;

writeFileSync(
  path.resolve(__dirname, '../../package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
);
