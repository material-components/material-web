/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Ripple} from '@material/mwc-ripple/mwc-ripple';

interface RippleInternals {
  hovering: boolean;
  bgFocused: boolean;
  fgActivation: boolean;
}

function animationTimer(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
}

suite('mwc-ripple', () => {
  let element: Ripple;
  let internals: RippleInternals;
  let container: HTMLDivElement;

  suite('basic', () => {
    setup(async () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('mwc-ripple');
      internals = element as unknown as RippleInternals;
      container.appendChild(element);
      await element.updateComplete;
    });

    teardown(() => {
      document.body.removeChild(container);
    });

    test('initializes as an mwc-ripple', () => {
      assert.instanceOf(element, Ripple);
    });

    test('sets pressed class on startPress()', async () => {
      element.startPress();
      await element.updateComplete;
      assert.equal(internals.fgActivation, true);
    });

    test('removes pressed class on endPress()', async () => {
      element.startPress();
      await animationTimer();
      element.endPress();
      await animationTimer();
      assert.equal(internals.fgActivation, false);
    });

    test('sets focused class on startFocus()', async () => {
      element.startFocus();
      await animationTimer();
      assert.equal(internals.bgFocused, true);
    });

    test('removes focused class on endFocus()', async () => {
      element.startFocus();
      await animationTimer();
      element.endFocus();
      await animationTimer();
      assert.equal(internals.bgFocused, false);
    });

    test('sets hover class on startHover()', async () => {
      element.startHover();
      await element.updateComplete;
      assert.equal(internals.hovering, true);
    });

    test('removes hover class on endHover()', async () => {
      element.startHover();
      await element.updateComplete;
      element.endHover();
      await element.updateComplete;
      assert.equal(internals.hovering, false);
    });

    test('stops hovering when disabled', async () => {
      element.startHover();
      await element.updateComplete;
      element.disabled = true;
      await element.updateComplete;
      assert.equal(internals.hovering, false);
    });
  });
});
