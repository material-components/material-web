/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdMenu} from './menu.js';
import {MdMenuItem} from './menu-item.js';

describe('<md-menu>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenu.styles);
  });
});

describe('<md-menu-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenuItem.styles);
  });
});
