/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdOutlinedField} from './outlined-field.js';

describe('<md-outlined-field>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedField.styles);
  });
});
