/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative, html, LitElement, PropertyValues} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {type ButtonElement} from '../button/button-element.js';
import {updateClassList} from '../shared/update-class-list.js';
import {
  buttonGroupClasses,
  type ButtonGroupSelection,
  type ButtonGroupVariant,
  normalizeSelection,
  shouldBlockToggle,
} from './button-group.js';

import buttonGroupStyles from './button-group.css' with {type: 'css'}; // github-only
// import buttonGroupStyles from './button-group.cssresult.js'; // google3-only

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * A Material Design button group component.
 *
 * @slot - Used to display buttons.
 * @fires {InputEvent} input - Fired when selection changes. --bubbles --composed
 * @fires {Event} change - Fired when selection changes. --bubbles
 * @cssprop --between-space
 * @cssprop --pressed-item-width-multiplier
 * @cssprop --motion-spring-fast-spatial
 * @cssprop --motion-spring-fast-spatial-duration
 * @cssprop --inner-corner-size
 * @cssprop --pressed-inner-corner-size
 * @cssprop --outer-corner-size
 * @cssprop --outer-corner-square-size
 */
export class ButtonGroupElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [buttonGroupStyles];

  constructor() {
    super();
    this[internals].role = 'toolbar';

    const handleClick = (event: MouseEvent): void => {
      const path = event.composedPath();
      const button = this.buttons.find((b) => path.includes(b));
      if (!button) return;

      if (button.disabled || button.softDisabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const index = this.buttons.indexOf(button);
      if (
        shouldBlockToggle(this.buttons, index, {
          selection: this.selection,
          required: this.required,
        })
      ) {
        event.preventDefault();
      }
    };

    const handleInput = (event: Event): void => {
      if (event.target === this) return;

      const path = event.composedPath();
      const child = this.buttons.find((b) => path.includes(b));
      if (!child || child.disabled || child.softDisabled) return;

      event.stopImmediatePropagation();
      this.syncSelectionFromChild(child);
      this.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
    };

    const handleChange = (event: Event): void => {
      if (event.target === this) return;

      const path = event.composedPath();
      const child = this.buttons.find((b) => path.includes(b));
      if (!child || child.disabled || child.softDisabled) return;

      event.stopImmediatePropagation();
      this.syncSelectionFromChild(child);
      this.dispatchEvent(new Event('change', {bubbles: true}));
    };

    this.addEventListener('click', handleClick);
    this.addEventListener('input', handleInput);
    this.addEventListener('change', handleChange);
  }

  /** The visual variant of the button group. */
  @property({reflect: true}) variant: ButtonGroupVariant = 'standard';

  /** The selection mode. */
  @property({reflect: true}) selection: ButtonGroupSelection = 'none';

  /** Whether selection is required in single-select mode. */
  @property({type: Boolean, reflect: true}) required = false;

  /** Whether the button group is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  @queryAssignedElements({flatten: true})
  private readonly assignedElementsList!: HTMLElement[];

  private readonly groupDisabledButtons = new WeakSet<HTMLElement>();

  private readonly childObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'selected') {
        const target = mutation.target as ButtonElement;
        if (this.selection === 'single') {
          if (target.selected) {
            this.normalizeGroupSelection({preferred: target});
          } else if (this.required) {
            const anySelected = this.buttons.some((b) => b.selected);
            if (!anySelected) {
              this.normalizeGroupSelection();
            }
          }
        }
      }
    }
  });

  /** Returns all child `md-gb-button` elements. */
  get buttons(): ButtonElement[] {
    return this.assignedElementsList.filter(
      (node): node is ButtonElement => node.localName === 'md-gb-button',
    );
  }

  /** Returns currently selected buttons. */
  get selectedButtons(): ButtonElement[] {
    return this.buttons.filter((b) => b.selected);
  }

  /** Returns index of first selected button or -1. */
  get selectedIndex(): number {
    return this.buttons.findIndex((b) => b.selected);
  }

  /** Returns indices of all selected buttons. */
  get selectedIndices(): number[] {
    const indices: number[] = [];
    const buttons = this.buttons;
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].selected) {
        indices.push(i);
      }
    }
    return indices;
  }

  /** Value of the currently selected button (or first selected). */
  get value(): string {
    return this.selectedButtons[0]?.value ?? '';
  }

  /** Silent setter for single-select mode. */
  set value(val: string) {
    if (this.selection !== 'single') return;
    for (const b of this.buttons) {
      b.selected = b.value === val;
    }
    this.normalizeGroupSelection();
  }

  /** Values of all currently selected buttons. */
  get values(): string[] {
    return this.selectedButtons.map((b) => b.value);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    adoptStyles(this, buttonGroupStyles);
    updateClassList(
      this,
      buttonGroupClasses({
        variant: this.variant,
        disabled: this.disabled,
      }),
    );
    if (this.hasUpdated) {
      this.observeChildren();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.childObserver.disconnect();
  }

  protected override firstUpdated(
    changedProperties: PropertyValues<this>,
  ): void {
    super.firstUpdated(changedProperties);
    this.syncButtonsDisabledAndType();
    this.normalizeGroupSelection();
    this.observeChildren();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (!this.hasAttribute('focusgroup')) {
      this.setAttribute('focusgroup', 'toolbar wrap inline');
    }

    if (changedProperties.has('variant') || changedProperties.has('disabled')) {
      updateClassList(
        this,
        buttonGroupClasses({
          variant: this.variant,
          disabled: this.disabled,
        }),
      );
    }

    if (
      changedProperties.has('selection') ||
      changedProperties.has('disabled')
    ) {
      this.syncButtonsDisabledAndType();
    }

    if (
      changedProperties.has('selection') ||
      changedProperties.has('required')
    ) {
      this.normalizeGroupSelection();
      this.observeChildren();
    }
  }

  private syncSelectionFromChild(child: ButtonElement): void {
    // ButtonElement updates its own `selected` property on the `change` event;
    // during an `input` event, the custom element's `selected` property has not
    // yet been updated by its internal listener, so we inspect `aria-pressed` on
    // the inner button element to capture the immediate interactive toggle state.
    const innerBtn = child.shadowRoot?.querySelector('[part="btn"]');
    if (innerBtn) {
      const isPressed =
        innerBtn.getAttribute('aria-pressed') === 'true' ||
        (innerBtn as HTMLElement).ariaPressed === 'true';
      child.selected = isPressed;
    }

    if (this.selection === 'single') {
      if (child.selected) {
        for (const button of this.buttons) {
          if (button !== child) {
            button.selected = false;
          }
        }
      }
    }
  }

  private syncButtonsDisabledAndType(): void {
    const buttons = this.buttons;
    for (const button of buttons) {
      const hasHref = button.hasAttribute('href') || Boolean(button.href);
      if (!hasHref) {
        const targetType = this.selection === 'none' ? 'button' : 'toggle';
        button.setAttribute('type', targetType);
      }

      if (this.disabled) {
        if (!button.disabled) {
          this.groupDisabledButtons.add(button);
          button.disabled = true;
        }
      } else {
        if (this.groupDisabledButtons.has(button)) {
          this.groupDisabledButtons.delete(button);
          button.disabled = false;
        }
      }
    }
  }

  private normalizeGroupSelection(
    options: {preferred?: ButtonElement} = {},
  ): void {
    normalizeSelection(this.buttons, {
      selection: this.selection,
      required: this.required,
      preferred: options.preferred,
    });
    this.childObserver.takeRecords();
  }

  private observeChildren(): void {
    this.childObserver.disconnect();
    for (const button of this.buttons) {
      this.childObserver.observe(button, {
        attributes: true,
        attributeFilter: ['selected'],
      });
    }
  }

  protected handleSlotChange(): void {
    this.syncButtonsDisabledAndType();
    const selected = this.buttons.filter((b) => b.selected);
    const preferred = selected[selected.length - 1];
    this.normalizeGroupSelection({preferred});
    this.observeChildren();
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }
}
