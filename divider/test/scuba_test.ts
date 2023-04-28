/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../divider.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/divider/test/scuba_goldens';

describe('<md-divider>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates = new TemplateBuilder().withVariants({
    default() {
      return html`
        <section>
          <md-divider></md-divider>
        </section>
      `;
    },
    inset() {
      return html`
        <section>
          <md-divider inset></md-divider>
        </section>
      `;
    },
    insetStart() {
      return html`
        <section>
          <md-divider inset-start></md-divider>
        </section>
      `;
    },
    insetEnd() {
      return html`
        <section>
          <md-divider inset-end></md-divider>
        </section>
      `;
    }
  });

  it('divider', async () => {
    env.render(html`
      <md-test-table
        title="Divider"
        .states=${[State.DEFAULT]}
        .templates=${templates.all()}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('divider')).toHaveAllPassed();
  });

  it('divider_dark', async () => {
    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Divider Dark"
        .states=${[State.DEFAULT]}
        .templates=${templates.all()}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('divider_dark')).toHaveAllPassed();
  });
});
