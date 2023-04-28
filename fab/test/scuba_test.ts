/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../../testing/table/test-table.js';
import '../../icon/icon.js';
import '../branded-fab.js';
import '../fab.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {FabHarness} from '../harness.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/fab/test/scuba_goldens';

/** Creates fab test cases based on provided templates. */
export function createFabTestCases(
    env: ScubaEnvironment, templates: TemplateBuilder<FabHarness, string>,
    {testName}: {testName: string}) {
  it(testName, async () => {
    renderTest('States');

    expect(await env.diffRootWithRtl(testName)).toHaveAllPassed();
  });

  it(`${testName}_lowered`, async () => {
    renderTest('Lowered', {lowered: true});

    expect(await env.diffRoot(`${testName}_lowered`)).toHavePassed();
  });

  it(`${testName}_dark`, async () => {
    renderDarkTest('States');

    expect(await env.diffRoot(`${testName}_dark`)).toHavePassed();
  });

  function renderTest(title: string, props: TemplateProps<FabHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
    <md-test-table
      title="${title}"
      .states=${[State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED]}
      .templates=${testTemplates}
    ></md-test-table>
  `);
  }

  function renderDarkTest(
      title: string, props: TemplateProps<FabHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
    <md-test-table
      dark
      class="dark"
      title="${title}"
      .states=${[State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED]}
      .templates=${testTemplates}
    ></md-test-table>
  `);
  }
}

describe('FAB', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates = new TemplateBuilder().withHarness(FabHarness).withVariants({
    surface(directive, props) {
      return html`
        <md-fab
          class="fab"
          size="small"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          size="large"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
      `;
    },
    primary(directive, props) {
      return html`
        <md-fab
          class="fab"
          variant="primary"
          size="small"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="primary"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="primary"
          size="large"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
      `;
    },
    secondary(directive, props) {
      return html`
        <md-fab
          class="fab"
          variant="secondary"
          size="small"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="secondary"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="secondary"
          size="large"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
      `;
    },
    tertiary(directive, props) {
      return html`
        <md-fab
          class="fab"
          variant="tertiary"
          size="small"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="tertiary"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
        <md-fab
          class="fab"
          variant="tertiary"
          size="large"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <md-icon slot="icon">edit</md-icon>
        </md-fab>
      `;
    },
    branded(directive, props) {
      return html`
        <md-branded-fab
          class="fab"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <svg slot="icon" width="36" height="36" viewBox="0 0 36 36">
            <path fill="#34A853" d="M16 16v14h4V20z"/>
            <path fill="#4285F4" d="M30 16H20l-4 4h14z"/>
            <path fill="#FBBC05" d="M6 16v4h10l4-4z"/>
            <path fill="#EA4335" d="M20 16V6h-4v14z"/>
            <path fill="none" d="M0 0h36v36H0z"/>
          </svg>
        </md-branded-fab>
        <md-branded-fab
          class="fab"
          size="large"
          .lowered=${props.lowered ?? false}
          ${directive}
        >
          <svg slot="icon" width="36" height="36" viewBox="0 0 36 36">
            <path fill="#34A853" d="M16 16v14h4V20z"/>
            <path fill="#4285F4" d="M30 16H20l-4 4h14z"/>
            <path fill="#FBBC05" d="M6 16v4h10l4-4z"/>
            <path fill="#EA4335" d="M20 16V6h-4v14z"/>
            <path fill="none" d="M0 0h36v36H0z"/>
          </svg>
        </md-branded-fab>
      `;
    },
  });

  const harness = FabHarness;
  const extendedTemplates =
      new TemplateBuilder().withHarness(harness).withVariants({
        surface(directive, props) {
          return html`
            <md-fab
              .label="${'Edit'}"
              .lowered=${props.lowered ?? false}
              ${directive}
            >
              <md-icon slot="icon">edit</md-icon>
            </md-fab>
          `;
        },
        primary(directive, props) {
          return html`
            <md-fab
              variant="primary"
              .label="${'Edit'}"
              .lowered=${props.lowered ?? false}
              ${directive}
            >
              <md-icon slot="icon">edit</md-icon>
            </md-fab>
          `;
        },
        secondary(directive, props) {
          return html`
            <md-fab
              variant="secondary"
              .label="${'Edit'}"
              .lowered=${props.lowered ?? false}
              ${directive}
            >
              <md-icon slot="icon">edit</md-icon>
            </md-fab>
          `;
        },
        tertiary(directive, props) {
          return html`
                <md-fab
                  variant="tertiary"
                 .label="${'Edit'}"
                  .lowered=${props.lowered ?? false}
                  ${directive}
                >
                  <md-icon slot="icon">edit</md-icon>
                </md-fab>
              `;
        },
        branded(directive, props) {
          return html`
            <md-branded-fab
              .label="${'Create'}"
              .lowered=${props.lowered ?? false}
              ${directive}
            >
              <svg slot="icon" width="36" height="36" viewBox="0 0 36 36">
                <path fill="#34A853" d="M16 16v14h4V20z"/>
                <path fill="#4285F4" d="M30 16H20l-4 4h14z"/>
                <path fill="#FBBC05" d="M6 16v4h10l4-4z"/>
                <path fill="#EA4335" d="M20 16V6h-4v14z"/>
                <path fill="none" d="M0 0h36v36H0z"/>
              </svg>
            </md-branded-fab>
          `;
        },
      });

  createFabTestCases(env, templates, {testName: 'default'});
  createFabTestCases(env, extendedTemplates, {testName: 'extended'});
});
