/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdTonalButton} from './tonal-button.js';

describe('<md-tonal-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTonalButton.styles);
  });
});
