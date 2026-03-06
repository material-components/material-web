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
  });
});
