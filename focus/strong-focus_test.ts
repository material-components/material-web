/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {isStrongFocusForced, pointerPress, setForceStrongFocus, setup, shouldShowStrongFocus} from './strong-focus.js';

class MockFocus {
  constructor(public visible = false) {}
  setVisible(visible: boolean) {
    this.visible = visible;
  }
}

function simulateKeydown(key: string) {
  const ev = new KeyboardEvent('keydown', {key, bubbles: true});
  window.dispatchEvent(ev);
}

describe('Strong Focus', () => {
  describe('standalone operation', () => {
    beforeEach(() => {
      setup(new MockFocus(), true);
    });

    it('does not show strong focus by default', () => {
      expect(shouldShowStrongFocus()).toBeFalse();
    });

    it('does not force strong focus by default', () => {
      expect(isStrongFocusForced()).toBeFalse();
    });

    describe('keyboard navigation', () => {
      it('shows strong focus on Tab', () => {
        simulateKeydown('Tab');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowLeft', () => {
        simulateKeydown('ArrowLeft');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowLeft', () => {
        simulateKeydown('ArrowLeft');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowRight', () => {
        simulateKeydown('ArrowRight');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowUp', () => {
        simulateKeydown('ArrowUp');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowDown', () => {
        simulateKeydown('ArrowDown');
        expect(shouldShowStrongFocus()).toBeTrue();
      });
    });

    describe('pointer interaction', () => {
      it('does not show strong focus', () => {
        simulateKeydown('Tab');
        pointerPress();
        expect(shouldShowStrongFocus()).toBeFalse();
      });
    });
  });

  describe('force strong focus', () => {
    beforeAll(() => {
      setForceStrongFocus(true);
    });
    afterAll(() => {
      setForceStrongFocus(false);
    });

    beforeEach(() => {
      setup(new MockFocus(), true);
    });

    it('shows strong focus when forced', () => {
      expect(shouldShowStrongFocus()).toBeTrue();
    });

    it('reports that strong focus is forced', () => {
      expect(isStrongFocusForced()).toBeTrue();
    });

    it('shows strong focus after pointer interaction', () => {
      pointerPress();
      expect(shouldShowStrongFocus()).toBeTrue();
    });
  });

  describe('shared focus state', () => {
    let focus!: MockFocus;

    beforeEach(() => {
      focus = new MockFocus();
      setup(focus);
    });

    it('reads from shared state', () => {
      focus.visible = true;
      expect(shouldShowStrongFocus()).toBeTrue();
    });

    it('writes to shared state', () => {
      focus.visible = true;
      pointerPress();
      expect(focus.visible).toBeFalse();
    });
  });

  describe('setup function', () => {
    it('removes keydown listener when not wanted', () => {
      const focus = new MockFocus();
      setup(focus);
      simulateKeydown('Tab');
      expect(focus.visible).toBeFalse();
    });
  });
});
