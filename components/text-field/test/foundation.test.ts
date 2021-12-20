/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '../../testing/environment';
import {TextFieldFoundation} from '../lib/foundation';

describe('TextFieldFoundation', () => {
  const env = new Environment();

  it('should exist', async () => {
    await env.waitForStability();
    expect(TextFieldFoundation).toBeTruthy();
  });
});
