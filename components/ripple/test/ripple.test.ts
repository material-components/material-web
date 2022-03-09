/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MdRipple} from '../ripple';

interface RippleInternals {
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}

function animationTimer(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 200);
  });
}

describe('md-ripple', () => {
  let element: MdRipple;
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
      expect(element).toBeInstanceOf(MdRipple);
    });

    it('sets pressed class on beginPress()', async () => {
      element.beginPress();
      await element.updateComplete;
      expect(internals.pressed).toEqual(true);
    });

    it('removes pressed class on endPress()', async () => {
      element.beginPress();
      await animationTimer();
      element.endPress();
      await animationTimer();
      expect(internals.pressed).toEqual(false);
    });

    it('sets focused class on beginFocus()', async () => {
      element.beginFocus();
      await animationTimer();
      expect(internals.focused).toEqual(true);
    });

    it('removes focused class on endFocus()', async () => {
      element.beginFocus();
      await animationTimer();
      element.endFocus();
      await animationTimer();
      expect(internals.focused).toEqual(false);
    });

    it('sets hover class on beginHover()', async () => {
      element.beginHover();
      await element.updateComplete;
      expect(internals.hovered).toEqual(true);
    });

    it('removes hover class on endHover()', async () => {
      element.beginHover();
      await element.updateComplete;
      element.endHover();
      await element.updateComplete;
      expect(internals.hovered).toEqual(false);
    });

    it('stops hovering when disabled', async () => {
      element.beginHover();
      await element.updateComplete;
      element.disabled = true;
      await element.updateComplete;
      expect(internals.hovered).toEqual(false);
    });
  });
});
