/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../radio.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {RadioHarness} from '../harness.js';

import {createRadioTestCases} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/radio/test/scuba_goldens';

describe('<md-radio>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});
  let radioNameIndex = 0;

  const templates =
      new TemplateBuilder().withHarness(RadioHarness).withVariants({
        default(directive, props, state) {
          return html`
            <md-radio
              name=${radioNameIndex++}
              value="on"
              aria-label="Test radio"
              ?checked=${props.checked ?? false}
              ?disabled=${state === State.DISABLED}
              ${directive}
            >
            </md-radio>
          `;
        }
      });

  createRadioTestCases(env, templates);
});
