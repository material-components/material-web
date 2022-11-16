/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {createTokenTests} from '../testing/tokens.js';

import {MdElevatedLinkButton} from './elevated-link-button.js';

describe('<md-elevated-link-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdElevatedLinkButton.styles);
  });
});
