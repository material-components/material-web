/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdOutlinedButton} from './outlined-button.js';

describe('<md-outlined-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedButton.styles);
  });
});
