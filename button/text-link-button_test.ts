/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdTextLinkButton} from './text-link-button.js';

describe('<md-text-link-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTextLinkButton.styles);
  });
});
