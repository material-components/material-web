/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdList} from './list.js';
import {MdListItem} from './list-item.js';

describe('<md-list>', () => {
  describe('.styles', () => {
    createTokenTests(MdList.styles);
  });
});

describe('<md-list-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdListItem.styles);
  });
});
