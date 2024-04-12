/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdOutlinedIconButton} from './outlined-icon-button.js';

describe('<md-outlined-icon-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedIconButton.styles);
  });
});
