/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MdRipple} from '../ripple';

enum RippleStateClasses {
  HOVERED = 'md3-ripple--hovered',
  FOCUSED = 'md3-ripple--focused',
  PRESSED = 'md3-ripple--pressed',
}

function animationTimer(time = 200): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

describe('md-ripple', () => {
  let element: MdRipple;
  let surface: HTMLDivElement;
  let container: HTMLDivElement;

  describe('basic', () => {
    beforeEach(async () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('md-ripple');
      container.appendChild(element);
      await element.updateComplete;

      surface = element.renderRoot.querySelector('.md3-ripple-surface')!;
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

      expect(surface).toHaveClass(RippleStateClasses.PRESSED);
    });

    it('removes pressed class on endPress()', async () => {
      element.beginPress();
      await animationTimer();
      element.endPress();
      await animationTimer(450);

      expect(surface).not.toHaveClass(RippleStateClasses.PRESSED);
    });

    it('sets focused class on beginFocus()', async () => {
      element.beginFocus();
      await animationTimer();

      expect(surface).toHaveClass(RippleStateClasses.FOCUSED);
    });

    it('removes focused class on endFocus()', async () => {
      element.beginFocus();
      await animationTimer();
      element.endFocus();
      await animationTimer();

      expect(surface).not.toHaveClass(RippleStateClasses.FOCUSED);
    });

    it('sets hover class on beginHover()', async () => {
      element.beginHover();
      await element.updateComplete;

      expect(surface).toHaveClass(RippleStateClasses.HOVERED);
    });

    it('removes hover class on endHover()', async () => {
      element.beginHover();
      await element.updateComplete;
      element.endHover();
      await element.updateComplete;

      expect(surface).not.toHaveClass(RippleStateClasses.HOVERED);
    });

    it('stops hovering when disabled', async () => {
      element.beginHover();
      await element.updateComplete;
      element.disabled = true;
      await element.updateComplete;

      expect(surface).not.toHaveClass(RippleStateClasses.HOVERED);
    });
  });
});
