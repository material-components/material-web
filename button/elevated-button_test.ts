/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdElevatedButton} from './elevated-button.js';

describe('<md-elevated-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdElevatedButton.styles);
  });
});
