/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  dispatchActivationClick,
  isActivationClick,
} from './form-label-activation.js';

describe('label events', () => {
  let instance: HTMLDivElement;

  beforeEach(() => {
    instance = document.createElement('div');
    instance
      .attachShadow({mode: 'open'})
      .append(document.createElement('slot'));
    // To have event.target set correctly, the EventTarget instance must be
    // attached to the DOM.
    document.body.appendChild(instance);
  });

  afterEach(() => {
    document.body.removeChild(instance);
  });

  describe('isActivationClick()', () => {
    it('returns true for click on listener', () => {
      const listener = jasmine.createSpy('listener', isActivationClick);
      listener.and.callThrough();
      instance.addEventListener('click', listener);
      instance.dispatchEvent(
        new MouseEvent('click', {bubbles: true, composed: true}),
      );
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.calls.mostRecent().returnValue).toBe(true);
    });

    it('returns false for click on element listener shadowRoot', () => {
      const listener = jasmine.createSpy('listener', isActivationClick);
      listener.and.callThrough();
      instance.addEventListener('click', listener);
      const innerEl = document.createElement('div');
      instance.shadowRoot!.append(innerEl);
      innerEl.dispatchEvent(
        new MouseEvent('click', {bubbles: true, composed: true}),
      );
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.calls.mostRecent().returnValue).toBe(false);
    });

    it('returns false for click on element listener child', () => {
      const listener = jasmine.createSpy('listener', isActivationClick);
      listener.and.callThrough();
      instance.addEventListener('click', listener);
      const slottedEl = document.createElement('div');
      instance.append(slottedEl);

      slottedEl.dispatchEvent(
        new MouseEvent('click', {bubbles: true, composed: true}),
      );
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.calls.mostRecent().returnValue).toBe(false);
    });
  });

  describe('dispatchActivationClick()', () => {
    it('dispatches an event', () => {
      const innerEl = document.createElement('div');
      instance.shadowRoot!.append(innerEl);
      const listener = jasmine.createSpy('listener');
      innerEl.addEventListener('click', listener);
      dispatchActivationClick(innerEl);
      expect(listener).toHaveBeenCalledTimes(1);
      dispatchActivationClick(innerEl);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('dispatches an event that cannot be heard outside dispatching scope', () => {
      const innerEl = document.createElement('div');
      instance.shadowRoot!.append(innerEl);
      const listener = jasmine.createSpy('listener');
      instance.addEventListener('click', listener);
      dispatchActivationClick(innerEl);
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});
