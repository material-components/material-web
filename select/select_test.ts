/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdOutlinedSelect} from './outlined-select.js';
import {MdFilledSelect} from './filled-select.js';
import {MdSelectOption} from './select-option.js';

describe('<md-outlined-select>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedSelect.styles);
  });
});

describe('<md-filled-select>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledSelect.styles);
  });
});

describe('<md-select-option>', () => {
  describe('.styles', () => {
    createTokenTests(MdSelectOption.styles);
  });
});
