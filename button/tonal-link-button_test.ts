/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdTonalLinkButton} from './tonal-link-button.js';

describe('<md-tonal-link-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTonalLinkButton.styles);
  });
});
