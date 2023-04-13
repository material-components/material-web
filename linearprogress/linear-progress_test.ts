/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createTokenTests} from '../testing/tokens.js';

import {MdLinearProgress} from './linear-progress.js';

describe('<md-linear-progress>', () => {
  describe('.styles', () => {
    createTokenTests(MdLinearProgress.styles);
  });
});
