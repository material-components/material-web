/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdOutlinedLinkButton} from './outlined-link-button.js';

describe('<md-outlined-link-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedLinkButton.styles);
  });
});
