/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledTonalButton} from './filled-tonal-button.js';

describe('<md-filled-tonal-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledTonalButton.styles);
  });
});
