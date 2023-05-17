const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const slugifyLib = require('slugify');

function permalinks(eleventyConfig) {
  // Use the same slugify as 11ty for markdownItAnchor.
  const slugify = (s) => slugifyLib(s, { lower: true });

  const linkAfterHeaderBase = markdownItAnchor.permalink.linkAfterHeader({
    style: 'visually-hidden',
    class: 'anchor',
    visuallyHiddenClass: 'offscreen',
    assistiveText: (title) => `Permalink to “${title}”`,
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

  // Markdown anchor plugin
  const md = markdownIt({
    html: true,
    breaks: false, // 2 newlines for paragraph break instead of 1
    linkify: true,
  }).use(markdownItAnchor, {
    slugify,
    permalink: linkAfterHeaderWithWrapper,
    permalinkClass: 'anchor',
    permalinkSymbol: '#',
    level: [2, 3, 4],
  });
  eleventyConfig.setLibrary('md', md);
}

module.exports = permalinks;
