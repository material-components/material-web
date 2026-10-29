/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {
  FX_CLASSES,
  FxChangeEvent,
  fxClasses,
  fxSlot,
  updateFxElement,
} from './fx.js';

describe('fx', () => {
  const env = new Environment();

  describe('fxClasses()', () => {
    it('returns playing class when playing is true', () => {
      expect(fxClasses({playing: true})).toEqual({
        [FX_CLASSES.playing]: true,
      });
    });

    it('returns playing false when playing is false', () => {
      expect(fxClasses({playing: false})).toEqual({
        [FX_CLASSES.playing]: false,
      });
    });

    it('defaults playing to false when omitted from state', () => {
      expect(fxClasses({})).toEqual({
        [FX_CLASSES.playing]: false,
      });
    });

    it('defaults playing to false when state is omitted', () => {
      expect(fxClasses()).toEqual({
        [FX_CLASSES.playing]: false,
      });
    });
  });

  describe('updateFxElement()', () => {
    it('adds .fx-playing and dispatches a bubbling composed FxChangeEvent when playing becomes true', () => {
      const element = document.createElement('div');
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: true});

      expect(element.classList.contains(FX_CLASSES.playing)).toBeTrue();
      expect(events.length).toBe(1);
      expect(events[0].playing).toBeTrue();
      expect(events[0].bubbles).toBeTrue();
      expect(events[0].composed).toBeTrue();
    });

    it('does not dispatch a duplicate FxChangeEvent when called again while already playing', () => {
      const element = document.createElement('div');
      updateFxElement(element, {playing: true});
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: true});

      expect(element.classList.contains(FX_CLASSES.playing)).toBeTrue();
      expect(events).toEqual([]);
    });

    it('removes .fx-playing and dispatches FxChangeEvent when playing becomes false', () => {
      const element = document.createElement('div');
      updateFxElement(element, {playing: true});
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: false});

      expect(element.classList.contains(FX_CLASSES.playing)).toBeFalse();
      expect(events.length).toBe(1);
      expect(events[0].playing).toBeFalse();
    });

    it('does not dispatch FxChangeEvent when called with playing false while already stopped', () => {
      const element = document.createElement('div');
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: false});

      expect(element.classList.contains(FX_CLASSES.playing)).toBeFalse();
      expect(events).toEqual([]);
    });
  });

  describe('fxSlot()', () => {
    let host: HTMLElement;
    let shadowRoot: ShadowRoot;
    let slot: HTMLSlotElement;

    beforeEach(() => {
      host = document.createElement('div');
      shadowRoot = host.attachShadow({mode: 'open'});
      render(html`<slot ${fxSlot()} name="test"></slot>`, shadowRoot);
      slot = shadowRoot.querySelector('slot')!;
      env.render(html`${host}`);
    });

    it('throws an error if used on a non-<slot> element', () => {
      expect(() => {
        env.render(html`<div ${fxSlot()}></div>`);
      }).toThrowError('fxSlot() must be used on a <slot> element.');
    });

    it('adds .fx-playing to the <slot> when an assigned element starts playing', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      host.appendChild(fxEl);
      await env.waitForStability();

      updateFxElement(fxEl, {playing: true});

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeTrue();
    });

    it('removes .fx-playing from the <slot> when an assigned element stops playing', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      host.appendChild(fxEl);
      await env.waitForStability();
      updateFxElement(fxEl, {playing: true});

      updateFxElement(fxEl, {playing: false});

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeFalse();
    });

    it('adds .fx-playing to the <slot> when an already-playing element is slotted in', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      updateFxElement(fxEl, {playing: true});

      host.appendChild(fxEl);
      await env.waitForStability();

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeTrue();
    });

    it('removes .fx-playing from the <slot> when a playing element is removed', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      updateFxElement(fxEl, {playing: true});
      host.appendChild(fxEl);
      await env.waitForStability();

      fxEl.remove();
      await env.waitForStability();

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeFalse();
    });

    it('keeps .fx-playing on the <slot> when one of multiple playing elements stops', async () => {
      const fxEl1 = document.createElement('div');
      fxEl1.slot = 'test';
      const fxEl2 = document.createElement('div');
      fxEl2.slot = 'test';
      host.appendChild(fxEl1);
      host.appendChild(fxEl2);
      await env.waitForStability();
      updateFxElement(fxEl1, {playing: true});
      updateFxElement(fxEl2, {playing: true});

      updateFxElement(fxEl1, {playing: false});

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeTrue();
    });

    it('removes .fx-playing from the <slot> once all assigned elements stop playing', async () => {
      const fxEl1 = document.createElement('div');
      fxEl1.slot = 'test';
      const fxEl2 = document.createElement('div');
      fxEl2.slot = 'test';
      host.appendChild(fxEl1);
      host.appendChild(fxEl2);
      await env.waitForStability();
      updateFxElement(fxEl1, {playing: true});
      updateFxElement(fxEl2, {playing: true});
      updateFxElement(fxEl1, {playing: false});

      updateFxElement(fxEl2, {playing: false});

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeFalse();
    });

    it('prunes disconnected elements from tracked playing targets on slotchange', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      host.appendChild(fxEl);
      await env.waitForStability();
      updateFxElement(fxEl, {playing: true});

      fxEl.remove();
      const sibling = document.createElement('div');
      sibling.slot = 'test';
      host.appendChild(sibling);
      await env.waitForStability();

      expect(slot.classList.contains(FX_CLASSES.playing)).toBeFalse();
    });
  });
});
