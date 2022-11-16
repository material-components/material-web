/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledButton} from './filled-button.js';

describe('<md-filled-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledButton.styles);
  });
});
