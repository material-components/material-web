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
import {AriaFieldsetElement} from './fieldset.js';
import {AriaMenulistElement} from './menulist.js';

const baseClass = mixinCustomStateSet(
  mixinFocusable(mixinElementInternals(LitElement)),
);

/**
 * An element implementing the proposed `<menuitem>` built-in element.
 *
 * Use `::part(checkmark)::before` to style the pseudo-element representing the
 * `::checkmark`. (As of writing, pseudo-elements can't be directly exported as
 * first-class parts.)
 *
 * Unlike the proposed `<menuitem>` behavior, this element does not support
 * being nested within multiple `<fieldset>`s.
 *
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

  private ancestorMenulist?: AriaMenulistElement;
  private internalAncestorFieldset?: AriaFieldsetElement;
  private get ancestorFieldset(): AriaFieldsetElement | undefined {
    return this.internalAncestorFieldset;
  }
  private set ancestorFieldset(value: AriaFieldsetElement | undefined) {
    const oldFieldset = this.internalAncestorFieldset;
    if (oldFieldset) {
      oldFieldset.removeEventListener(
        'checkable-changed',
        this.fieldsetCheckableChanged,
      );
      oldFieldset.removeEventListener(
        'disabled-changed',
        this.fieldsetDisabledChanged,
      );

      this.fieldsetCheckable = null;
      this.fieldsetDisabled = false;
    }

    this.internalAncestorFieldset = value;

    const newFieldset = this.ancestorFieldset;
    if (newFieldset) {
      newFieldset.addEventListener(
        'checkable-changed',
        this.fieldsetCheckableChanged,
      );
      newFieldset.addEventListener(
        'disabled-changed',
        this.fieldsetDisabledChanged,
      );

      this.fieldsetCheckable = newFieldset.checkable;
      this.fieldsetDisabled = newFieldset.disabled;
    }
  }
  private get fieldsetCheckable(): 'single' | 'multiple' | null {
    return this.ancestorFieldset?.checkable ?? null;
  }
  private set fieldsetCheckable(value: 'single' | 'multiple' | null) {
    this.internalCheckable = this.fieldsetCheckable;
    this.internalChecked = this.fieldsetCheckable
      ? Boolean(this.internalChecked)
      : null;
  }
  private get fieldsetDisabled(): boolean | null {
    return this.ancestorFieldset?.disabled ?? null;
  }
  private set fieldsetDisabled(value: boolean | null) {
    this.internalDisabled =
      Boolean(this.fieldsetDisabled) || Boolean(this.disabled);
  }
  private dirtyCheckedness = false;
  private internalDefaultChecked = false;

  private readonly fieldsetCheckableChanged = (event: Event) => {
    this.fieldsetCheckable = (
      event as CustomEvent<{value: 'single' | 'multiple' | null}>
    ).detail.value;
  };
  private readonly fieldsetDisabledChanged = (event: Event) => {
    this.fieldsetDisabled = (
      event as CustomEvent<{value: boolean}>
    ).detail.value;
  };

  @property({type: Boolean, reflect: true})
  get disabled(): boolean {
    return this.internalDisabled;
  }
  set disabled(value: boolean) {
    value = Boolean(value);
    const oldValue = this.internalDisabled;

    this.internalDisabled = Boolean(this.fieldsetDisabled) || Boolean(value);

    this.requestUpdate('disabled', oldValue);
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
      this.internalChecked = value;
    }

    this.requestUpdate('defaultchecked', oldValue);
  }
  internalDirtyCheckedness = false;

  @property({type: Boolean})
  get checked(): boolean {
    return Boolean(this.internalChecked);
  }
  set checked(value: boolean) {
    value = Boolean(value);

    if (this.internalCheckable === null) {
      return;
    }

    this.dirtyCheckedness = true;

    if (value && this.fieldsetCheckable === 'single') {
      // This naively queries for these elements because it doesn't need to
      // support nested fieldsets yet.
      const items: Iterable<AriaMenuitemElement> =
        this.ancestorFieldset?.querySelectorAll('md-aria-menuitem') ?? [];
      for (const item of items) {
        if (item !== this) {
          item.internalChecked = false;
        }
      }
    }

    this.internalChecked = value;
  }

  /**
   * The internal disabled state of this element, canonically stored in the
   * item's ARIA disabled state. This value is set in `updated` based on both
   * the `disabledContext` from the ancestor `<md-aria-fieldset>` (if any) and
   * the `disabled` attribute.
   */
  private get internalDisabled(): boolean {
    return this[internals].ariaDisabled === 'true';
  }
  private set internalDisabled(value: boolean) {
    this[internals].ariaDisabled = String(value);
    this[toggleState]('disabled', value);
    this[toggleState]('enabled', !value);
  }

  /**
   * The internal checkable state of this element, canonically stored in the
   * item's ARIA role. This value is set in `updated` based on the
   * `checkableContext` from the ancestor `<md-aria-fieldset>`. Setting this
   * property does not automatically update `internalChecked`.
   */
  private get internalCheckable(): 'single' | 'multiple' | null {
    switch (this[internals].role) {
      case 'menuitemradio':
        return 'single';
      case 'menuitemcheckbox':
        return 'multiple';
      case 'menuitem':
        return null;
      default:
        // Unreachable
        return null;
    }
  }
  private set internalCheckable(value: 'single' | 'multiple' | null) {
    switch (value) {
      case 'single':
        this[internals].role = 'menuitemradio';
        this[toggleState]('_checkable', true);
        break;
      case 'multiple':
        this[internals].role = 'menuitemcheckbox';
        this[toggleState]('_checkable', true);
        break;
      case null:
        this[internals].role = 'menuitem';
        this[toggleState]('_checkable', false);
        break;
      default:
      // Unreachable
    }
  }

  /**
   * The internal checked state of this element, canonically stored in the
   * item's ARIA checked state. Setting this property does not automatically
   * update `internalCheckable`.
   */
  private get internalChecked(): boolean | null {
    const value = this[internals].ariaChecked as string | null;
    return value === null ? (value as null) : value === 'true';
  }
  private set internalChecked(value: boolean | null) {
    if (value === null) {
      this[internals].ariaChecked = null;
      this[toggleState]('checked', false);
      return;
    }

    this[internals].ariaChecked = String(value);
    this[toggleState]('checked', value);
  }

  constructor() {
    super();
    this.internalDisabled = false;
    this.internalCheckable = null;
    this.internalChecked = null;

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
        if (event.defaultPrevented || this.internalDisabled) {
          return;
        }

        if (this.internalCheckable !== null) {
          // Use the user-facing setter to update other items in this fieldset,
          // if any.
          this.checked = !this.checked;
        }

        if (this.internalCheckable !== 'multiple') {
          this.ancestorMenulist?.hidePopover();
        }
        sharedCommandInvokerActivationSteps(this, event);
      });
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.resetAncestorElementCache();
    if (this.defaultChecked && !this.dirtyCheckedness) {
      this.checked = true;
      this.dirtyCheckedness = false;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resetAncestorElementCache();
  }

  private resetAncestorElementCache() {
    this.ancestorMenulist = undefined;
    this.ancestorFieldset = undefined;

    for (let node = this.parentNode; node; node = node.parentNode) {
      if (node instanceof AriaMenulistElement) {
        this.ancestorMenulist = node;
        break;
      }

      if (node instanceof AriaFieldsetElement) {
        this.ancestorFieldset = node;
      }
    }
  }

  override render() {
    return html`<span part="checkmark"></span><slot></slot>`;
  }

  override click() {
    if (!this.internalDisabled) {
      super.click();
    }
  }
}
