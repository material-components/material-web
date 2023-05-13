/**
 * Will render a playground example with a project.json in the
 * `/catalog/stories/${dirname}/` directory.
 *
 * This shorcode takes teh following arguments:
 * - dirname: (required) The name of the directory where the project.json is
 *   located
 * - id: (optional) The id of the project. This is used to identify the project on pages
 *   with multiple playground examples.
 * - previewHeight: (optional) The height of the preview window. Defaults to `400`.
 * - editorHeight: (optional) The height of the editor window. Defaults to `500`.
 *
 * @example
 * ```html
 * <!--
 *   Will generate a playground example located at
 *   /catalog/stories/checkbox/project.json
 *   and give the project the id "example1"
 * -->
 * {% playgroundexample dirname="checkbox", id="example2", previewHeight="400", editorHeight="500" %}
 * ```
 */
function playgroundExample(eleventyConfig) {
  eleventyConfig.addShortcode('playgroundexample', (config) => {
    let { id, dirname } = config;
    if (!dirname) {
      throw new Error('No dirname provided to playgroundexample shortcode');
    }

    id ||= 'project';

    const previewHeight = config.previewHeight
      ? `height: ${config.previewHeight}px`
      : 'height: 400px;';
    const editorHeight = config.editorHeight
      ? `height: ${config.editorHeight}px`
      : 'height: 500px;';

    return `
      <lit-island on:idle import="/material-web/js/hydration-entrypoints/playground-elements.js" class="example" aria-hidden="true">
        <playground-project
            id="${id}" project-src="/material-web/assets/stories/${dirname}/project.json">
        <playground-preview
            style="${previewHeight}"
            project="${id}"
        ><md-circular-progress indeterminate></md-circular-progress></playground-preview>
        <playground-file-editor
          style="${editorHeight}"
          project="${id}"
          filename="stories.ts"
          line-numbers
        ><md-circular-progress indeterminate></md-circular-progress></playground-file-editor>
      </lit-island>
    `;
  });
}

module.exports = playgroundExample;
