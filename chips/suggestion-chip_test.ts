/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdSuggestionChip} from './suggestion-chip.js';

describe('<md-suggestion-chip>', () => {
  describe('.styles', () => {
    createTokenTests(MdSuggestionChip.styles);
  });
});
