/**
 * Will conditionally render content on GitHub.
 *
 * @example
 * ```html
 * {% githubonly %}
 *   This will not appear on the site. Only on github.
 * {% endgithubonly %}
 * ```
 */
function githubOnly(eleventyConfig) {
  eleventyConfig.addPairedShortcode('githubonly', (content) => {
    return '';
  });
}

module.exports = githubOnly;
