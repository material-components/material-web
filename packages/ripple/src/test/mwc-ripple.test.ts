/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Ripple} from '@material/mwc-ripple';

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

    test('sets activation class when activated', async () => {
      element.activate();
      await element.updateComplete;
      assert.equal(internals.fgActivation, true);
    });

    test('removes activation class when deactivated', async () => {
      element.activate();
      await animationTimer();
      element.deactivate();
      await animationTimer();
      assert.equal(internals.fgActivation, false);
    });

    test('sets focused class when focused', async () => {
      element.handleFocus();
      await animationTimer();
      assert.equal(internals.bgFocused, true);
    });

    test('removes focused class when blurred', async () => {
      element.handleFocus();
      await animationTimer();
      element.handleBlur();
      await animationTimer();
      assert.equal(internals.bgFocused, false);
    });

    test('sets hover class on mouseenter', async () => {
      element.handleMouseEnter();
      await element.updateComplete;
      assert.equal(internals.hovering, true);
    });

    test('removes hover class on mouseleave', async () => {
      element.handleMouseEnter();
      await element.updateComplete;
      element.handleMouseLeave();
      await element.updateComplete;
      assert.equal(internals.hovering, false);
    });
  });
});
