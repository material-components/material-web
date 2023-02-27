/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledTextField} from './filled-text-field.js';

describe('<md-filled-field>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledTextField.styles);
  });
});
