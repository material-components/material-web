/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Ripple} from '../mwc-ripple';

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

describe('md-ripple', () => {
  let element: Ripple;
  let internals: RippleInternals;
  let container: HTMLDivElement;

  describe('basic', () => {
    beforeEach(async () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('md-ripple');
      internals = element as unknown as RippleInternals;
      container.appendChild(element);
      await element.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it('initializes as an md-ripple', () => {
      expect(element).toBeInstanceOf(Ripple);
    });

    it('sets pressed class on startPress()', async () => {
      element.startPress();
      await element.updateComplete;
      expect(internals.fgActivation).toEqual(true);
    });

    it('removes pressed class on endPress()', async () => {
      element.startPress();
      await animationTimer();
      element.endPress();
      await animationTimer();
      expect(internals.fgActivation).toEqual(false);
    });

    it('sets focused class on startFocus()', async () => {
      element.startFocus();
      await animationTimer();
      expect(internals.bgFocused).toEqual(true);
    });

    it('removes focused class on endFocus()', async () => {
      element.startFocus();
      await animationTimer();
      element.endFocus();
      await animationTimer();
      expect(internals.bgFocused).toEqual(false);
    });

    it('sets hover class on startHover()', async () => {
      element.startHover();
      await element.updateComplete;
      expect(internals.hovering).toEqual(true);
    });

    it('removes hover class on endHover()', async () => {
      element.startHover();
      await element.updateComplete;
      element.endHover();
      await element.updateComplete;
      expect(internals.hovering).toEqual(false);
    });

    it('stops hovering when disabled', async () => {
      element.startHover();
      await element.updateComplete;
      element.disabled = true;
      await element.updateComplete;
      expect(internals.hovering).toEqual(false);
    });
  });
});
