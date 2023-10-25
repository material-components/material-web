/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../../testing/tokens.js';

import {MdFilledCard} from './filled-card.js';

describe('<md-filled-card>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledCard.styles);
  });
});
