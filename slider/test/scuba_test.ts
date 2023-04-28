/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../slider.js';

import {html} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {SliderHarness} from '../harness.js';

import {createSliderTestCases} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/slider/test/scuba_goldens';

describe('<md-slider>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(SliderHarness).withVariants({
        default(directive, props, state) {
          return html`
            <md-slider
              .value=${props.value as number ?? 4}
              aria-label="Test slider"
              ?disabled=${state === State.DISABLED}
              .withTickMarks=${props.withTickMarks || false}
              .withLabel=${props.withLabel || false}
              ${directive}
            >
            </md-slider>
          `;
        }
      });

  createSliderTestCases(env, templates);
});
