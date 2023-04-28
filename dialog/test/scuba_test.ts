/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../dialog.js';

import {html, nothing} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TemplateBuilder} from '../../testing/templates.js';
import {DialogHarness} from '../harness.js';

import {createDialogTestCases, DialogExtendedProperties} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/dialog/test/scuba_goldens';

describe('<md-dialog>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(DialogHarness).withVariants({
        default(directive, props) {
          const extendedProps = props as DialogExtendedProperties;
          return html`
            <md-dialog
              style="${styleMap({
            '--md-dialog-opening-transition-duration': '0ms',
            '--md-dialog-closing-transition-duration': '0ms',
            ...(extendedProps.styleInfo ?? {})
          })}"
              .open=${extendedProps.open ?? false}
              .fullscreen=${extendedProps.fullscreen ?? false}
              .modeless=${extendedProps.modeless ?? false}
              .footerHidden=${extendedProps.footerHidden ?? false}
              .fullscreenBreakpoint=${
              extendedProps.fullscreenBreakpoint ??
              '(max-width: 600px), (max-height: 400px)'}
              .stacked=${extendedProps.stacked ?? false}
              ${directive}
            >
            ${extendedProps.header ?? nothing}
            ${extendedProps.headlinePrefix ?? nothing}
            ${extendedProps.headline ?? nothing}
            ${extendedProps.headlineSuffix ?? nothing}
            ${extendedProps.content ?? nothing}
            ${extendedProps.footer ?? nothing}
            </md-dialog>
          `;
        }
      });

  createDialogTestCases(env, templates);
});
