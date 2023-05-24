/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const fsSync = require('fs');

/**
 * Inline the Rollup-bundled version of a JavaScript module. Path is relative
 * to ./lib or ./build aliased to /js by 11ty
 *
 * In dev mode, instead directly import the module in a
 * script[type=module][src=/js/...], which has already been symlinked directly
 * to the 11ty JS output directory.
 *
 * This filter takes the following arguments:
 * - path: (required) The path of the file to minify and inject relative to
 *         ./lib, ./build, or ./js folders depending on dev mode.
 *
 * @example
 * ```html
 * <!--
 *   In prod will inline the file at /build/ssr-utils/dsd-polyfill in a
 *   synchronous script tag. In dev it will externally load the file in a
 *   module script for faster build.
 * -->
 * <body dsd-pending>
 *   {% inlinejs "ssr-utils/dsd-polyfill.js" %}
 * </body>
 * ```
 *
 * @param eleventyConfig The 11ty config in which to attach this shortcode.
 * @param isDev {boolean} Whether or not the build is in development mode.
 * @param config {{jsdir: string}} Configuration options to set the JS directory
 */
function inlineJS(eleventyConfig, isDev, {jsDir}) {
  eleventyConfig.addShortcode('inlinejs', (path) => {
    // script type module
    if (isDev) {
      return `<script type="module" src="/js/${path}"></script>`;
    }
    const script = fsSync.readFileSync(`${jsDir}/${path}`, 'utf8').trim();
    return `<script>${script}</script>`;
  });
}

module.exports = inlineJS;
