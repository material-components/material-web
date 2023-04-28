/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../../icon/icon.js';
import '../filled-icon-button.js';
import '../filled-tonal-icon-button.js';
import '../standard-icon-button.js';
import '../outlined-icon-button.js';

import {html, nothing} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {IconButtonHarness} from '../harness.js';

import {createIconButtonTestCases} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/iconbutton/test/scuba_goldens';

describe('Icon button', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const getIcons = (useSlottedIcon: boolean) => {
    const textIcon = useSlottedIcon ? nothing : 'token';
    const mdIcon = useSlottedIcon ? html`<md-icon>token</md-icon>` : nothing;
    const mdIconSelected = html`<md-icon slot="selectedIcon">check</md-icon>`;
    const mdIconUnselected =
        useSlottedIcon ? html`<md-icon>close</md-icon>` : 'close';
    return {textIcon, mdIcon, mdIconSelected, mdIconUnselected};
  };

  const standardAndOutlinedTemplates = (useSlottedIcon = false) => {
    const {textIcon, mdIcon, mdIconSelected, mdIconUnselected} =
        getIcons(useSlottedIcon);
    return new TemplateBuilder().withHarness(IconButtonHarness).withVariants({
      standard(directive, props, state) {
        return html`
            <md-standard-icon-button
              aria-label="Test button"
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${textIcon}${mdIcon}
            </md-standard-icon-button>
          `;
      },
      standardLink(directive, props, state) {
        // Link buttons cannot be disabled.
        return state === State.DISABLED ? null : html`
            <md-standard-icon-button
              aria-label="Test button"
              href="https://google.com"
              ${directive}
            >${textIcon}${mdIcon}
            </md-standard-icon-button>
          `;
      },
      standardToggleUnselected(directive, props, state) {
        return html`
            <md-standard-icon-button
              toggle
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-standard-icon-button>
          `;
      },
      standardToggleSelected(directive, props, state) {
        return html`
            <md-standard-icon-button
              toggle
              selected
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-standard-icon-button>
          `;
      },
      outlined(directive, props, state) {
        return html`
            <md-outlined-icon-button
              aria-label="Test button"
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${textIcon}${mdIcon}
            </md-outlined-icon-button>
          `;
      },
      outlinedLink(directive, props, state) {
        // Link buttons cannot be disabled.
        return state === State.DISABLED ? null : html`
            <md-outlined-icon-button
              aria-label="Test button"
              href="https://google.com"
              ${directive}
            >${textIcon}${mdIcon}
            </md-outlined-icon-button>
          `;
      },
      outlinedToggleUnselected(directive, props, state) {
        return html`
            <md-outlined-icon-button
              toggle
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-outlined-icon-button>
          `;
      },
      outlinedToggleSelected(directive, props, state) {
        return html`
            <md-outlined-icon-button
              toggle
              selected
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-outlined-icon-button>
          `;
      },
    });
  };

  const filledAndTonalTemplates = (useSlottedIcon = false) => {
    const {textIcon, mdIcon, mdIconSelected, mdIconUnselected} =
        getIcons(useSlottedIcon);
    return new TemplateBuilder().withHarness(IconButtonHarness).withVariants({
      filled(directive, props, state) {
        return html`
            <md-filled-icon-button
              aria-label="Test button"
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${textIcon}${mdIcon}
            </md-filled-icon-button>
          `;
      },
      filledLink(directive, props, state) {
        // Link buttons cannot be disabled.
        return state === State.DISABLED ? null : html`
            <md-filled-icon-button
              aria-label="Test button"
              href="https://google.com"
              ${directive}
            >${textIcon}${mdIcon}
            </md-filled-icon-button>
          `;
      },
      filledToggleUnselected(directive, props, state) {
        return html`
            <md-filled-icon-button
              toggle
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-filled-icon-button>
          `;
      },
      filledToggleSelected(directive, props, state) {
        return html`
            <md-filled-icon-button
              toggle
              selected
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-filled-icon-button>
          `;
      },
      filledTonal(directive, props, state) {
        return html`
            <md-filled-tonal-icon-button
              aria-label="Test button"
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${textIcon}${mdIcon}
            </md-filled-tonal-icon-button>
          `;
      },
      filledTonalLink(directive, props, state) {
        // Link buttons cannot be disabled.
        return state === State.DISABLED ? null : html`
            <md-filled-tonal-icon-button
              aria-label="Test button"
              href="https://google.com"
              ${directive}
            >${textIcon}${mdIcon}
            </md-filled-tonal-icon-button>
          `;
      },
      filledTonalToggleUnselected(directive, props, state) {
        return html`
            <md-filled-tonal-icon-button
              toggle
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-filled-tonal-icon-button>
          `;
      },
      filledTonalToggleSelected(directive, props, state) {
        return html`
            <md-filled-tonal-icon-button
              toggle
              selected
              ?disabled="${state === State.DISABLED}"
              ${directive}
            >${mdIconSelected}${mdIconUnselected}
            </md-filled-tonal-icon-button>
          `;
      },
    });
  };

  createIconButtonTestCases(
      env, standardAndOutlinedTemplates(), {testName: 'standard_and_outlined'});
  createIconButtonTestCases(
      env, standardAndOutlinedTemplates(true),
      {testName: 'standard_and_outlined'});
  createIconButtonTestCases(
      env, filledAndTonalTemplates(), {testName: 'filled_and_tonal'});
  createIconButtonTestCases(
      env, filledAndTonalTemplates(true), {testName: 'filled_and_tonal'});
});
