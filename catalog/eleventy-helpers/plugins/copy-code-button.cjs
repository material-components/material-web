/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Renders a copy-code-button component around the original markdown code block
 * if the codeblock is not empty.
 *
 * @param originalRule The original markown-it rule to modilfy.
 * @return A modified markdownit render rule that injects a copy-code-button island
 */
function renderCode(originalRule) {
  return (...args) => {
    const [tokens, idx] = args;
    // Escape quotes and apostrophes so that they don't break the HTML.
    const codeblockContent = tokens[idx].content
      .replaceAll('"', '&quot;')
      .replaceAll("'", "&apos;");

    const originalHTMLContent = originalRule(...args);

    if (codeblockContent.length === 0) {
      return originalHTMLContent;
    }

    return `
<lit-island
    import="/js/hydration-entrypoints/copy-code-button.js"
    on:interaction="focusin,pointerenter,touchstart">
  <copy-code-button>
    ${originalHTMLContent}
  </copy-code-button>
</lit-island>
`;
  };
}

/**
 * Adds a copy code button to code blocks.
 *
 * @param markdownIt The markdown-it instance to use.
 */
function copyCodeButtonPlugin(markdownIt) {
  markdownIt.use(() => {
    markdownIt.renderer.rules.code_block = renderCode(markdownIt.renderer.rules.code_block);
    markdownIt.renderer.rules.fence = renderCode(markdownIt.renderer.rules.fence);
  });
}

module.exports = copyCodeButtonPlugin;