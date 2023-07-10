/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../../testing/tokens.js';

import {MdOutlinedSegmentedButton} from './outlined-segmented-button.js';

describe('<md-outlined-segmented-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedSegmentedButton.styles);
  });
});
