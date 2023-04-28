/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../checkbox.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {CheckboxHarness} from '../harness.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/checkbox/test/scuba_goldens';

describe('<md-checkbox>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(CheckboxHarness).withVariants({
        default(directive, props, state) {
          return html`
            <md-checkbox
              aria-label="Test checkbox"
              ?checked=${props.checked || false}
              ?indeterminate=${props.indeterminate || false}
              ?disabled=${state === State.DISABLED}
              ?error=${state === State.ERROR}
              ${directive}
            >
            </md-checkbox>
          `;
        }
      });

  it('unselected', async () => {
    renderTest('Unselected');

    expect(await env.diffRoot('unselected')).toHavePassed();
  });

  it('unselected_dark', async () => {
    renderDarkTest('Unselected Dark');

    expect(await env.diffRoot('unselected_dark')).toHavePassed();
  });

  it('selected', async () => {
    renderTest('Selected', {checked: true});

    expect(await env.diffRootWithRtl('selected')).toHaveAllPassed();
  });

  it('selected_dark', async () => {
    renderDarkTest('Selected Dark', {checked: true});

    expect(await env.diffRoot('selected_dark')).toHavePassed();
  });

  it('indeterminate', async () => {
    renderTest('Indeterminate', {indeterminate: true});

    expect(await env.diffRoot('indeterminate')).toHavePassed();
  });

  it('indeterminate_dark', async () => {
    renderDarkTest('Indeterminate Dark', {indeterminate: true});

    expect(await env.diffRoot('indeterminate_dark')).toHavePassed();
  });

  function renderTest(
      title: string, props: TemplateProps<CheckboxHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.ERROR, State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }

  function renderDarkTest(
      title: string, props: TemplateProps<CheckboxHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.ERROR, State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }
});
