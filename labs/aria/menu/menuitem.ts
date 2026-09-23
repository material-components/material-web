/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative, LitElement, css, html} from 'lit';
import {property} from 'lit/decorators.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {mixinFocusable} from '../../behaviors/focusable.js';
import {sharedCommandInvokerActivationSteps} from '../command.js';
import type {AriaFieldsetElement, CheckableState} from './fieldset.js';
import {
  resetMenuitemCheckedness,
  setCheckedness,
  updateUsedValues,
} from './internal.js';
import type {AriaMenulistElement} from './menulist.js';

const baseClass = mixinCustomStateSet(
  mixinFocusable(mixinElementInternals(LitElement)),
);

/**
 * An element implementing the proposed `<menuitem>` built-in element.
 *
 * @fires {Event} checked - Fired when the item is checked or unchecked.
 * @cssstate enabled - True when the item is enabled.
 * @cssstate disabled - True when the item is disabled.
 * @cssstate checked - True when the item is checked.
 */
export class AriaMenuitemElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: inline-flex;
      }

      [part='checkmark'] {
        &::before {
          content: '\\2713' / '';
        }

        :host(:not(:state(_checkable))) & {
          display: none;
        }

        :host(:not(:state(checked))) & {
          visibility: hidden;
        }
      }
    `,
  ];

  private internalDisabled = false;
  private checkedness = false;
  private dirtyCheckedness = false;
  private internalDefaultChecked = false;
  private cachedAncestorMenulist: AriaMenulistElement | null = null;
  private cachedAncestorFieldset: AriaFieldsetElement | null = null;

  private get usedCheckable(): CheckableState {
    if (
      this.cachedAncestorMenulist === null ||
      this.cachedAncestorFieldset === null
    ) {
      return null;
    }

    return this.cachedAncestorFieldset.checkable;
  }

  private get usedDisabled(): boolean {
    return this.cachedAncestorFieldset?.disabled || this.internalDisabled;
  }

  /**
   * Recomputes this element's used `disabled` and `checkable` values and
   * projects them onto its ARIA attributes and custom states.
   *
   * `<md-aria-fieldset>` calls this on its items when a value they inherit from
   * it changes.
   */
  [updateUsedValues]() {
    const usedDisabled = this.usedDisabled;
    this[internals].ariaDisabled = String(usedDisabled);
    this[toggleState]('disabled', usedDisabled);
    this[toggleState]('enabled', !usedDisabled);

    const usedCheckable = this.usedCheckable;
    switch (usedCheckable) {
      case null:
        this[internals].role = 'menuitem';
        this[toggleState]('_checkable', false);
        break;
      case 'single':
        this[internals].role = 'menuitemradio';
        this[toggleState]('_checkable', true);
        break;
      case 'multiple':
      default:
        this[internals].role = 'menuitemcheckbox';
        this[toggleState]('_checkable', true);
        break;
    }

    const usedChecked: boolean | null =
      usedCheckable !== null ? this.checkedness : null;
    if (usedChecked === null) {
      this[internals].ariaChecked = null;
      this[toggleState]('checked', false);
    } else {
      this[internals].ariaChecked = String(usedChecked);
      this[toggleState]('checked', usedChecked);
    }
  }

  private resetAncestorElementCache() {
    this.cachedAncestorMenulist = null;
    this.cachedAncestorFieldset = null;

    for (
      let node = this.parentNode;
      node instanceof HTMLElement;
      node = node.parentNode
    ) {
      if (node.localName === 'md-aria-menulist') {
        this.cachedAncestorMenulist = node as AriaMenulistElement;
        break;
      }

      if (node.localName === 'md-aria-fieldset') {
        this.cachedAncestorFieldset = node as AriaFieldsetElement;
      }
    }

    this[updateUsedValues]();
  }

  /**
   * Sets this element's checkedness directly, without running the rest of the
   * 'check a menuitem element' steps.
   *
   * `<md-aria-fieldset>` calls this to reset the items excluded by a newly
   * checked item.
   *
   * @param value The new checkedness.
   */
  [setCheckedness](value: boolean) {
    this.checkedness = value;
    this[updateUsedValues]();
  }

  private checkAMenuitemElement(
    isChecked: boolean,
    fireEvents: boolean,
  ): 'close-menulist' | 'stay-open' {
    if (this.usedCheckable === null) {
      // TODO: Handle the invoked submenu.
      return 'close-menulist';
    }

    this[setCheckedness](isChecked);
    this.dirtyCheckedness = true;

    if (fireEvents) {
      this.dispatchEvent(new Event('checked'));
    }

    if (this.checkedness && this.usedCheckable === 'single') {
      this.cachedAncestorFieldset?.[resetMenuitemCheckedness](this);
    }

    return this.usedCheckable === 'single' ? 'close-menulist' : 'stay-open';
  }

  @property({type: Boolean, reflect: true})
  get disabled() {
    return this.internalDisabled;
  }
  set disabled(value: boolean) {
    value = Boolean(value);
    const oldValue = this.internalDisabled;

    this.internalDisabled = value;
    this[updateUsedValues]();

    this.requestUpdate('disabled', oldValue);
  }

  @property({type: Boolean, attribute: false})
  get checked(): boolean {
    return this.checkedness;
  }
  set checked(value: boolean) {
    this.checkAMenuitemElement(value, false);
  }

  @property({type: Boolean, reflect: true})
  get defaultChecked(): boolean {
    return this.internalDefaultChecked;
  }
  set defaultChecked(value: boolean) {
    value = Boolean(value);
    const oldValue = this.internalDefaultChecked;

    this.internalDefaultChecked = value;

    if (!this.dirtyCheckedness) {
      // The proposed spec DOES NOT call into the full 'check a menuitem
      // element' steps - it only sets checkedness - but this seems like the
      // only reasonable behavior when the element is part of a single-checkable
      // fieldset. Otherwise, multiple elements with `defaultchecked` could
      // become checked.
      this.checkAMenuitemElement(value, false);
      this.dirtyCheckedness = false;
    }

    this.requestUpdate('defaultChecked', oldValue);
  }

  constructor() {
    super();
    this[updateUsedValues]();

    setupDispatchHooks(this, 'keydown', 'click');
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      afterDispatch(event, () => {
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          this.click();
        }
      });
    });
    this.addEventListener('click', (event: Event) => {
      afterDispatch(event, () => {
        if (event.defaultPrevented || this.usedDisabled) {
          return;
        }

        const newChecked = !this.checkedness;

        const closeBehavior = this.checkAMenuitemElement(newChecked, true);

        // TODO: Handle the invoked submenu.

        if (closeBehavior === 'close-menulist') {
          // TODO: This should be the 'outermost containing menulist', not just
          // the cached ancestor menulist.
          this.cachedAncestorMenulist?.hidePopover();
        }

        sharedCommandInvokerActivationSteps(this, event);
      });
    });
  }

  override render() {
    return html`<span part="checkmark"></span><slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.resetAncestorElementCache();

    if (this.internalDefaultChecked && !this.dirtyCheckedness) {
      this.checkAMenuitemElement(true, false);
      this.dirtyCheckedness = false;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resetAncestorElementCache();
  }

  override click() {
    if (!this.usedDisabled) {
      super.click();
    }
  }
}
