/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../linear-progress.js';
import '../../testing/table/test-table.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TemplateBuilder} from '../../testing/templates.js';
import {LinearProgressHarness} from '../harness.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/linearprogress/test/scuba_goldens';

describe('<md-linear-progress>', () => {
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(LinearProgressHarness).withVariants({
        default(directive, props, state) {
          return html`
        <md-linear-progress
          .progress=${Number(state ?? '0')}
          buffer="1"
          .indeterminate=${props.indeterminate ?? false}
          ${directive}
        ></md-linear-progress>
      `;
        }
      });

  function renderTest(title: string, props = {}, classes = '', dark = false) {
    const testTemplates = templates.all(props);
    return env.render(html`
      <md-test-table
        class="${classes} ${dark ? 'dark' : ''}"
        ?dark=${dark}
        title="${title}"
        .states=${['0', '0.25', '0.5', '0.75', '1.0']}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }

  it('rendered progress', async () => {
    renderTest('Progress');
    await env.waitForStability();
    expect(await env.diffRoot('progress')).toHavePassed();
  });

  it('rendered custom theme', async () => {
    renderTest('With custom theme', {}, 'withCustomTheme');
    await env.waitForStability();
    expect(await env.diffRoot('with_custom_theme')).toHavePassed();
  });

  it('rendered custom size', async () => {
    renderTest('With custom size', {}, 'withCustomSize');
    await env.waitForStability();
    expect(await env.diffRoot('with_custom_size')).toHavePassed();
  });

  it('rendered dark', async () => {
    renderTest('Dark', {}, '', true);
    await env.waitForStability();
    expect(await env.diffRoot('dark')).toHavePassed();
  });
});
