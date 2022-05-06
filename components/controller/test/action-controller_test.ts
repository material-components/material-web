/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';
import {ActionController, ActionControllerHost, BeginPressConfig, EndPressConfig, TOUCH_DELAY_MS, WAIT_FOR_MOUSE_CLICK_MS} from '../action-controller.js';

declare global {
  interface HTMLElementTagNameMap {
    'my-action-element': MyActionElement;
  }
}

interface ActionControllerInternals {
  disabled: boolean;
  ignoreClicksWithModifiers: boolean;
  phase: string;
  pressed: boolean;
  checkBoundsAfterContextMenu: boolean;
  lastPositionEvent: PointerEvent|null;
}

@customElement('my-action-element')
class MyActionElement extends LitElement implements ActionControllerHost {
  @property({type: Boolean}) disabled = false;

  @property({type: Boolean}) ignoreClicksWithModifiers = false;

  actionController = new ActionController(this);

  lastBegin?: BeginPressConfig;
  lastEnd?: EndPressConfig;

  beginPress(info: BeginPressConfig) {
    this.lastBegin = info;
  }

  endPress(info: EndPressConfig) {
    this.lastEnd = info;
  }

  override render() {
    return html`<div
      tabindex=-1
      @pointerdown=${this.handlePointerDown}
      @pointerup=${this.handlePointerUp}
      @pointercancel=${this.handlePointerCancel}
      @pointerleave=${this.handlePointerLeave}
      @click=${this.handleClick}
      @contextmenu=${this.handleContextMenu}
    ></div>`;
  }

  handlePointerDown(e: PointerEvent) {
    this.actionController.pointerDown(e);
  }

  handlePointerUp(e: PointerEvent) {
    this.actionController.pointerUp(e);
  }

  handlePointerCancel(e: PointerEvent) {
    this.actionController.pointerCancel(e);
  }

  handlePointerLeave(e: PointerEvent) {
    this.actionController.pointerLeave(e);
  }

  handleClick(e: MouseEvent) {
    this.actionController.click(e);
  }

  handleContextMenu() {
    this.actionController.contextMenu();
  }
}

class ActionControllerHarness extends Harness<MyActionElement> {
  protected extraMouseProps?: MouseEventInit;

  resetExtraMouseProps() {
    this.extraMouseProps = undefined;
  }

  setExtraMouseProps(extra: MouseEventInit) {
    this.extraMouseProps = extra;
  }

  /**
   * Simulates clicking an element with the keyboard.
   */
  async clickWithKeyboard(
      modifiers?:
          Pick<KeyboardEventInit, 'altKey'|'ctrlKey'|'metaKey'|'shiftKey'>) {
    const el = await this.getInteractiveElement();
    this.simulateKeypress(el, 'Space', modifiers);
    this.setExtraMouseProps({
      ...modifiers,
      clientX: 0,
      clientY: 0,
      screenX: 0,
      screenY: 0,
    });
    el.dispatchEvent(new MouseEvent('click', this.createMouseEventInit(el)));
  }

  async rightPress() {
    const element = await this.getInteractiveElement();
    this.setExtraMouseProps({buttons: 2});
    this.simulateMousePress(element);
    this.simulatePointerFocus(element);
  }

  async clickWithModifierKeys(
      modifiers:
          Pick<MouseEventInit, 'altKey'|'ctrlKey'|'metaKey'|'shiftKey'>) {
    this.setExtraMouseProps(modifiers);
    await this.click();
  }

  async contextMenu() {
    const el = await this.getInteractiveElement();
    el.dispatchEvent(
        new MouseEvent('contextmenu', this.createMouseEventInit(el)));
  }

  async touchPress() {
    this.simulateTouchPress(await this.getInteractiveElement());
  }

  async touchRelease(delayClick = 0) {
    this.simulateTouchRelease(await this.getInteractiveElement(), delayClick);
  }

  async touchCancel() {
    this.simulateTouchCancel(await this.getInteractiveElement());
  }

  async nonPrimaryTap() {
    const el = await this.getInteractiveElement();
    const pointerInit: PointerEventInit = {
      ...this.createMouseEventInit(el),
      pointerType: 'touch',
    };

    el.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    el.dispatchEvent(new PointerEvent('pointerup', pointerInit));
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('div') as HTMLElement;
  }

  protected override createMouseEventInit(element: HTMLElement):
      MouseEventInit {
    return {
      ...super.createMouseEventInit(element),
      buttons: 1,
      ...this.extraMouseProps,
    };
  }

  /**
   * override mouse release to send a click event using the extra mouse init
   * props
   */
  protected override simulateMouseRelease(element: HTMLElement) {
    this.removePseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseInit));
    element.dispatchEvent(new MouseEvent('click', mouseInit));
  }

  /**
   * override touch release to send a click event using the extra mouse init
   * props
   */
  protected override simulateTouchRelease(
      element: HTMLElement, delayClick = 0) {
    this.removePseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
    };

    const touch = this.createTouch(element);
    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    element.dispatchEvent(
        new TouchEvent('touchend', {changedTouches: [touch]}));
    element.dispatchEvent(new MouseEvent('mousedown', mouseInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseInit));
    const fireClick = () => {
      element.dispatchEvent(new MouseEvent('click', mouseInit));
    };
    if (delayClick > 0) {
      setTimeout(fireClick, delayClick);
    } else {
      fireClick();
    }
  }

  protected simulateTouchCancel(element: HTMLElement) {
    this.removePseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
    };
    const touch = this.createTouch(element);
    element.dispatchEvent(new PointerEvent('pointercancel', pointerInit));
    element.dispatchEvent(
        new TouchEvent('touchcancel', {changedTouches: [touch]}));
  }
}

describe('ActionController', () => {
  const env = new Environment();
  let el!: MyActionElement;
  let harness!: ActionControllerHarness;

  afterEach(() => {
    harness?.resetExtraMouseProps();
  });

  describe('mouse', () => {
    beforeEach(async () => {
      const root = env.render(html`<my-action-element></my-action-element>`);
      el = root.querySelector('my-action-element')!;
      harness = new ActionControllerHarness(el);
      await env.waitForStability();
    });

    it('calls beginPress on down', async () => {
      await harness.press();
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
    });

    it('calls endPress on up', async () => {
      await harness.click();
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      expect(el.lastEnd).toBeDefined();
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('ignores presses from other mouse buttons', async () => {
      await harness.rightPress();
      expect(el.lastBegin).not.toBeDefined();
      expect(el.lastEnd).not.toBeDefined();
    });

    it('goes through the expected phases during a press', async () => {
      await harness.press();
      const ac = el.actionController as unknown as ActionControllerInternals;
      expect(ac.phase).toEqual('WAITING_FOR_MOUSE_CLICK');
      await harness.release();
      expect(ac.phase).toEqual('INACTIVE');
    });

    it('cancels press if cursor leaves element during press', async () => {
      await harness.press();
      await harness.hoverLeave();
      expect(el.lastEnd).toEqual({cancelled: true});
    });

    it('allows clicks with modifier keys by default', async () => {
      await harness.clickWithModifierKeys({altKey: true});
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('ignores clicks with modifier keys when `ignoreClicksWithModifiers` is set',
       async () => {
         el.ignoreClicksWithModifiers = true;
         await el.updateComplete;
         await harness.clickWithModifierKeys({altKey: true});
         expect(el.lastBegin).not.toBeDefined();
         expect(el.lastEnd).not.toBeDefined();
       });

    it('cancels when removed from dom', async () => {
      await harness.press();
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      el.remove();
      expect(el.lastEnd).toEqual({cancelled: true});
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      const root = env.render(html`<my-action-element></my-action-element>`);
      el = root.querySelector('my-action-element')!;
      harness = new ActionControllerHarness(el);
      await env.waitForStability();
    });

    it('responds to keyboard clicks', async () => {
      await harness.clickWithKeyboard();
      expect(el.lastBegin).toEqual({positionEvent: null});
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('responds to keyboard clicks with modifiers by default', async () => {
      await harness.clickWithKeyboard({altKey: true});
      expect(el.lastBegin).toEqual({positionEvent: null});
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('ignores keyboard clicks with modifiers when `ignoreClicksWithModifiers` is set',
       async () => {
         el.ignoreClicksWithModifiers = true;
         await el.updateComplete;
         await harness.clickWithKeyboard({altKey: true});
         expect(el.lastBegin).not.toBeDefined();
         expect(el.lastEnd).not.toBeDefined();
       });
  });

  describe('touch', () => {
    beforeEach(async () => {
      const root = env.render(html`<my-action-element></my-action-element>`);
      el = root.querySelector('my-action-element')!;
      harness = new ActionControllerHarness(el);
      await env.waitForStability();
    });

    it('calls beginPress on down after hysteresis', async () => {
      await harness.touchPress();
      await new Promise((resolve) => {
        setTimeout(resolve, TOUCH_DELAY_MS);
      });
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
    });

    it('calls endPress on up', async () => {
      await harness.tap();
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      expect(el.lastEnd).toBeDefined();
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('goes through the expected phases during a long press', async () => {
      const ac = el.actionController as unknown as ActionControllerInternals;
      expect(ac.phase).toEqual('INACTIVE');
      await harness.touchPress();
      expect(ac.phase).toEqual('TOUCH_DELAY');
      await new Promise((resolve) => {
        setTimeout(resolve, TOUCH_DELAY_MS);
      });
      expect(ac.phase).toEqual('HOLDING');
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      await harness.touchRelease(50);
      expect(ac.phase).toEqual('WAITING_FOR_MOUSE_CLICK');
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      expect(ac.phase).toEqual('INACTIVE');
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('goes through the expected phases during a short press', async () => {
      const ac = el.actionController as unknown as ActionControllerInternals;
      expect(ac.phase).toEqual('INACTIVE');
      await harness.touchPress();
      expect(ac.phase).toEqual('TOUCH_DELAY');
      expect(el.lastBegin).not.toBeDefined();
      await harness.touchRelease(50);
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      expect(ac.phase).toEqual('WAITING_FOR_MOUSE_CLICK');
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      expect(ac.phase).toEqual('INACTIVE');
      expect(el.lastEnd).toEqual({cancelled: false});
    });

    it('cancels press if a held press is very long', async () => {
      await harness.touchPress();
      await harness.touchRelease(1000);
      expect(el.lastBegin).toBeDefined();
      expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
      await new Promise((resolve) => {
        setTimeout(resolve, WAIT_FOR_MOUSE_CLICK_MS);
      });
      expect(el.lastEnd).toEqual({cancelled: true});
    });

    it('ignores non-primary touch gestures', async () => {
      await harness.nonPrimaryTap();
      expect(el.lastBegin).not.toBeDefined();
      expect(el.lastEnd).not.toBeDefined();
    });

    describe('contextmenu', () => {
      it('ignores the interaction if the context menu opens during a short press',
         async () => {
           await harness.touchPress();
           await harness.contextMenu();
           expect(el.lastBegin).not.toBeDefined();
           expect(el.lastEnd).not.toBeDefined();
         });

      it('cancels press if the context menu opens during a longer press',
         async () => {
           await harness.touchPress();
           await new Promise((resolve) => {
             setTimeout(resolve, TOUCH_DELAY_MS);
           });
           await harness.contextMenu();
           expect(el.lastBegin).toBeDefined();
           expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
           expect(el.lastEnd).toEqual({cancelled: true});
         });

      it('ignores out of bounds downs after the contextmenu opens',
         async () => {
           await harness.touchPress();
           await harness.contextMenu();
           // set a _way out of bounds_ position, which would indicate pressing
           // on a different element
           harness.setExtraMouseProps({clientX: 9000, clientY: 9000});
           await harness.touchPress();
           await new Promise((resolve) => {
             setTimeout(resolve, TOUCH_DELAY_MS);
           });
           expect(el.lastBegin).not.toBeDefined();
         });
    });

    describe('cancel', () => {
      it('ignores the interaction if `pointercancel` happens during a short press',
         async () => {
           await harness.touchPress();
           await harness.touchCancel();
           expect(el.lastBegin).not.toBeDefined();
           expect(el.lastEnd).not.toBeDefined();
         });

      it('cancels press if a `pointercancel` event fires during a longer press',
         async () => {
           await harness.touchPress();
           await new Promise((resolve) => {
             setTimeout(resolve, TOUCH_DELAY_MS);
           });
           expect(el.lastBegin).toBeDefined();
           expect(el.lastBegin!.positionEvent).toBeInstanceOf(PointerEvent);
           await harness.touchCancel();
           expect(el.lastEnd).toEqual({cancelled: true});
         });
    });
  });

  describe('disabled', () => {
    let ac!: ActionControllerInternals;
    beforeEach(async () => {
      const root = env.render(html`<my-action-element></my-action-element>`);
      el = root.querySelector('my-action-element')!;
      harness = new ActionControllerHarness(el);
      ac = el.actionController as unknown as ActionControllerInternals;
      await env.waitForStability();
    });

    it('controller mirrors disabled property of element', async () => {
      expect(ac.disabled).toEqual(false);
      el.disabled = true;
      expect(ac.disabled).toEqual(true);
    });

    it('cancels press when disabled', async () => {
      await harness.press();
      expect(ac.pressed).toEqual(true);
      expect(el.lastBegin).toBeDefined();
      el.disabled = true;
      await el.updateComplete;
      expect(ac.pressed).toEqual(false);
      expect(el.lastEnd).toEqual({cancelled: true});
    });

    it('does not register interactions when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;
      await harness.click();
      expect(el.lastBegin).not.toBeDefined();
      expect(el.lastEnd).not.toBeDefined();
    });
  });
});