/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdTextButton} from './text-button.js';

describe('<md-text-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTextButton.styles);
  });
});
