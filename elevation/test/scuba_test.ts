/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../elevation.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TemplateBuilder} from '../../testing/templates.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/elevation/test/scuba_goldens';

describe('<md-elevation>', () => {
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates = new TemplateBuilder().withVariants({
    shadow(directive, props, state) {
      return html`
        <md-elevation class="level${state}"></md-elevation>
      `;
    },
  });

  it('default', async () => {
    const testTemplates = templates.all();
    env.render(html`
      <md-test-table
        title="Levels"
        .states=${['0', '1', '2', '3', '4', '5']}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('default')).toHavePassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Levels"
        .states=${['0', '1', '2', '3', '4', '5']}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('default_dark')).toHavePassed();
  });
});
