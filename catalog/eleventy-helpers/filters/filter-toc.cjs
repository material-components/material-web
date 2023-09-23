/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A filter that sanitizes <md-*> tags in a string so that they can be rendered
 * as text in the TOC.
 *
 * @example
 * ```html
 * <!--
 *   Will filter out a TOC that has <md-*> tags in it
 * -->
 * {{ toc | filterToc | safe }}
 * ```
 *
 * @param eleventyConfig The 11ty config in which to attach this filter.
 */
function filterToc(eleventyConfig) {
  eleventyConfig.addFilter('filterToc', function (text) {
    const mdTagName = /<(md-.+?)>/g;
    return text.replace(mdTagName, function (match, tagName) {
      return `&lt;${tagName}&gt;`;
    });
  });
}

module.exports = filterToc;
