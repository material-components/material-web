import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import strip from '@rollup/plugin-strip';
import copy from 'rollup-plugin-copy';
import {minify} from 'html-minifier-terser';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const packageNames = [
  'button',
  'checkbox',
  'circular-progress',
  'dialog',
  'drawer',
  'drawer_dismissible',
  'drawer_modal',
  'drawer_standard',
  'drawer_standard_no_header',
  'elevation-overlay',
  'fab',
  'formfield',
  'icon',
  'icon-button',
  'icon-button-toggle',
  'linear-progress',
  'list',
  'menu',
  'radio',
  'ripple',
  'select',
  'slider',
  'snackbar',
  'switch',
  'tabs',
  'tabs_rtl',
  'textarea',
  'textfield',
  'textfield',
  'top-app-bar',
  'top-app-bar_iframe',
  'top-app-bar-fixed',
  'top-app-bar-fixed_iframe',
];

const htmlReplacements = [
  {
    before: /\.\.\/node_modules/g,
    after: 'polyfills',
  },
];

const htmlCopyTransform = (contentsRaw) => {
  let contents = contentsRaw.toString();
  htmlReplacements.forEach((replacement) => {
    contents = contents.replace(
      replacement.before,
      replacement.after
    );
  });
  const out = minify(contents, {
    removeComments: true,
    collapseWhitespace: true,
    caseSenseitive: false,
    minifyCSS: true,
    minifyJS: true
  });

  return out;
};

const configs = [];
packageNames.forEach((name) => {
  const es5 = {
    input: `demos/${name}/index.js`,
    output: {
      file: `dist/demos/${name}/index.es5.js`,
      format: 'iife',
      sourcemap: false,
    },
    plugins: [
      commonjs(),
      resolve(),
      strip({
        functions: ['console.log'],
      }),
      minifyHTML(),
      terser(),
      babel({
        presets: [['@babel/preset-env', {modules: false}]],
        plugins: ['@babel/plugin-transform-runtime'],
        babelHelpers: 'runtime'
      }),
    ],
  };

  const es6 = {
    input: `demos/${name}/index.js`,
    output: {
      dir: `dist/demos/${name}`,
      format: 'es',
      sourcemap: false
    },
    plugins: [
      resolve(),
      terser(),
      strip({
        functions: ['console.log'],
      }),
      copy({
        targets: [
          {
            src: `demos/${name}/index.html`,
            dest: `dist/demos/${name}`,
            transform: htmlCopyTransform,
          }
        ]
      })
    ],
  };

  configs.push(es6);
  configs.push(es5);
});

export default [
  {
    // index es6
    input: 'demos/index.js',
    output: {
      dir: 'dist/demos',
      format: 'es',
    },
    plugins: [
      resolve(),
      minifyHTML(),
      terser(),
      strip({
        functions: ['console.log'],
      }),
      copy({
        targets: [
          {
            src: 'node_modules/@webcomponents/webcomponentsjs',
            dest: 'dist/demos/polyfills/@webcomponents',
          },
          {
            src: 'demos/shared/*.css',
            dest: 'dist/demos/shared',
          },
          {
            src: 'demos/drawer/*.css',
            dest: 'dist/demos/drawer',
          },
          {
            src: 'demos/index.html',
            dest: 'dist/demos',
            transform: htmlCopyTransform,
          },
        ],
      }),
    ],
  },
  {
    // demos index es5
    input: 'demos/index.js',
    output: {
      file: 'dist/demos/index.es5.js',
      format: 'iife',
      sourcemap: false,
    },
    plugins: [
      commonjs(),
      resolve(),
      strip({
        functions: ['console.log'],
      }),
      minifyHTML(),
      terser(),
      babel({
        presets: [['@babel/preset-env', {modules: false}]],
        plugins: ['@babel/plugin-transform-runtime'],
        babelHelpers: 'runtime'
      }),
    ],
  },
  ...configs,
];
