/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {redispatchEvent} from './redispatch-event.js';

describe('events', () => {
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

  describe('redispatchEvent()', () => {
    it('should re-dispatch events', () => {
      const event = new Event('foo', {composed: false, bubbles: true});
      const fooHandler = jasmine.createSpy('fooHandler');
      instance.addEventListener('foo', fooHandler);
      redispatchEvent(instance, event);

      expect(fooHandler).toHaveBeenCalled();
      const redispatchedEvent = fooHandler.calls.first().args[0] as Event;
      expect(redispatchedEvent)
        .withContext('redispatched event should be a new instance')
        .not.toBe(event);
      expect(redispatchedEvent.target)
        .withContext(
          'target should be the instance that redispatched the event',
        )
        .toBe(instance);
      expect(redispatchedEvent.type)
        .withContext('should be the same event type')
        .toBe(event.type);
      expect(redispatchedEvent.composed)
        .withContext('should not be composed')
        .toBeFalse();
      expect(redispatchedEvent.bubbles)
        .withContext('should keep other flags set to true')
        .toBeTrue();
    });

    it('should not dispatch multiple events if bubbling and composed', () => {
      const event = new Event('foo', {composed: true, bubbles: true});
      const fooHandler = jasmine.createSpy('fooHandler');
      instance.addEventListener('foo', fooHandler);
      redispatchEvent(instance, event);

      expect(fooHandler).toHaveBeenCalledTimes(1);
    });

    it('should not dispatch multiple events if bubbling in light DOM', () => {
      const lightDomInstance = document.createElement('div');
      try {
        document.body.appendChild(lightDomInstance);
        const event = new Event('foo', {composed: true, bubbles: true});
        const fooHandler = jasmine.createSpy('fooHandler');
        instance.addEventListener('foo', fooHandler);
        redispatchEvent(instance, event);

        expect(fooHandler).toHaveBeenCalledTimes(1);
      } finally {
        document.body.removeChild(lightDomInstance);
      }
    });

    it('should preventDefault() on the original event if canceled', () => {
      const event = new Event('foo', {cancelable: true});
      const fooHandler = jasmine
        .createSpy('fooHandler')
        .and.callFake((event: Event) => {
          event.preventDefault();
        });
      instance.addEventListener('foo', fooHandler);
      const result = redispatchEvent(instance, event);
      expect(result)
        .withContext('should return false since event was canceled')
        .toBeFalse();
      expect(fooHandler).toHaveBeenCalled();
      const redispatchedEvent = fooHandler.calls.first().args[0] as Event;
      expect(redispatchedEvent.defaultPrevented)
        .withContext('redispatched event should be canceled by handler')
        .toBeTrue();
      expect(event.defaultPrevented)
        .withContext('original event should be canceled')
        .toBeTrue();
    });

    it('should preserve event instance types', () => {
      const event = new CustomEvent('foo', {detail: 'bar'});
      const fooHandler = jasmine.createSpy('fooHandler');
      instance.addEventListener('foo', fooHandler);
      redispatchEvent(instance, event);

      expect(fooHandler).toHaveBeenCalled();
      const redispatchedEvent = fooHandler.calls.first().args[0] as CustomEvent;
      expect(redispatchedEvent)
        .withContext('should create the same instance type')
        .toBeInstanceOf(CustomEvent);
      expect(redispatchedEvent.detail)
        .withContext('should copy event type-specific properties')
        .toBe('bar');
    });
  });
});
