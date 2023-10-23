/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledButton} from './filled-button.js';

describe('<md-filled-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledButton.styles);
  });
});
