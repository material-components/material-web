/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const cheerio = require('cheerio');

/**
 * Fixes links and applies redirects to markdown files filtered by this filter.
 * It ignores external links, applies redirects, removes .md extendsions, and
 * adds trailing slashes.
 *
 * @param {import('cheerio').CheerioAPI} $ Cheerio instance
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

    // it's probably a href="#section" link
    if (path.length === 0) {
      continue;
    }

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
 * Reformats blockquotes to add an icon and format it.
 *
 * @param {import('cheerio').CheerioAPI} $ Cheerio instance
 */
function blockquote($) {
  const blockquotes = $('blockquote');

  for (const blockquote of blockquotes) {
    const $blockquote = $(blockquote);
    const $first = $blockquote.children().first();
    const text = $first.text().trim();
    const iconRegex = /^(tip|important|note|warning):\s*/i;
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
      case 'warning':
        $blockquote.addClass('warning');
        icon = 'warning';
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
 * A filter that applies our set of transforms to markdown output such as fixing
 * links, and adding icons to blockquotes.
 *
 * @example
 * ```html
 * <!--
 *   Will fix links and apply blockquote styling.
 * -->
 * {{ content | mdMarkdown | safe }}
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
