/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Creates Webpack bundle config objects to compile ES2015 JavaScript to ES5.
 */

'use strict';

class JsBundleFactory {
  constructor({
    env,
    pathResolver,
    globber,
    pluginFactory,
  } = {}) {
    /** @type {!Environment} */
    this.env_ = env;

    /** @type {!PathResolver} */
    this.pathResolver_ = pathResolver;

    /** @type {!Globber} */
    this.globber_ = globber;

    /** @type {!PluginFactory} */
    this.pluginFactory_ = pluginFactory;
  }

  createCustomJs(
    {
      bundleName,
      chunks,
      chunkGlobConfig: {
        inputDirectory = null,
        filePathPattern = '**/*.js',
      } = {},
      output: {
        fsDirAbsolutePath = undefined, // Required for building the npm distribution and writing output files to disk
        httpDirAbsolutePath = undefined, // Required for running the demo server
        filenamePattern = this.env_.isProd() ? '[name].min.js' : '[name].js',
        library,
      },
      plugins = [],
    }) {
    chunks = chunks || this.globber_.getChunks({inputDirectory, filePathPattern});

    return {
      name: bundleName,
      entry: chunks,
      output: {
        path: fsDirAbsolutePath,
        publicPath: httpDirAbsolutePath,
        filename: filenamePattern,
        libraryTarget: 'umd',
        library,
      },
      devtool: 'source-map',
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules\/(?:blocking-elements|wicg-inert)/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        }],
      },
      plugins: [
        ...plugins,
      ],
    };
  }

  createMainJsCombined(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-combined',
      chunks: getAbsolutePath('/packages/all.js'),
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'material-components-web.min.js' : 'material-components-web.js',
        library: 'mdc',
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }

  createMainJsALaCarte(
    {
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
      },
      plugins = [],
    }) {
    const getAbsolutePath = (...args) => this.pathResolver_.getAbsolutePath(...args);

    return this.createCustomJs({
      bundleName: 'main-js-a-la-carte',
      chunks: {
        // animation: getAbsolutePath('/packages/mdc-animation/index.js'),
        // autoInit: getAbsolutePath('/packages/mdc-auto-init/index.js'),
        // base: getAbsolutePath('/packages/mdc-base/index.js'),
        checkbox: getAbsolutePath('/packages/checkbox/mwc-checkbox.js'),
        // chips: getAbsolutePath('/packages/chips/index.js'),
        // dialog: getAbsolutePath('/packages/dialog/index.js'),
        // drawer: getAbsolutePath('/packages/drawer/index.js'),
        // floatingLabel: getAbsolutePath('/packages/floating-label/index.js'),
        // formField: getAbsolutePath('/packages/form-field/index.js'),
        // gridList: getAbsolutePath('/packages/grid-list/index.js'),
        // iconToggle: getAbsolutePath('/packages/icon-toggle/index.js'),
        // lineRipple: getAbsolutePath('/packages/line-ripple/index.js'),
        // linearProgress: getAbsolutePath('/packages/linear-progress/index.js'),
        // menu: getAbsolutePath('/packages/menu/index.js'),
        // notchedOutline: getAbsolutePath('/packages/notched-outline/index.js'),
        // radio: getAbsolutePath('/packages/radio/index.js'),
        // ripple: getAbsolutePath('/packages/ripple/index.js'),
        // select: getAbsolutePath('/packages/select/index.js'),
        // selectionControl: getAbsolutePath('/packages/selection-control/index.js'),
        // slider: getAbsolutePath('/packages/slider/index.js'),
        // snackbar: getAbsolutePath('/packages/snackbar/index.js'),
        // tab: getAbsolutePath('/packages/tab/index.js'),
        // tabs: getAbsolutePath('/packages/tabs/index.js'),
        // textfield: getAbsolutePath('/packages/textfield/index.js'),
        // toolbar: getAbsolutePath('/packages/toolbar/index.js'),
        // topAppBar: getAbsolutePath('/packages/top-app-bar/index.js'),
      },
      output: {
        fsDirAbsolutePath,
        httpDirAbsolutePath,
        filenamePattern: this.env_.isProd() ? 'mdc.[name].min.js' : 'mdc.[name].js',
        library: ['mdc', '[name]'],
      },
      plugins: [
        this.pluginFactory_.createCopyrightBannerPlugin(),
        ...plugins,
      ],
    });
  }
}

module.exports = JsBundleFactory;
