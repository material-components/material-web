/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {setupKeyboardClickHandler} from './keyboard_click_handler.js';

describe('setupKeyboardClickHandler', () => {
  const env = new Environment();

  async function setUpTest(template = html`<div tabindex="0">Target</div>`) {
    const root = env.render(template);
    await env.waitForStability();
    const element = root.firstElementChild as HTMLElement;
    return {root, element};
  }

  describe('Enter key activation', () => {
    it('triggers click on Enter keydown', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click on Enter if keydown default was prevented', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);
      element.addEventListener('keydown', (event) => {
        event.preventDefault();
      });

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Space key activation', () => {
    it('prevents default scroll behavior synchronously on Space keydown', async () => {
      const {element} = await setUpTest();
      setupKeyboardClickHandler(element);

      const keydownEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keydownEvent);
      await env.waitForStability();

      expect(keydownEvent.defaultPrevented).toBeTrue();
    });

    it('triggers click on Space keyup after Space keydown', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(clickSpy).not.toHaveBeenCalled();

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click on Space keyup without a prior Space keydown', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('does not trigger click on Space keyup if Space keydown was prevented in capture phase', async () => {
      const {root} = await setUpTest(html`
        <div id="parent">
          <div id="target" tabindex="0">Target</div>
        </div>
      `);
      const target = root.querySelector('#target') as HTMLElement;
      const parent = root.querySelector('#parent') as HTMLElement;
      const clickSpy = jasmine.createSpy('click');
      target.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(target);

      parent.addEventListener(
        'keydown',
        (event) => {
          event.preventDefault();
        },
        {capture: true},
      );

      target.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      target.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('does not trigger click on Space keyup if Space keyup default was prevented', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);
      element.addEventListener('keyup', (event) => {
        event.preventDefault();
      });

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('cancels pending Space activation if blur occurs between keydown and keyup', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      element.dispatchEvent(new FocusEvent('blur'));
      await env.waitForStability();

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('ignores unrelated keyup events between Space keydown and Space keyup', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Shift',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled handling', () => {
    it('does not trigger click when element has disabled property', async () => {
      const {element} = await setUpTest(html`<button disabled>Button</button>`);
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('does not trigger click when element has disabled attribute', async () => {
      const {element} = await setUpTest(
        html`<div disabled tabindex="0">Target</div>`,
      );
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('does not trigger click when element has aria-disabled="true" attribute', async () => {
      const {element} = await setUpTest(
        html`<div aria-disabled="true" tabindex="0">Target</div>`,
      );
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element);

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('respects custom isDisabled option', async () => {
      const {element} = await setUpTest();
      let disabled = false;
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element, {
        isDisabled: () => disabled,
      });

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(clickSpy).toHaveBeenCalledTimes(1);

      disabled = true;

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('blocks activation if disabled state changes between Space keydown and keyup', async () => {
      const {element} = await setUpTest();
      let disabled = false;
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      setupKeyboardClickHandler(element, {
        isDisabled: () => disabled,
      });

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      disabled = true;

      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Teardown cleanup', () => {
    it('removes event listeners when teardown function is called', async () => {
      const {element} = await setUpTest();
      const clickSpy = jasmine.createSpy('click');
      element.addEventListener('click', clickSpy);

      const cleanup = setupKeyboardClickHandler(element);
      cleanup();

      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      element.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });
});
