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
      expect(fxClasses({playing: true}))
        .withContext('fxClasses({playing: true})')
        .toEqual({
          [FX_CLASSES.playing]: true,
        });
    });

    it('returns playing false when playing is false', () => {
      expect(fxClasses({playing: false}))
        .withContext('fxClasses({playing: false})')
        .toEqual({
          [FX_CLASSES.playing]: false,
        });
    });

    it('defaults playing to false when omitted from state', () => {
      expect(fxClasses({}))
        .withContext('fxClasses({})')
        .toEqual({
          [FX_CLASSES.playing]: false,
        });
    });

    it('defaults playing to false when state is omitted', () => {
      expect(fxClasses())
        .withContext('fxClasses()')
        .toEqual({
          [FX_CLASSES.playing]: false,
        });
    });
  });

  describe('updateFxElement()', () => {
    it('adds .fx-playing and dispatches a bubbling non-composed FxChangeEvent when playing becomes true', () => {
      const element = document.createElement('div');
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: true});

      expect(element.classList.contains(FX_CLASSES.playing))
        .withContext('element should have .fx-playing class')
        .toBeTrue();
      expect(events.length).withContext('dispatched event count').toBe(1);
      expect(events[0].playing).withContext('event.playing').toBeTrue();
      expect(events[0].bubbles).withContext('event.bubbles').toBeTrue();
      expect(events[0].composed).withContext('event.composed').toBeFalse();
    });

    it('does not propagate FxChangeEvent across an enclosing shadow root boundary', () => {
      const outerHost = document.createElement('div');
      const outerShadow = outerHost.attachShadow({mode: 'open'});
      const fxEl = document.createElement('div');
      outerShadow.appendChild(fxEl);
      env.render(html`${outerHost}`);
      const outerEvents: FxChangeEvent[] = [];
      outerHost.addEventListener('fx-change', (e) => {
        outerEvents.push(e);
      });

      updateFxElement(fxEl, {playing: true});

      expect(outerEvents)
        .withContext(
          'enclosing host should not receive FxChangeEvent from shadow root',
        )
        .toEqual([]);
    });

    it('does not dispatch a duplicate FxChangeEvent when called again while already playing', () => {
      const element = document.createElement('div');
      updateFxElement(element, {playing: true});
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: true});

      expect(element.classList.contains(FX_CLASSES.playing))
        .withContext('element should retain .fx-playing class')
        .toBeTrue();
      expect(events)
        .withContext('no duplicate event when already playing')
        .toEqual([]);
    });

    it('removes .fx-playing and dispatches FxChangeEvent when playing becomes false', () => {
      const element = document.createElement('div');
      updateFxElement(element, {playing: true});
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: false});

      expect(element.classList.contains(FX_CLASSES.playing))
        .withContext('element should not have .fx-playing class')
        .toBeFalse();
      expect(events.length).withContext('dispatched event count').toBe(1);
      expect(events[0].playing).withContext('event.playing').toBeFalse();
    });

    it('does not dispatch FxChangeEvent when called with playing false while already stopped', () => {
      const element = document.createElement('div');
      const events: FxChangeEvent[] = [];
      element.addEventListener('fx-change', (e) => {
        events.push(e);
      });

      updateFxElement(element, {playing: false});

      expect(element.classList.contains(FX_CLASSES.playing))
        .withContext('element should not have .fx-playing class')
        .toBeFalse();
      expect(events)
        .withContext('no event dispatched when already stopped')
        .toEqual([]);
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
      })
        .withContext('fxSlot() directive on non-<slot> element')
        .toThrowError('fxSlot() must be used on a <slot> element.');
    });

    it('adds .fx-playing to the <slot> when an assigned element starts playing', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      host.appendChild(fxEl);
      await env.waitForStability();

      updateFxElement(fxEl, {playing: true});

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should have .fx-playing class')
        .toBeTrue();
    });

    it('removes .fx-playing from the <slot> when an assigned element stops playing', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      host.appendChild(fxEl);
      await env.waitForStability();
      updateFxElement(fxEl, {playing: true});

      updateFxElement(fxEl, {playing: false});

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should not have .fx-playing class')
        .toBeFalse();
    });

    it('adds .fx-playing to the <slot> when an already-playing element is slotted in', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      updateFxElement(fxEl, {playing: true});

      host.appendChild(fxEl);
      await env.waitForStability();

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should have .fx-playing class')
        .toBeTrue();
    });

    it('removes .fx-playing from the <slot> when a playing element is removed', async () => {
      const fxEl = document.createElement('div');
      fxEl.slot = 'test';
      updateFxElement(fxEl, {playing: true});
      host.appendChild(fxEl);
      await env.waitForStability();

      fxEl.remove();
      await env.waitForStability();

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should not have .fx-playing class')
        .toBeFalse();
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

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should keep .fx-playing while another element plays')
        .toBeTrue();
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

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should not have .fx-playing once all elements stop')
        .toBeFalse();
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

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext('slot should not have .fx-playing after target removed')
        .toBeFalse();
    });

    it('ignores FxChangeEvent from elements encapsulated inside a slotted child shadow root', async () => {
      const childHost = document.createElement('div');
      childHost.slot = 'test';
      const childShadow = childHost.attachShadow({mode: 'open'});
      const innerFxEl = document.createElement('div');
      childShadow.appendChild(innerFxEl);
      host.appendChild(childHost);
      await env.waitForStability();

      updateFxElement(innerFxEl, {playing: true});

      expect(slot.classList.contains(FX_CLASSES.playing))
        .withContext(
          'slot should not receive FxChangeEvent from child shadow root',
        )
        .toBeFalse();
    });
  });
});
