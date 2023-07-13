/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createTokenTests} from '../testing/tokens.js';

import {MdCircularProgress} from './circular-progress.js';

describe('<md-circular-progress>', () => {
  describe('.styles', () => {
    createTokenTests(MdCircularProgress.styles);
  });
});
