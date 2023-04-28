/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../../icon/icon.js';
import '../filled-text-field.js';
import '../outlined-text-field.js';

import {literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';

import {createTextFieldTests} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/textfield/test/scuba_goldens';

// TODO(b/227808635): refactor to conform to testing best practices
describe('<md-text-field>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  createTextFieldTests({
    env,
    filled: literal`md-filled-text-field`,
    outlined: literal`md-outlined-text-field`,
    icon: literal`md-icon`,
    table: literal`md-test-table`
  });
});
