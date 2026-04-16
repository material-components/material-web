/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {afterDispatch, setupDispatchHooks} from './dispatch-hooks.js';

describe('dispatch hooks', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('setupDispatchHooks()', () => {
    it('does not add more than one setup listener for an event type', () => {
      spyOn(element, 'addEventListener').and.callThrough();
      setupDispatchHooks(element, 'foo');
      setupDispatchHooks(element, 'foo');

      expect(element.addEventListener)
        .withContext('element.addEventListener')
        .toHaveBeenCalledTimes(1);
    });

    it('can add setup listeners for multiple event types', () => {
      spyOn(element, 'addEventListener').and.callThrough();

      setupDispatchHooks(element, 'foo', 'bar', 'baz');
      expect(element.addEventListener)
        .withContext('element.addEventListener')
        .toHaveBeenCalledTimes(3);
    });

    it('triggers internal event listeners when a composed element is the source of the event', () => {
      const shadowRoot = element.attachShadow({mode: 'open'});
      const composedElement = document.createElement('button');
      shadowRoot.appendChild(composedElement);
      const innerClickListener = jasmine.createSpy('innerClickListener');
      composedElement.addEventListener('click', innerClickListener);

      setupDispatchHooks(element, 'click');
      composedElement.click();

      expect(innerClickListener)
        .withContext('innerClickListener')
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('afterDispatch()', () => {
    it('resolves synchronously after the event is finished dispatching', () => {
      setupDispatchHooks(element, 'click');

      const afterDispatchCallback = jasmine.createSpy('afterDispatchCallback');
      const clickListener = jasmine
        .createSpy('clickListener')
        .and.callFake((event: Event) => {
          afterDispatch(event, afterDispatchCallback);
        });

      element.addEventListener('click', clickListener);
      element.click();

      expect(clickListener)
        .withContext('clickListener')
        .toHaveBeenCalledTimes(1);
      expect(afterDispatchCallback)
        .withContext('afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });

    it('supports multiple afterDispatch listeners', () => {
      setupDispatchHooks(element, 'click');

      const firstAfterDispatchCallback = jasmine.createSpy(
        'firstAfterDispatchCallback',
      );
      element.addEventListener('click', (event) => {
        afterDispatch(event, firstAfterDispatchCallback);
      });

      const secondAfterDispatchCallback = jasmine.createSpy(
        'secondAfterDispatchCallback',
      );
      element.addEventListener('click', (event) => {
        afterDispatch(event, secondAfterDispatchCallback);
      });

      element.click();

      expect(firstAfterDispatchCallback)
        .withContext('afterDispatch() first callback')
        .toHaveBeenCalledTimes(1);
      expect(secondAfterDispatchCallback)
        .withContext('afterDispatch() second callback')
        .toHaveBeenCalledTimes(1);
    });

    it('resolves synchronously after the event is finished dispatching', () => {
      setupDispatchHooks(element, 'click');

      const afterDispatchCallback = jasmine.createSpy('afterDispatchCallback');
      const clickListener = jasmine
        .createSpy('clickListener')
        .and.callFake((event: Event) => {
          afterDispatch(event, afterDispatchCallback);
        });

      element.addEventListener('click', clickListener);
      element.click();

      expect(clickListener)
        .withContext('clickListener')
        .toHaveBeenCalledTimes(1);
      expect(afterDispatchCallback)
        .withContext('afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });

    it('can be used to synchronously detect if event was canceled', () => {
      setupDispatchHooks(element, 'click');

      // element listener
      let eventDefaultPreventedInAfterDispatch: boolean | null = null;
      element.addEventListener('click', (event) => {
        afterDispatch(event, () => {
          eventDefaultPreventedInAfterDispatch = event.defaultPrevented;
        });
      });

      // client listener
      element.addEventListener('click', (event) => {
        event.preventDefault();
      });

      element.click();

      expect(eventDefaultPreventedInAfterDispatch)
        .withContext('event.defaultPrevented() in afterDispatch() callback')
        .toBeTrue();
    });

    it('throws if setupDispatchHooks() was not called for the event type', () => {
      // Do not set up hooks
      let errorThrown: unknown;
      element.addEventListener('click', (event) => {
        try {
          afterDispatch(event, () => {});
        } catch (error) {
          errorThrown = error;
        }
      });

      element.click();
      expect(errorThrown)
        .withContext('error thrown calling afterDispatch()')
        .toBeInstanceOf(Error);

      expect((errorThrown as Error).message)
        .withContext('errorThrown.message')
        .toMatch('setupDispatchHooks');
    });

    it('does not fire multiple times if setupDispatchHooks() is called multiple times for the same element', () => {
      setupDispatchHooks(element, 'click');
      setupDispatchHooks(element, 'click');

      const afterDispatchCallback = jasmine.createSpy('afterDispatchCallback');
      const clickListener = jasmine
        .createSpy('clickListener')
        .and.callFake((event: Event) => {
          afterDispatch(event, afterDispatchCallback);
        });

      element.addEventListener('click', clickListener);
      element.click();

      expect(clickListener)
        .withContext('clickListener')
        .toHaveBeenCalledTimes(1);
      expect(afterDispatchCallback)
        .withContext('afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });

    it('is called after parent event listeners are called', () => {
      setupDispatchHooks(element, 'click');

      const callOrder: string[] = [];
      element.addEventListener('click', (event) => {
        callOrder.push('element@click');
        afterDispatch(event, () => {
          callOrder.push('afterDispatch');
        });
      });
      document.addEventListener('click', () => {
        callOrder.push('parent@click');
      });

      element.click();

      const expectedCallOrder = [
        'element@click',
        'parent@click',
        'afterDispatch',
      ];
      expect(callOrder)
        .withContext('call order of event listeners and afterDispatch()')
        .toEqual(expectedCallOrder);
    });

    it('is called after other event listeners for non-bubbling events', () => {
      setupDispatchHooks(element, 'change');

      const callOrder: string[] = [];
      element.addEventListener('change', (event) => {
        callOrder.push('element@change');
        afterDispatch(event, () => {
          callOrder.push('afterDispatch');
        });
      });
      element.addEventListener('change', () => {
        callOrder.push('element@change2');
      });

      element.dispatchEvent(new Event('change'));

      const expectedCallOrder = [
        'element@change',
        'element@change2',
        'afterDispatch',
      ];
      expect(callOrder)
        .withContext('call order of event listeners and afterDispatch()')
        .toEqual(expectedCallOrder);
    });

    it('is called after other event listeners for bubbling non-composed events in a shadow root', () => {
      const shadowRoot = element.attachShadow({mode: 'open'});
      const child = document.createElement('div');
      shadowRoot.appendChild(child);

      setupDispatchHooks(child, 'custom-event');

      const callOrder: string[] = [];
      child.addEventListener('custom-event', (event) => {
        callOrder.push('child@custom-event');
        afterDispatch(event, () => {
          callOrder.push('afterDispatch');
        });
      });
      shadowRoot.addEventListener('custom-event', () => {
        callOrder.push('shadowRoot@custom-event');
      });
      const elementListener = jasmine.createSpy('elementListener');
      element.addEventListener('custom-event', elementListener);

      child.dispatchEvent(
        new Event('custom-event', {bubbles: true, composed: false}),
      );

      const expectedCallOrder = [
        'child@custom-event',
        'shadowRoot@custom-event',
        'afterDispatch',
      ];

      expect(callOrder)
        .withContext('call order of event listeners and afterDispatch()')
        .toEqual(expectedCallOrder);
      expect(elementListener)
        .withContext(
          'listener on element with shadow root should not be called for `composed: false` event',
        )
        .not.toHaveBeenCalled();
    });

    it('is called when parent non-root event listeners stop propagation', () => {
      setupDispatchHooks(element, 'click');

      /*
      #document (root - should not be called)
        element (parent - stops propagation)
          child (child - calls afterDispatch)
      */
      const child = document.createElement('div');
      element.appendChild(child);
      const childAfterDispatchCallback = jasmine.createSpy(
        'childAfterDispatchCallback',
      );
      child.addEventListener('click', (event) => {
        afterDispatch(event, childAfterDispatchCallback);
      });
      element.addEventListener('click', (event) => {
        event.stopPropagation();
      });
      const rootClickListener = jasmine.createSpy('rootClickListener');
      document.addEventListener('click', rootClickListener);

      child.click();

      expect(rootClickListener)
        .withContext('root click listener')
        .not.toHaveBeenCalled();
      expect(childAfterDispatchCallback)
        .withContext('child afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });

    it('is called when parent non-root event listeners immediately stops propagation', () => {
      setupDispatchHooks(element, 'click');

      /*
        element (parent - stops propagation immediately)
          child (child - calls afterDispatch)
      */
      const child = document.createElement('div');
      element.appendChild(child);
      const childAfterDispatchCallback = jasmine.createSpy(
        'childAfterDispatchCallback',
      );
      child.addEventListener('click', (event) => {
        afterDispatch(event, childAfterDispatchCallback);
      });
      element.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
      });
      const additionalClickListener = jasmine.createSpy(
        'notCalledClickListener',
      );
      document.addEventListener('click', additionalClickListener);

      child.click();

      expect(additionalClickListener)
        .withContext('additional click listener after propagation is stopped')
        .not.toHaveBeenCalled();
      expect(childAfterDispatchCallback)
        .withContext('child afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });

    it('is DOES NOT support being called after the execution of the event listener that stopped propagation', () => {
      setupDispatchHooks(element, 'click');

      const child = document.createElement('div');
      element.appendChild(child);
      const callOrder: string[] = [];
      child.addEventListener('click', (event) => {
        callOrder.push('child@click');
        afterDispatch(event, () => {
          callOrder.push('afterDispatch');
        });
      });
      element.addEventListener('click', (event) => {
        callOrder.push('parent@click');
        event.stopPropagation();
        callOrder.push('parent done');
      });

      child.click();

      // Ideally, when the event stops propagating, afterDispatch() is called
      // directly after the execution of the function that stops propagation.
      // However, this would mean introducing asynchronicity, which is not
      // allowed. The compromise is to synchronously call afterDispatch() hooks
      // when propagation is stopped.
      const desiredCallOrder = [
        'child@click',
        'parent@click',
        'parent done',
        'afterDispatch',
      ];
      const expectedCallOrder = [
        'child@click',
        'parent@click',
        'afterDispatch',
        'parent done',
      ];
      expect(callOrder)
        .withContext('call order of event listeners and afterDispatch()')
        .toEqual(expectedCallOrder);
      expect(callOrder).not.toEqual(desiredCallOrder);
    });

    it('is not called multiple times if stopPropagation() is called multiple times', () => {
      setupDispatchHooks(element, 'click');

      const afterDispatchCallback = jasmine.createSpy('afterDispatchCallback');
      element.addEventListener('click', (event) => {
        afterDispatch(event, afterDispatchCallback);
      });
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        event.stopPropagation();
      });

      element.click();

      expect(afterDispatchCallback)
        .withContext('afterDispatch() callback')
        .toHaveBeenCalledTimes(1);
    });
  });
});
