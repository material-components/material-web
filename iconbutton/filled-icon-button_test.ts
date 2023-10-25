/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledIconButton} from './filled-icon-button.js';

describe('<md-filled-icon-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledIconButton.styles);
  });
});
