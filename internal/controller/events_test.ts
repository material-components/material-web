/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  afterPropagation,
  dispatchActivationClick,
  isActivationClick,
  listenForPropagation,
  redispatchEvent,
} from './events.js';

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

  describe('afterPropagation()', () => {
    it('resolves synchronously after immediate propagation', () => {
      listenForPropagation(instance, 'type');
      const order: string[] = [];
      instance.addEventListener('type', async (event) => {
        order.push('first listener');
        afterPropagation(event, () => {
          order.push('first listener afterPropagation');
        });
      });

      instance.addEventListener('type', () => {
        order.push('second listener');
      });

      instance.dispatchEvent(new Event('type'));
      expect(order)
        .withContext('order')
        .toEqual([
          'first listener',
          'second listener',
          'first listener afterPropagation',
        ]);
    });

    it('resolves synchronously on stopImmediatePropagation()', () => {
      listenForPropagation(instance, 'type');
      const order: string[] = [];

      instance.addEventListener('type', async (event) => {
        order.push('first listener');
        afterPropagation(event, () => {
          order.push('first listener afterPropagation');
        });
      });

      instance.addEventListener('type', (event) => {
        order.push('second listener');
        event.stopImmediatePropagation();
      });

      // This listener should not fire when stopping immediate propagation.
      const unexpectedThirdListener = jasmine.createSpy(
        'unexpectedThirdListener',
      );
      instance.addEventListener('type', unexpectedThirdListener);

      instance.dispatchEvent(new Event('type'));
      expect(order)
        .withContext('order')
        .toEqual([
          'first listener',
          'second listener',
          'first listener afterPropagation',
        ]);

      expect(unexpectedThirdListener)
        .withContext(
          'third listener that should not be called after stopPropagation',
        )
        .not.toHaveBeenCalled();
    });

    it('ensures event.defaultPrevented can be updated during immediate propagation', () => {
      listenForPropagation(instance, 'type');

      let notifiedThatEventDefaultPrevented = false;
      instance.addEventListener('type', async (event) => {
        afterPropagation(event, () => {
          notifiedThatEventDefaultPrevented = event.defaultPrevented;
        });
      });

      instance.addEventListener('type', (event) => {
        event.preventDefault();
      });

      instance.dispatchEvent(new Event('type', {cancelable: true}));
      expect(notifiedThatEventDefaultPrevented)
        .withContext('notifiedThatEventDefaultPrevented')
        .toBeTrue();
    });

    it('resolves synchronously after bubbling propagation', () => {
      const parent = instance;
      const child = document.createElement('div');
      parent.append(child);

      listenForPropagation(child, 'type');
      const order: string[] = [];
      child.addEventListener('type', async (event) => {
        order.push('child first listener');
        afterPropagation(event, () => {
          order.push('child first listener afterPropagation');
        });
      });

      child.addEventListener('type', (event) => {
        order.push('child second listener');
        event.stopPropagation();
      });

      // This listener should not fire when stopping immediate propagation.
      const unexpectedParentListener = jasmine.createSpy(
        'unexpectedParentListener',
      );
      instance.addEventListener('type', unexpectedParentListener);

      child.dispatchEvent(new Event('type', {bubbles: true}));
      expect(order)
        .withContext('order')
        .toEqual([
          'child first listener',
          'child second listener',
          'child first listener afterPropagation',
        ]);

      expect(unexpectedParentListener)
        .withContext(
          'parent listener that should not be called after stopPropagation',
        )
        .not.toHaveBeenCalled();
    });

    it('resolves synchronously on stopPropagation()', () => {
      const parent = instance;
      const child = document.createElement('div');
      parent.append(child);

      listenForPropagation(child, 'type');
      const order: string[] = [];
      child.addEventListener('type', async (event) => {
        order.push('child');
        afterPropagation(event, () => {
          order.push('child afterPropagation');
        });
      });

      parent.addEventListener('type', () => {
        order.push('parent');
      });

      child.dispatchEvent(new Event('type', {bubbles: true}));
      expect(order)
        .withContext('order')
        .toEqual(['child', 'parent', 'child afterPropagation']);
    });

    it('ensures event.defaultPrevented can be updated during bubbling propagation', () => {
      const parent = instance;
      const child = document.createElement('div');
      parent.append(child);

      listenForPropagation(child, 'type');

      let notifiedThatEventDefaultPrevented = false;
      child.addEventListener('type', async (event) => {
        afterPropagation(event, () => {
          notifiedThatEventDefaultPrevented = event.defaultPrevented;
        });
      });

      parent.addEventListener('type', (event) => {
        event.preventDefault();
      });

      child.dispatchEvent(new Event('type', {bubbles: true, cancelable: true}));
      expect(notifiedThatEventDefaultPrevented)
        .withContext('notifiedThatEventDefaultPrevented')
        .toBeTrue();
    });

    it('throws an error if listenForPropagation() was not called', () => {
      // Do not set up with listenForPropagation()
      instance.addEventListener('type', async (event) => {
        expect(() => {
          afterPropagation(event, () => {});
        })
          .withContext(
            'calling afterPropagation() without listenForPropagation()',
          )
          .toThrow();
      });

      instance.dispatchEvent(new Event('type'));
    });

    it('supports setting up multiple types with listenForPropagation()', () => {
      listenForPropagation(instance, 'type-one', 'type-two');
      const typeOneAfterPropagationCallback = jasmine.createSpy(
        'typeOneAfterPropagationCallback',
      );
      const typeTwoAfterPropagationCallback = jasmine.createSpy(
        'typeTwoAfterPropagationCallback',
      );
      instance.addEventListener('type-one', async (event) => {
        afterPropagation(event, typeOneAfterPropagationCallback);
      });
      instance.addEventListener('type-two', async (event) => {
        afterPropagation(event, typeTwoAfterPropagationCallback);
      });

      instance.dispatchEvent(new Event('type-one'));
      instance.dispatchEvent(new Event('type-two'));
      expect(typeOneAfterPropagationCallback)
        .withContext('afterPropagation() with type-one event')
        .toHaveBeenCalled();
      expect(typeTwoAfterPropagationCallback)
        .withContext('afterPropagation() with type-two event')
        .toHaveBeenCalled();
    });
  });
});
