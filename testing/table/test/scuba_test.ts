/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../test-table.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../templates.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/testing/table/test/scuba_goldens';

describe('<md-test-table>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates = new TemplateBuilder().withVariants({
    buttonOne(directive, props, state) {
      return html`
        <button ?disabled=${state === State.DISABLED} ${directive}>
          Button 1 ${state}
        </button>
      `;
    },
    buttonTwo(directive, props, state) {
      return html`
        <button ?disabled=${state === State.DISABLED} ${directive}>
          Button 2 ${state}
        </button>
      `;
    },
  });

  it('table', async () => {
    env.render(html`
      <md-test-table
        title="Default"
        .states=${[State.DEFAULT, State.DISABLED]}
        .templates=${templates.all()}
      ></md-test-table>
    `);
    expect(await env.diffRoot('table')).toHavePassed();
  });

  it('dark-mode', async () => {
    env.render(html`
      <md-test-table
        dark
        title="Dark mode"
        .states=${[State.DEFAULT, State.DISABLED]}
        .templates=${templates.all()}
      ></md-test-table>
    `);
    expect(await env.diffRoot('dark-mode')).toHavePassed();
  });
});
