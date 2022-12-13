/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdCheckbox} from './checkbox.js';

describe('<md-checkbox>', () => {
  describe('.styles', () => {
    createTokenTests(MdCheckbox.styles);
  });
});
