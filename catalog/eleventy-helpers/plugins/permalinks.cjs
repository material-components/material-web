/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const markdownItAnchor = require('markdown-it-anchor');
const slugifyLib = require('slugify');

/**
 * An 11ty plugin that integrates `markdown-it-anchor` to 11ty's markdown
 * engine. This allows us to inject an <a> around our <h*> elements.
 *
 * @param markdownIt The markdown-it instance to use.
 */
function permalinks(markdownIt) {
  // Use the same slugify as 11ty for markdownItAnchor.
  const slugify = (s) => slugifyLib(s, { lower: true });

  const linkAfterHeaderBase = markdownItAnchor.permalink.linkAfterHeader({
    style: 'visually-hidden',
    class: 'anchor',
    visuallyHiddenClass: 'offscreen',
    assistiveText: (title) => `Link to “${title}”`,
  });

  /**
   * Wraps the link with a div so that it's more accessible. Implementation
   * taken from lit.dev
   *
   * https://github.com/lit/lit.dev/blob/18d86901c2814913a35b201d78e95ba8735c42e7/packages/lit-dev-content/.eleventy.js#L105-L134
   */
  const linkAfterHeaderWithWrapper = (slug, opts, state, idx) => {
    const headingTag = state.tokens[idx].tag;
    if (!headingTag.match(/^h[123456]$/)) {
      throw new Error(`Expected token to be a h1-6: ${headingTag}`);
    }

    // Using markdownit's token system to inject a div wrapper so that we can
    // have:
    // <div class="heading h2">
    //   <h2 id="interactive-demo">Interactive Demo<h2>
    //   <a class="anchor" href="#interactive-demo">
    //     <span class="offscreen">Permalink to "Interactive Demo"</span>
    //   </a>
    // </div>
    state.tokens.splice(
      idx,
      0,
      Object.assign(new state.Token('div_open', 'div', 1), {
        attrs: [['class', `heading ${headingTag}`]],
        block: true,
      })
    );
    state.tokens.splice(
      idx + 4,
      0,
      Object.assign(new state.Token('div_close', 'div', -1), {
        block: true,
      })
    );
    linkAfterHeaderBase(slug, opts, state, idx + 1);
  };

  // Apply the anchor plugin to markdownit
  markdownIt.use(markdownItAnchor, {
    slugify,
    permalink: linkAfterHeaderWithWrapper,
    permalinkClass: 'anchor',
    permalinkSymbol: '#',
    level: [2, 3, 4], // only apply to h2 h3 and h4
  });
}

module.exports = permalinks;
