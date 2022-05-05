/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import * as strongFocus from '../strong-focus.js';

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
      strongFocus.setup(new MockFocus(), true);
    });

    it('does not show strong focus by default', () => {
      expect(strongFocus.shouldShowStrongFocus()).toBeFalse();
    });

    it('does not force strong focus by default', () => {
      expect(strongFocus.isStrongFocusForced()).toBeFalse();
    });

    describe('keyboard navigation', () => {
      it('shows strong focus on Tab', () => {
        simulateKeydown('Tab');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowLeft', () => {
        simulateKeydown('ArrowLeft');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowLeft', () => {
        simulateKeydown('ArrowLeft');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowRight', () => {
        simulateKeydown('ArrowRight');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowUp', () => {
        simulateKeydown('ArrowUp');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
      it('shows strong focus on ArrowDown', () => {
        simulateKeydown('ArrowDown');
        expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
      });
    });

    describe('pointer interaction', () => {
      it('does not show strong focus', () => {
        simulateKeydown('Tab');
        strongFocus.pointerPress();
        expect(strongFocus.shouldShowStrongFocus()).toBeFalse();
      });
    });
  });

  describe('force strong focus', () => {
    beforeAll(() => {
      strongFocus.setForceStrongFocus(true);
    });
    afterAll(() => {
      strongFocus.setForceStrongFocus(false);
    });

    beforeEach(() => {
      strongFocus.setup(new MockFocus(), true);
    });

    it('shows strong focus when forced', () => {
      expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
    });

    it('reports that strong focus is forced', () => {
      expect(strongFocus.isStrongFocusForced()).toBeTrue();
    });

    it('shows strong focus after pointer interaction', () => {
      strongFocus.pointerPress();
      expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
    });
  });

  describe('shared focus state', () => {
    let focus!: MockFocus;

    beforeEach(() => {
      focus = new MockFocus();
      strongFocus.setup(focus);
    });

    it('reads from shared state', () => {
      focus.visible = true;
      expect(strongFocus.shouldShowStrongFocus()).toBeTrue();
    });

    it('writes to shared state', () => {
      focus.visible = true;
      strongFocus.pointerPress();
      expect(focus.visible).toBeFalse();
    });
  });

  describe('setup function', () => {
    it('removes keydown listener when not wanted', () => {
      const focus = new MockFocus();
      strongFocus.setup(focus);
      simulateKeydown('Tab');
      expect(focus.visible).toBeFalse();
    });
  });
});