/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../filled-field.js';
import '../outlined-field.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {FieldHarness} from '../harness.js';

enum FieldState {
  POPULATED = 'Populated'
}

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/field/test/scuba_goldens';

// TODO(b/227808635): refactor to conform to testing best practices
describe('<md-field>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(FieldHarness).withVariants({
        filled(directive, props, state) {
          const showValue =
              state === FieldState.POPULATED || state === State.HOVER;
          return html`
            <md-filled-field
              .label=${props.label}
              ?disabled=${state === State.DISABLED || (props.disabled ?? false)}
              .error=${state === State.ERROR || (props.error ?? false)}
              .populated=${showValue}
              .required=${props.required ?? false}
              ${directive}
            >
              <input .value=${showValue ? 'Input text' : ''}>
              ${props.content}
            </md-filled-field>
          `;
        },
        outlined(directive, props, state) {
          const showValue =
              state === FieldState.POPULATED || state === State.HOVER;
          return html`
            <md-outlined-field
              .label=${props.label}
              ?disabled=${state === State.DISABLED || (props.disabled ?? false)}
              .error=${state === State.ERROR || (props.error ?? false)}
              .populated=${showValue}
              .required=${props.required ?? false}
              ${directive}
            >
              <input .value=${showValue ? 'Input text' : ''}>
              ${props.content}
            </md-outlined-field>
          `;
        },
      });

  it('default', async () => {
    const testTemplates = templates.all({label: 'Label'}, {});
    env.render(html`
      <md-test-table
        title="States"
        .states=${
            [State.DEFAULT, State.FOCUS, FieldState.POPULATED, State.HOVER]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('default')).toHaveAllPassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="States"
        .states=${
            [State.DEFAULT, State.FOCUS, FieldState.POPULATED, State.HOVER]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('default_dark')).toHavePassed();
  });

  it('disabled', async () => {
    const testTemplates = templates.all({label: 'Label', disabled: true});
    env.render(html`
      <md-test-table
        title="Disabled states"
        .states=${[State.DEFAULT, FieldState.POPULATED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('disabled')).toHavePassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Disabled states"
        .dark="${true}"
        .states=${[State.DEFAULT, FieldState.POPULATED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('disabled_dark')).toHavePassed();
  });

  it('error', async () => {
    const testTemplates = templates.all({label: 'Label', error: true});
    env.render(html`
      <md-test-table
        title="Error states"
        .states=${
            [State.DEFAULT, State.FOCUS, FieldState.POPULATED, State.HOVER]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('error')).toHavePassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Error states"
        .states=${
            [State.DEFAULT, State.FOCUS, FieldState.POPULATED, State.HOVER]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('error_dark')).toHavePassed();
  });

  it('shape', async () => {
    const testTemplates = templates.all({label: 'Label'});
    env.render(html`
      <md-test-table
        class="shape"
        title="Shape"
        .states=${[State.DEFAULT, State.FOCUS]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('shape')).toHaveAllPassed();
  });

  it('supporting text', async () => {
    const testTemplates = templates.all({
      label: 'Label',
      content: html`
        <span slot="supporting-text">Supporting text</span>
        <span slot="supporting-text-end">0/0</span>
      `
    });

    env.render(html`
      <md-test-table
        title="Supporting text"
        .states=${
            [State.DEFAULT, State.FOCUS, State.HOVER, State.ERROR,
             State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('supporting_text')).toHaveAllPassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Supporting text"
        .states=${
            [State.DEFAULT, State.FOCUS, State.HOVER, State.ERROR,
             State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRoot('supporting_text_dark')).toHavePassed();
  });

  it('clipped_label', async () => {
    const testTemplates =
        templates.all({label: 'Label that is clipped since it is really long'});
    env.render(html`
      <md-test-table
        title="States"
        .states=${
            [State.DEFAULT, State.FOCUS, FieldState.POPULATED, State.HOVER]}
        .templates=${testTemplates}
      ></md-test-table>
    `);

    expect(await env.diffRootWithRtl('clipped_label')).toHaveAllPassed();
  });
});
