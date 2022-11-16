/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdTextButton} from './text-button.js';

describe('<md-text-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTextButton.styles);
  });
});
