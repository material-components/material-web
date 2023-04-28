/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../switch.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {SwitchHarness} from '../harness.js';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/switch/test/scuba_goldens';

describe('<md-switch>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(SwitchHarness).withVariants({
        'default': (directive, props, state) => {
          return html`
            <md-switch
              ?selected=${props.selected ?? false}
              ?disabled=${state === State.DISABLED}
              ${directive}
            ></md-switch>
          `;
        },
        'icons': (directive, props, state) => {
          return html`
            <md-switch
              icons
              ?selected=${props.selected ?? false}
              ?disabled=${state === State.DISABLED}
              ${directive}
            ></md-switch>
          `;
        },
        'onlySelectedIcon': (directive, props, state) => {
          return html`
            <md-switch
              showOnlySelectedIcon
              ?selected=${props.selected ?? false}
              ?disabled=${state === State.DISABLED}
              ${directive}
            ></md-switch>
          `;
        },
      });

  it('default', async () => {
    renderTest('Default');

    expect(await env.diffRootWithRtl('default')).toHaveAllPassed();
  });

  it('default dark', async () => {
    renderDarkTest('Default Dark');

    expect(await env.diffRootWithRtl('default_dark')).toHaveAllPassed();
  });

  it('selected', async () => {
    renderTest('Selected', {selected: true});

    expect(await env.diffRootWithRtl('selected')).toHaveAllPassed();
  });

  it('selected dark', async () => {
    renderDarkTest('Selected Dark', {selected: true});

    expect(await env.diffRootWithRtl('selected_dark')).toHaveAllPassed();
  });

  it('touch target', async () => {
    renderTest('Touch target');

    await env.highlightTouchTarget('md-switch:not([disabled])');

    expect(await env.diffRootWithRtl('touch_target')).toHaveAllPassed();
  });

  it('touch target dark', async () => {
    renderDarkTest('Touch target dark');

    await env.highlightTouchTarget('md-switch:not([disabled])');

    expect(await env.diffRootWithRtl('touch_target_dark')).toHaveAllPassed();
  });

  function renderTest(title: string, props: TemplateProps<SwitchHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        title=${title}
        .states=${
            [State.DEFAULT,
             State.HOVER,
             State.FOCUS,
             State.PRESSED,
             State.DISABLED,
    ]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }

  function renderDarkTest(
      title: string, props: TemplateProps<SwitchHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        dark
        class="dark"
        title=${title}
        .states=${
            [State.DEFAULT,
             State.HOVER,
             State.FOCUS,
             State.PRESSED,
             State.DISABLED,
    ]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }
});
