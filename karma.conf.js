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
    frameworks: ['esm', 'mocha', 'chai'],
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

    client: {
      mocha: {
        reporter: 'html',
        ui: 'tdd',
      },
    },

    reporters: ['mocha'],

    // Note setting --browsers on the command-line always overrides this list.
    browsers: [
      'ChromeHeadless',
      'FirefoxHeadless',
    ],
  });

  if (process.env.USE_SAUCE) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      throw new Error(
          'SAUCE_USERNAME and SAUCE_ACCESS_KEY must be set with USE_SAUCE')
    }

    const SAUCE_LAUNCHERS = {
      'sl-edge': {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        version: 'latest',
        platform: 'Windows 10',
      },
      'sl-ie': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        version: '11',
        platform: 'Windows 8.1',
      },
      'sl-safari-11': {
        base: 'SauceLabs',
        browserName: 'safari',
        version: '11',
        platform: 'macOS 10.13',
      },
      'sl-safari-10': {
        base: 'SauceLabs',
        browserName: 'safari',
        version: '10',
        platform: 'OS X 10.12',
      },
      // 'sl-safari-9': {
      //   base: 'SauceLabs',
      //   browserName: 'safari',
      //   version: '9',
      //   platform: 'OS X 10.11',
      // },
      // 'sl-chrome-41': {
      //   base: 'SauceLabs',
      //   browserName: 'chrome',
      //   version: '41',
      //   platform: 'Linux'
      // },
    };

    config.set({
      sauceLabs: {
        idleTimeout: 600,
        testName: 'MWC Unit Tests',
        build: process.env.SAUCE_BUILD_ID,
        tunnelIdentifier: process.env.SAUCE_TUNNEL_ID,
      },
      // Attempt to de-flake Sauce Labs tests on TravisCI.
      transports: ['polling'],
      browserDisconnectTolerance: 1,
      reporters: ['saucelabs', 'mocha'],

      // TODO(aomarks) Update the browser versions here.
      customLaunchers: SAUCE_LAUNCHERS,
      browsers: [...config.browsers, ...Object.keys(SAUCE_LAUNCHERS)],
    });
  }
};
