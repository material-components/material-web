/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdElevatedButton} from './elevated-button.js';

describe('<md-elevated-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdElevatedButton.styles);
  });
});
