/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const cheerio = require('cheerio');

/**
 * @param {import('cheerio').CheerioAPI} $
 * @param {[RegExp|string, string,(match: string, ...pattern: string[]) => string]} redirects Any redirects we want to apply
 */
function fixLinks($, redirects) {
  const anchors = $('a');

  for (const anchor of anchors) {
    const href = $(anchor).attr('href');
    if (!href) continue;

    const isExternal = href.startsWith('http');
    if (isExternal) continue;

    let [path, hash] = href.split('#');

    for (const [pattern, replacement] of redirects) {
      const regex = new RegExp(pattern);
      path = path.replace(regex, replacement);
    }
    const endsWithMd = path.endsWith('.md');

    if (endsWithMd) {
      path = path.replace(/\.md$/, '/');
    }
    const endsWithSlash = path.endsWith('/');
    if (!endsWithSlash) {
      path += '/';
    }

    const newHref = path + (hash ? `#${hash}` : '');
    $(anchor).attr('href', newHref);
  }
}

/**
 * @param {import('cheerio').CheerioAPI} $
 */
function blockquote($) {
  const blockquotes = $('blockquote');

  for (const blockquote of blockquotes) {
    const $blockquote = $(blockquote);
    const $first = $blockquote.children().first();
    const text = $first.text().trim();
    const iconRegex = /^(tip|important|note):\s*/i;
    const match = text.match(iconRegex);
    const hasIcon = match;

    if (!hasIcon) {
      $blockquote.addClass('none');
      continue;
    }

    let newText = text.replace(iconRegex, '');
    $first.text(newText);

    const type = match[1].toLowerCase();
    let icon = '';
    switch (type) {
      case 'tip':
        $blockquote.addClass('tip');
        icon = 'star';
        break;
      case 'important':
        $blockquote.addClass('important');
        icon = 'priority_high';
        break;
      case 'note':
        $blockquote.addClass('note');
        icon = 'bookmark';
        break;
    }

    $blockquote.wrapInner('<div class="content"></div>');
    $blockquote.prepend(`<div class="icon"><md-icon>${icon}</md-icon></div>`);
  }
}

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
 * @param {[RegExp|string, string,(match: string, ...pattern: string[]) => string]} redirects Any redirects we want to apply
 */
function mdMarkdown(eleventyConfig, redirects) {
  eleventyConfig.addFilter('mdMarkdown', function (html) {
    const $ = cheerio.load(html);

    fixLinks($, redirects);
    blockquote($);

    return $.html();
  });
}

module.exports = mdMarkdown;
