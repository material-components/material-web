const fsSync = require('fs');

/**
 * Inline the Rollup-bundled version of a JavaScript module. Path is relative
 * to ./lib or ./build.
 *
 * In dev mode, instead directly import the module, which has already been
 * symlinked directly to the TypeScript output directory.
 */
function inlineJS(eleventyConfig, isDev, {jsDir}) {
  eleventyConfig.addShortcode('inlinejs', (path) => {
    if (isDev) {
      return `<script type="module" src="/js/${path}"></script>`;
    }
    const script = fsSync.readFileSync(`${jsDir}/${path}`, 'utf8').trim();
    return `<script>${script}</script>`;
  });
}

module.exports = inlineJS;
