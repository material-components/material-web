/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../../testing/tokens.js';

import {MdOutlinedCard} from './outlined-card.js';

describe('<md-outlined-card>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedCard.styles);
  });
});
