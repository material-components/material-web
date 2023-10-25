/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../../testing/tokens.js';

import {MdElevatedCard} from './elevated-card.js';

describe('<md-elevated-card>', () => {
  describe('.styles', () => {
    createTokenTests(MdElevatedCard.styles);
  });
});
