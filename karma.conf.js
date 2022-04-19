/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

module.exports = function(config) {
  const packages = config.packages ? config.packages.split(',') : [];
  const fileEntries = [];
  const defaultFileEntry = [{
    pattern: 'test/lib/packages/*/test/*.test.js',
    watched: true,
    type: 'module'
  }];

  for (const package of packages) {
    const withoutMwcPrefix = package.replace(/^mwc-/, '');
    const fileEntry = {
      pattern:
          `test/lib/packages/${withoutMwcPrefix}/test/${package}.test.js`,
      watched: true,
      type: 'module',
    };
    fileEntries.push(fileEntry);
  }

  const testFileEntries = fileEntries.length ? fileEntries : defaultFileEntry;

  config.set({
    basePath: '',
    plugins: [
      require.resolve('@open-wc/karma-esm'),
      'karma-*',
    ],
    frameworks: ['esm', 'jasmine'],
    files: [
      {
        pattern:
            'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
        watched: false
      },
      {
        pattern:
            'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
        watched: false
      },
      ...testFileEntries
    ],

    browserDisconnectTimeout: 300000,
    browserNoActivityTimeout: 360000,
    captureTimeout: 420000,
    concurrency: 10,

    esm: {
      nodeResolve: true,
      compatibility: 'auto',
      preserveSymlinks: true,
    },

    reporters: ['mocha'],

    // Note setting --browsers on the command-line always overrides this list.
    browsers: [
      'ChromeHeadless',
      'FirefoxHeadless',
    ],
  });
};
