/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {AssistChip} from './assist-chip.js';
import {SuggestionChip} from './suggestion-chip.js';

customElements.define('test-suggestion-chip', SuggestionChip);

describe('Suggestion chip', () => {
  it('should be an assist chip', () => {
    expect(new SuggestionChip()).toBeInstanceOf(AssistChip);
  });
});
