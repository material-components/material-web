const fsSync = require('fs');

/**
 * Inline the Rollup-bundled version of a JavaScript module. Path is relative
 * to ./lib or ./build.
 *
 * In dev mode, instead directly import the module, which has already been
 * symlinked directly to the TypeScript output directory.
 */
function inlineFile(eleventyConfig) {
  eleventyConfig.addShortcode('inlinefile', (path) => {
    return fsSync.readFileSync(path, 'utf8');
  });
}

module.exports = inlineFile;
