/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../../testing/tokens.js';

import {MdBadge} from './badge.js';

describe('<md-badge>', () => {
  describe('.styles', () => {
    createTokenTests(MdBadge.styles);
  });
});
