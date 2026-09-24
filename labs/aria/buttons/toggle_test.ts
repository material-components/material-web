/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Environment} from '../../../testing/environment.js';
import {hasState} from '../../behaviors/custom-state-set.js';
import {internals} from '../../behaviors/element-internals.js';
import {AriaToggleElement, isToggleDisabled, isTogglePressed} from './toggle.js';

declare global {
  interface HTMLElementTagNameMap {
    'test-aria-toggle': TestAriaToggle;
    'test-custom-toggle-subclass': TestCustomToggleSubclass;
  }
}

@customElement('test-aria-toggle')
class TestAriaToggle extends AriaToggleElement {}

@customElement('test-custom-toggle-subclass')
class TestCustomToggleSubclass extends AriaToggleElement {
  get active(): boolean {
    return this[isTogglePressed];
  }
  set active(value: boolean) {
    this[isTogglePressed] = value;
  }

  get inactive(): boolean {
    return this[isToggleDisabled];
  }
  set inactive(value: boolean) {
    this[isToggleDisabled] = value;
  }
}

function expectEnabled(toggle: AriaToggleElement) {
  expect(toggle[isToggleDisabled]).toBeFalse();
  expect(toggle[internals].ariaDisabled).toBe('false');
  expect(toggle.matches(':state(enabled)')).toBeTrue();
  expect(toggle.matches(':state(disabled)')).toBeFalse();
  expect(toggle[hasState]('enabled')).toBeTrue();
  expect(toggle[hasState]('disabled')).toBeFalse();
}

function expectDisabled(toggle: AriaToggleElement) {
  expect(toggle[isToggleDisabled]).toBeTrue();
  expect(toggle[internals].ariaDisabled).toBe('true');
  expect(toggle.matches(':state(enabled)')).toBeFalse();
  expect(toggle.matches(':state(disabled)')).toBeTrue();
  expect(toggle[hasState]('enabled')).toBeFalse();
  expect(toggle[hasState]('disabled')).toBeTrue();
}

function expectUnpressed(toggle: AriaToggleElement) {
  expect(toggle[isTogglePressed]).toBeFalse();
  expect(toggle[internals].ariaPressed).toBe('false');
  expect(toggle.matches(':state(selected)')).toBeFalse();
  expect(toggle[hasState]('selected')).toBeFalse();
}

function expectPressed(toggle: AriaToggleElement) {
  expect(toggle[isTogglePressed]).toBeTrue();
  expect(toggle[internals].ariaPressed).toBe('true');
  expect(toggle.matches(':state(selected)')).toBeTrue();
  expect(toggle[hasState]('selected')).toBeTrue();
}

describe('AriaToggleElement', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`<test-aria-toggle>Toggle</test-aria-toggle>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const toggle = root.querySelector('test-aria-toggle') as TestAriaToggle;
    return {root, toggle};
  }

  describe('ARIA roles and defaults', () => {
    it('sets element role to "button"', async () => {
      const {toggle} = await setUpTest();
      expect(toggle[internals].role).toBe('button');
    });

    it('initializes with default unpressed state', async () => {
      const {toggle} = await setUpTest();
      expectUnpressed(toggle);
    });

    it('initializes with default enabled state and focusable tabIndex', async () => {
      const {toggle} = await setUpTest();
      expectEnabled(toggle);
      expect(toggle.tabIndex).toBe(0);
    });

    it('renders only a slot in shadow root', async () => {
      const {toggle} = await setUpTest();
      const slot = toggle.shadowRoot?.querySelector('slot');
      expect(slot).not.toBeNull();
      expect(toggle.shadowRoot?.childElementCount).toBe(1);
    });
  });

  describe('[isTogglePressed] symbol API', () => {
    it('updates ariaPressed and custom states when [isTogglePressed] is toggled', async () => {
      const {toggle} = await setUpTest();

      toggle[isTogglePressed] = true;
      await env.waitForStability();
      expectPressed(toggle);

      toggle[isTogglePressed] = false;
      await env.waitForStability();
      expectUnpressed(toggle);
    });

    it('coerces truthy and falsy non-boolean values for [isTogglePressed]', async () => {
      const {toggle} = await setUpTest();
      (toggle as unknown as Record<symbol, unknown>)[isTogglePressed] = 1;
      await env.waitForStability();
      expect(toggle[isTogglePressed]).toBeTrue();
      expectPressed(toggle);

      (toggle as unknown as Record<symbol, unknown>)[isTogglePressed] = 'true';
      await env.waitForStability();
      expect(toggle[isTogglePressed]).toBeTrue();
      expectPressed(toggle);

      (toggle as unknown as Record<symbol, unknown>)[isTogglePressed] = 0;
      await env.waitForStability();
      expect(toggle[isTogglePressed]).toBeFalse();
      expectUnpressed(toggle);

      (toggle as unknown as Record<symbol, unknown>)[isTogglePressed] = '';
      await env.waitForStability();
      expect(toggle[isTogglePressed]).toBeFalse();
      expectUnpressed(toggle);

      (toggle as unknown as Record<symbol, unknown>)[isTogglePressed] = null;
      await env.waitForStability();
      expect(toggle[isTogglePressed]).toBeFalse();
      expectUnpressed(toggle);
    });

    it('does not fire input or change events on programmatic [isTogglePressed] changes', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      const changeSpy = jasmine.createSpy('change');
      toggle.addEventListener('input', inputSpy);
      toggle.addEventListener('change', changeSpy);

      toggle[isTogglePressed] = true;
      await env.waitForStability();
      toggle[isTogglePressed] = false;
      await env.waitForStability();

      expect(inputSpy).not.toHaveBeenCalled();
      expect(changeSpy).not.toHaveBeenCalled();
    });
  });

  describe('[isToggleDisabled] symbol API', () => {
    it('updates ariaDisabled, custom states, and tabIndex when [isToggleDisabled] is toggled', async () => {
      const {toggle} = await setUpTest();

      toggle[isToggleDisabled] = true;
      await env.waitForStability();
      expectDisabled(toggle);
      expect(toggle.tabIndex).toBe(-1);

      toggle[isToggleDisabled] = false;
      await env.waitForStability();
      expectEnabled(toggle);
      expect(toggle.tabIndex).toBe(0);
    });

    it('coerces truthy and falsy non-boolean values for [isToggleDisabled]', async () => {
      const {toggle} = await setUpTest();
      (toggle as unknown as Record<symbol, unknown>)[isToggleDisabled] =
        'truthy';
      await env.waitForStability();
      expect(toggle[isToggleDisabled]).toBeTrue();
      expectDisabled(toggle);
      expect(toggle.tabIndex).toBe(-1);

      (toggle as unknown as Record<symbol, unknown>)[isToggleDisabled] = '';
      await env.waitForStability();
      expect(toggle[isToggleDisabled]).toBeFalse();
      expectEnabled(toggle);
      expect(toggle.tabIndex).toBe(0);
    });

    it('preserves explicitly user-set tabindex when disabled per mixinFocusable contract', async () => {
      const {toggle} = await setUpTest(
        html`<test-aria-toggle tabindex="0">Custom TabIndex</test-aria-toggle>`,
      );
      expect(toggle.tabIndex).toBe(0);

      toggle[isToggleDisabled] = true;
      await env.waitForStability();
      expect(toggle.tabIndex).toBe(0);
    });

    it('does not activate or fire events on .click() when [isToggleDisabled] is true', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      const changeSpy = jasmine.createSpy('change');
      toggle.addEventListener('input', inputSpy);
      toggle.addEventListener('change', changeSpy);

      toggle[isToggleDisabled] = true;
      await env.waitForStability();

      toggle.click();
      await env.waitForStability();

      expect(toggle[isTogglePressed]).toBeFalse();
      expect(inputSpy).not.toHaveBeenCalled();
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('does not bubble click events to ancestors and stops immediate propagation when disabled', async () => {
      const {root, toggle} = await setUpTest(html`
        <div id="ancestor">
          <test-aria-toggle>Disabled Toggle</test-aria-toggle>
        </div>
      `);
      toggle[isToggleDisabled] = true;
      await env.waitForStability();

      const ancestor = root.querySelector('#ancestor')!;
      const ancestorClickSpy = jasmine.createSpy('ancestorClick');
      ancestor.addEventListener('click', ancestorClickSpy);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      toggle.dispatchEvent(clickEvent);
      await env.waitForStability();

      expect(ancestorClickSpy).not.toHaveBeenCalled();
      expect(clickEvent.defaultPrevented).toBeTrue();
    });
  });

  describe('Click activation and event lifecycle', () => {
    it('toggles [isTogglePressed] synchronously during click propagation and fires input then change events', async () => {
      const {toggle} = await setUpTest();
      const eventOrder: string[] = [];
      let pressedDuringClick: boolean | undefined;
      let pressedDuringInput: boolean | undefined;
      let pressedDuringChange: boolean | undefined;

      toggle.addEventListener('click', (event) => {
        pressedDuringClick = (event.target as AriaToggleElement)[
          isTogglePressed
        ];
        eventOrder.push('click');
      });
      toggle.addEventListener('input', (event) => {
        expect(event.bubbles).toBeTrue();
        expect(event.composed).toBeTrue();
        pressedDuringInput = toggle[isTogglePressed];
        eventOrder.push('input');
      });
      toggle.addEventListener('change', (event) => {
        expect(event.bubbles).toBeTrue();
        expect(event.composed).toBeFalse();
        pressedDuringChange = toggle[isTogglePressed];
        eventOrder.push('change');
      });

      toggle.click();
      await env.waitForStability();

      expect(pressedDuringClick)
        .withContext('pressed during click (unpressed -> pressed)')
        .toBeTrue();
      expect(pressedDuringInput)
        .withContext('pressed during input (unpressed -> pressed)')
        .toBeTrue();
      expect(pressedDuringChange)
        .withContext('pressed during change (unpressed -> pressed)')
        .toBeTrue();
      expectPressed(toggle);
      expect(eventOrder).toEqual(['click', 'input', 'change']);

      toggle.click();
      await env.waitForStability();

      expect(pressedDuringClick)
        .withContext('pressed during click (pressed -> unpressed)')
        .toBeFalse();
      expect(pressedDuringInput)
        .withContext('pressed during input (pressed -> unpressed)')
        .toBeFalse();
      expect(pressedDuringChange)
        .withContext('pressed during change (pressed -> unpressed)')
        .toBeFalse();
      expectUnpressed(toggle);
      expect(eventOrder).toEqual([
        'click',
        'input',
        'change',
        'click',
        'input',
        'change',
      ]);
    });

    it('reverts [isTogglePressed] and states and does not fire input/change when click default is prevented', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      const changeSpy = jasmine.createSpy('change');
      toggle.addEventListener('input', inputSpy);
      toggle.addEventListener('change', changeSpy);

      let pressedDuringClick: boolean | undefined;
      toggle.addEventListener('click', (event) => {
        pressedDuringClick = (event.target as AriaToggleElement)[
          isTogglePressed
        ];
        event.preventDefault();
      });

      toggle.click();
      await env.waitForStability();

      expect(pressedDuringClick)
        .withContext('pressed reflects toggled state during click propagation')
        .toBeTrue();
      expect(toggle[isTogglePressed])
        .withContext('pressed reverts to false after preventDefault()')
        .toBeFalse();
      expectUnpressed(toggle);
      expect(inputSpy).not.toHaveBeenCalled();
      expect(changeSpy).not.toHaveBeenCalled();

      toggle[isTogglePressed] = true;
      await env.waitForStability();
      expectPressed(toggle);

      let pressedDuringSecondClick: boolean | undefined;
      toggle.addEventListener(
        'click',
        (event) => {
          pressedDuringSecondClick = (event.target as AriaToggleElement)[
            isTogglePressed
          ];
          event.preventDefault();
        },
        {once: true},
      );

      toggle.click();
      await env.waitForStability();

      expect(pressedDuringSecondClick)
        .withContext(
          'pressed reflects toggled state during click propagation when initially true',
        )
        .toBeFalse();
      expect(toggle[isTogglePressed])
        .withContext('pressed reverts to true after preventDefault()')
        .toBeTrue();
      expectPressed(toggle);
      expect(inputSpy).not.toHaveBeenCalled();
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('reverts [isTogglePressed] when an ancestor prevents default on click', async () => {
      const {root, toggle} = await setUpTest(html`
        <div id="ancestor">
          <test-aria-toggle>Toggle</test-aria-toggle>
        </div>
      `);
      const ancestor = root.querySelector('#ancestor')!;
      let pressedDuringAncestorClick: boolean | undefined;
      ancestor.addEventListener('click', (event) => {
        pressedDuringAncestorClick = (event.target as AriaToggleElement)[
          isTogglePressed
        ];
        event.preventDefault();
      });

      toggle.click();
      await env.waitForStability();

      expect(pressedDuringAncestorClick)
        .withContext('pressed during ancestor click propagation')
        .toBeTrue();
      expect(toggle[isTogglePressed])
        .withContext('pressed reverts to false after ancestor preventDefault()')
        .toBeFalse();
      expectUnpressed(toggle);
    });
  });

  describe('Keyboard activation via setupKeyboardClickHandler', () => {
    it('activates toggle on Enter keydown', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      const changeSpy = jasmine.createSpy('change');
      toggle.addEventListener('input', inputSpy);
      toggle.addEventListener('change', changeSpy);

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expectPressed(toggle);
      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('does not activate on Enter keydown when disabled', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      toggle.addEventListener('input', inputSpy);
      toggle[isToggleDisabled] = true;
      await env.waitForStability();

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expectDisabled(toggle);
      expect(toggle[isTogglePressed]).toBeFalse();
      expect(inputSpy).not.toHaveBeenCalled();
    });

    it('reverts [isTogglePressed] state when click default is prevented during Enter activation', async () => {
      const {toggle} = await setUpTest();
      let pressedDuringClick: boolean | undefined;
      toggle.addEventListener('click', (event) => {
        pressedDuringClick = (event.target as AriaToggleElement)[
          isTogglePressed
        ];
        event.preventDefault();
      });

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(pressedDuringClick)
        .withContext('pressed during click propagation on Enter')
        .toBeTrue();
      expect(toggle[isTogglePressed])
        .withContext(
          'pressed reverts to false after click preventDefault() on Enter',
        )
        .toBeFalse();
      expectUnpressed(toggle);
    });

    it('activates toggle on Space keyup after keydown', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      const changeSpy = jasmine.createSpy('change');
      toggle.addEventListener('input', inputSpy);
      toggle.addEventListener('change', changeSpy);

      const keydownEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      toggle.dispatchEvent(keydownEvent);
      await env.waitForStability();

      expect(keydownEvent.defaultPrevented).toBeTrue();
      expectUnpressed(toggle);
      expect(inputSpy).not.toHaveBeenCalled();

      const keyupEvent = new KeyboardEvent('keyup', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      toggle.dispatchEvent(keyupEvent);
      await env.waitForStability();

      expectPressed(toggle);
      expect(inputSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('does not activate on Space keyup when disabled', async () => {
      const {toggle} = await setUpTest();
      const inputSpy = jasmine.createSpy('input');
      toggle.addEventListener('input', inputSpy);
      toggle[isToggleDisabled] = true;
      await env.waitForStability();

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      toggle.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expectDisabled(toggle);
      expect(toggle[isTogglePressed]).toBeFalse();
      expect(inputSpy).not.toHaveBeenCalled();
    });

    it('reverts [isTogglePressed] state when click default is prevented during Space activation', async () => {
      const {toggle} = await setUpTest();
      let pressedDuringClick: boolean | undefined;
      toggle.addEventListener('click', (event) => {
        pressedDuringClick = (event.target as AriaToggleElement)[
          isTogglePressed
        ];
        event.preventDefault();
      });

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      toggle.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();

      expect(pressedDuringClick)
        .withContext('pressed during click propagation on Space keyup')
        .toBeTrue();
      expect(toggle[isTogglePressed])
        .withContext(
          'pressed reverts to false after click preventDefault() on Space',
        )
        .toBeFalse();
      expectUnpressed(toggle);
    });
  });

  describe('Subclassing and custom API integration', () => {
    async function setUpCustomTest() {
      const root = env.render(
        html`<test-custom-toggle-subclass
          >Custom Toggle</test-custom-toggle-subclass
        >`,
      );
      await env.waitForStability();
      const customToggle = root.querySelector(
        'test-custom-toggle-subclass',
      ) as TestCustomToggleSubclass;
      return {root, customToggle};
    }

    it('manages custom active and inactive properties mapped to symbols', async () => {
      const {customToggle} = await setUpCustomTest();
      expect(customToggle.active).toBeFalse();
      expect(customToggle.inactive).toBeFalse();
      expectUnpressed(customToggle);
      expectEnabled(customToggle);

      customToggle.active = true;
      await env.waitForStability();
      expect(customToggle.active).toBeTrue();
      expect(customToggle[isTogglePressed]).toBeTrue();
      expectPressed(customToggle);

      customToggle.active = false;
      await env.waitForStability();
      expect(customToggle.active).toBeFalse();
      expect(customToggle[isTogglePressed]).toBeFalse();
      expectUnpressed(customToggle);

      customToggle.inactive = true;
      await env.waitForStability();
      expect(customToggle.inactive).toBeTrue();
      expect(customToggle[isToggleDisabled]).toBeTrue();
      expectDisabled(customToggle);
      expect(customToggle.tabIndex).toBe(-1);

      customToggle.inactive = false;
      await env.waitForStability();
      expect(customToggle.inactive).toBeFalse();
      expect(customToggle[isToggleDisabled]).toBeFalse();
      expectEnabled(customToggle);
      expect(customToggle.tabIndex).toBe(0);
    });

    it('activates custom toggle via mouse click and keyboard activation', async () => {
      const {customToggle} = await setUpCustomTest();

      customToggle.click();
      await env.waitForStability();
      expect(customToggle.active).toBeTrue();
      expectPressed(customToggle);

      customToggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(customToggle.active).toBeFalse();
      expectUnpressed(customToggle);
    });

    it('blocks clicks and keyboard activation when custom inactive property is true', async () => {
      const {customToggle} = await setUpCustomTest();
      customToggle.inactive = true;
      await env.waitForStability();

      customToggle.click();
      await env.waitForStability();
      expect(customToggle.active).toBeFalse();
      expectUnpressed(customToggle);

      customToggle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(customToggle.active).toBeFalse();
      expectUnpressed(customToggle);
    });
  });
});
