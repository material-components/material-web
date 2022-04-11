/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '../../testing/environment';
import {spyOnAllFunctions} from '../../testing/jasmine';
import {SegmentedButtonFoundation} from '../lib/foundation';
import {SegmentedButtonAdapter} from '../lib/state';

describe('SegmentedButtonFoundation', () => {
  const env = new Environment();
  function setupTest() {
    const adapter: SegmentedButtonAdapter = {
      state: {
        disabled: false,
        selected: false,
        focusable: false,
        label: '',
      },
      animateSelection: () => {
        const anim = new Animation();
        anim.play();
        return Promise.resolve(anim);
      },
    };

    const foundation = new SegmentedButtonFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  it('#onSelectedChange() animates selection', async () => {
    // Setup.
    const {adapter} = setupTest();
    const animation = new Animation();
    adapter.animateSelection.and.returnValue(Promise.resolve(animation));
    // Test case.
    adapter.state.selected = true;
    await env.waitForStability();
    // Assertion.
    expect(adapter.animateSelection)
        .withContext('should animates selecting')
        .toHaveBeenCalledTimes(1);
  });

  it('#onSelectedChange() animates deselection', async () => {
    // Setup.
    const {adapter} = setupTest();
    adapter.state.selected = true;
    await env.waitForStability();
    adapter.animateSelection.calls.reset();
    const animation = new Animation();
    adapter.animateSelection.and.returnValue(Promise.resolve(animation));
    // Test case.
    adapter.state.selected = false;
    await env.waitForStability();
    // Assertion.
    expect(adapter.animateSelection)
        .withContext('should animates selecting')
        .toHaveBeenCalledTimes(1);
  });
});