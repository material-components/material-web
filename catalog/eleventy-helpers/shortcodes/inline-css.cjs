/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const CleanCSS = require('clean-css');

/**
 * Bundle, minify, and inline a CSS file. Path is relative to ./site/css/.
 *
 * In dev mode, instead import the CSS file directly.
 *
 * This filter takes the following arguments:
 * - path: (required) The path of the file to minify and inject relative to
 *         /site/css
 *
 * @example
 * ```html
 * <!--
 *   In prod will minify and inline the file at site/css/global.css into the
 *   page to prevent a new network request. In dev will inject a <link> tag for
 *   a faster build.
 * -->
 * <head>
 *   {% inlinecss "global.css" %}
 * </head>
 * ```
 *
 * @param eleventyConfig The 11ty config in which to attach this shortcode.
 * @param isDev {boolean} Whether or not the build is in development mode.
 */
function inlineCSS(eleventyConfig, isDev) {
  eleventyConfig.addShortcode('inlinecss', (path) => {
    if (isDev) {
      return `<link rel="stylesheet" href="/css/${path}">`;
    }
    const result = new CleanCSS({ inline: ['local'] }).minify([
      `./site/css/${path}`,
    ]);
    if (result.errors.length > 0 || result.warnings.length > 0) {
      throw new Error(
        `CleanCSS errors/warnings on file ${path}:\n\n${[
          ...result.errors,
          ...result.warnings,
        ].join('\n')}`
      );
    }
    return `<style>${result.styles}</style>`;
  });
}

module.exports = inlineCSS;
