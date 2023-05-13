const htmlMinifier = require('html-minifier');

/**
 * Minifies HTML in production mode.
 */
function inlineJS(eleventyConfig, isDev) {
  // minify the html in Prod mode
  eleventyConfig.addTransform('htmlMinify', function (content, outputPath) {
    if (isDev || !outputPath.endsWith('.html')) {
      return content;
    }
    const minified = htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    });
    return minified;
  });
}

module.exports = inlineJS;
