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

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

const USING_TRAVISCI = Boolean(process.env.TRAVIS);
const USING_SL = USING_TRAVISCI && Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);

const SL_LAUNCHERS = {
  'sl-ie': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 8.1',
  },
  'sl-edge-17': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: '17',
    platform: 'Windows 10',
  },
  'sl-edge-15': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: '15',
    platform: 'Windows 10',
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
  'sl-safari-9': {
    base: 'SauceLabs',
    browserName: 'safari',
    version: '9',
    platform: 'OS X 10.11',
  },
  'sl-chrome-41': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '41',
    platform: 'Linux'
  },
};

const HEADLESS_LAUNCHERS = {
  /** See https://github.com/travis-ci/travis-ci/issues/8836#issuecomment-348248951 */
  'ChromeHeadlessNoSandbox': {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox'],
  },
  'FirefoxHeadless': {
    base: 'Firefox',
    flags: ['-headless'],
  },
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      {pattern: 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', watched: false},
      {pattern: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', watched: false},
      {pattern: 'test/unit/mwc-{button,fab,formfield,icon,linear-progress,radio,ripple,switch}.test.js', watched: false},
    ],
    preprocessors: {
      'test/unit/mwc-*.js': ['rollup', 'sourcemap'],
    },

    rollupPreprocessor: {
      external: ['chai'],
      plugins: [
        resolve({
          module: true,
          jsnext: true,
          main: true,
        }),
        babel({
          presets: ['es2015-rollup'],
        }),
      ],
      output: {
        format: 'iife',
        sourceMap: 'inline',
      },
    },

    browsers: determineBrowsers(),
    browserDisconnectTimeout: 40000,
    browserNoActivityTimeout: 120000,
    captureTimeout: 240000,
    concurrency: USING_SL ? 10 : 1,
    customLaunchers: {...SL_LAUNCHERS, ...HEADLESS_LAUNCHERS},

    client: {
      mocha: {
        reporter: 'html',
        ui: 'qunit',
      },
    },

    mochaReporter: {
      output: 'minimal'
    }
  });

  // See https://github.com/karma-runner/karma-sauce-launcher/issues/73
  if (USING_TRAVISCI) {
    config.set({
      sauceLabs: {
        testName: 'Material Components Web Unit Tests - CI',
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        startConnect: false,
      },
      // Attempt to de-flake Sauce Labs tests on TravisCI.
      transports: ['polling'],
      browserDisconnectTolerance: 3,
    });
  }
};

function determineBrowsers() {
  if (!USING_TRAVISCI) {
    return ['Chrome', 'Firefox'];
  }
  const browsers = [...Object.keys(HEADLESS_LAUNCHERS)];
  if (USING_SL) {
    browsers.push(...Object.keys(SL_LAUNCHERS));
  }
  return browsers;
}
