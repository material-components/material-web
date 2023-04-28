/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../filled-button.js';
import '../tonal-button.js';
import '../elevated-button.js';
import '../outlined-button.js';
import '../text-button.js';

import {html, nothing, TemplateResult} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {ButtonHarness} from '../harness.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/button/test/scuba_goldens';

function displayLinkButton(linkButton: TemplateResult, show: boolean) {
  return show ? linkButton : nothing;
}

describe('<md-button>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(ButtonHarness).withVariants({
        filled(directive, props, state) {
          return html`
            <div style="display: flex; gap: 8px">
            <md-filled-button
              ?disabled=${state === State.DISABLED}
              .trailingIcon=${props.trailingIcon ?? false}
              ${directive}
            >
              ${props.content ?? 'Filled'}
            </md-filled-button>
            ${
              displayLinkButton(
                  html`<md-filled-button
              ${directive}
            >
              ${props.content ?? 'Filled link'}
            </md-filled-button>`,
                  state !== State.DISABLED && !props.trailingIcon)}
        </div>
          `;
        },
        tonal(directive, props, state) {
          return html`
          <div style="display: flex; gap: 8px">
            <md-tonal-button
              ?disabled=${state === State.DISABLED}
              .trailingIcon=${props.trailingIcon ?? false}
              ${directive}
            >
              ${props.content ?? 'Tonal'}
            </md-tonal-button>
            ${
              displayLinkButton(
                  html`<md-tonal-button
              ${directive}
            >
              ${props.content ?? 'Tonal link'}
            </md-tonal-button>`,
                  state !== State.DISABLED && !props.trailingIcon)}
        </div>
          `;
        },
        elevated(directive, props, state) {
          return html`
          <div style="display: flex; gap: 8px">
            <md-elevated-button
              ?disabled=${state === State.DISABLED}
              .trailingIcon=${props.trailingIcon ?? false}
              ${directive}
            >
              ${props.content ?? 'Elevated'}
            </md-elevated-button>
            ${
              displayLinkButton(
                  html`
            <md-elevated-button
              ${directive}
            >
              ${props.content ?? 'Elevated link'}
            </md-elevated-button>`,
                  state !== State.DISABLED && !props.trailingIcon)}
        </div>
          `;
        },
        outlined(directive, props, state) {
          return html`
          <div style="display: flex; gap: 8px">
            <md-outlined-button
              ?disabled=${state === State.DISABLED}
              .trailingIcon=${props.trailingIcon ?? false}
              ${directive}
            >
              ${props.content ?? 'Outlined'}
            </md-outlined-button>
            ${
              displayLinkButton(
                  html`
            <md-outlined-button
              ${directive}
            >
              ${props.content ?? 'Outlined link'}
            </md-outlined-button>`,
                  state !== State.DISABLED && !props.trailingIcon)}
        </div>
          `;
        },
        text(directive, props, state) {
          return html`
          <div style="display: flex; gap: 8px">
            <md-text-button
              ?disabled=${state === State.DISABLED}
              .trailingIcon=${props.trailingIcon ?? false}
              ${directive}
            >
              ${props.content ?? 'Text'}
            </md-text-button>
            ${
              displayLinkButton(
                  html`
            <md-text-button
              ${directive}
            >
              ${props.content ?? 'Text link'}
            </md-text-button>`,
                  state !== State.DISABLED && !props.trailingIcon)}
        </div>
          `;
        },
      });

  function getSlottedIcon() {
    return html`
      <span class="md3-button__icon" slot="icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" width="18px" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M0 0h24v24H0z" fill="none" opacity=".1"/>
          <path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"/>
        </svg>
      </span>
    `;
  }

  it('default', async () => {
    renderTest('Default', {content: html`Label`});

    expect(await env.diffRootWithRtl('default')).toHaveAllPassed();
  });

  it('leading icon', async () => {
    renderTest(
        'Leading Icon States', {content: html`Label${getSlottedIcon()}`});

    expect(await env.diffRootWithRtl('leading_icon')).toHaveAllPassed();
  });

  it('trailing icon', async () => {
    renderTest(
        'Trailing Icon States',
        {trailingIcon: true, content: html`Label${getSlottedIcon()}`});

    expect(await env.diffRootWithRtl('trailing_icon')).toHaveAllPassed();
  });

  function renderTest(title: string, props: TemplateProps<ButtonHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }
});
