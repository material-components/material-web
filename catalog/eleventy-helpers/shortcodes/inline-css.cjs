const CleanCSS = require('clean-css');

/**
 * Bundle, minify, and inline a CSS file. Path is relative to ./site/css/.
 *
 * In dev mode, instead import the CSS file directly.
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
