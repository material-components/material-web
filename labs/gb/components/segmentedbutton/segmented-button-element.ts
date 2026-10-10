/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  type CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';

import type {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only

import {
  renderSegmentedButtonCheckmark,
  SEGMENTED_BUTTON_CLASSES,
  segmentedButton,
  type SegmentedButtonSelection,
} from './segmented-button.js';
import segmentedButtonStyles from './segmented-button.css' with {type: 'css'}; // github-only
// import segmentedButtonStyles from './segmented-button.cssresult.js'; // google3-only

/** Symbol for the segment's selection mode ('single' | 'multiple'). */
export const segmentSelectionMode = Symbol('segmentSelectionMode');

/** Symbol for whether the parent segment group is disabled. */
export const segmentGroupDisabled = Symbol('segmentGroupDisabled');

/** Symbol for the segment's owner set. */
export const segmentOwner = Symbol('segmentOwner');

/** Symbol for the segment's 1-based position in set. */
export const segmentPosInSet = Symbol('segmentPosInSet');

/** Symbol for the segment's set size. */
export const segmentSetSize = Symbol('segmentSetSize');

/** Symbol for notifying the owner set when a segment is selected. */
export const segmentSelected = Symbol('segmentSelected');

/** Interface for a segment's owner (e.g. SegmentedButtonSetElement). */
export interface SegmentOwner {
  [segmentSelected](segment: SegmentedButtonElement): void;
}

const baseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

// LINT.IfChange
/**
 * A Material Design segmented button component.
 *
 * Segmented buttons are set-only components and must be used within an
 * `md-gb-segmented-button-set` container. Icon-only segments must set
 * `aria-label`.
 *
 * @slot - Default slot for label text.
 * @slot icon - Slot for optional leading icon.
 * @csspart segmented-btn - The native button element in the shadow DOM.
 * @fires {InputEvent} input - Fired when a user toggles the segment. --bubbles --composed
 * @fires {Event} change - Fired when a user toggles the segment. --bubbles
 * @cssprop --container-color
 * @cssprop --icon-color
 * @cssprop --icon-label-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --state-layer-color
 * @cssprop --trailing-space
 */
// LINT.ThenChange(_segmented-button-tokens.scss)
export class SegmentedButtonElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    segmentedButtonStyles,
    css`
      :host {
        display: inline-flex;
      }
      :host([hidden]) {
        display: none !important;
      }
      .segmented-btn {
        flex: 1;
      }
    `,
  ];

  /** Whether the segmented button is selected. */
  @property({type: Boolean, reflect: true})
  get selected(): boolean {
    return this.privateSelected;
  }
  set selected(selected: boolean) {
    const next = selected && !this.disabled && !this.privateGroupDisabled;
    if (!next && this.hasAttribute('selected')) {
      this.removeAttribute('selected');
    }
    const prev = this.privateSelected;
    if (prev === next) return;
    this.privateSelected = next;
    this.requestUpdate('selected', prev);
    this.buttonElement?.setAttribute('aria-checked', String(next));
    this.buttonElement?.classList.toggle(
      SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected,
      next,
    );
    if (next) {
      this[segmentOwner]?.[segmentSelected](this);
    }
  }
  private privateSelected = false;

  /** Whether the segmented button is disabled. */
  @property({type: Boolean, reflect: true})
  get disabled(): boolean {
    return this.privateDisabled;
  }
  set disabled(disabled: boolean) {
    const prev = this.disabled;
    if (prev === disabled) return;
    this.privateDisabled = disabled;
    this.requestUpdate('disabled', prev);
    if (disabled && this.selected) {
      this.selected = false;
    }
  }
  private privateDisabled = false;

  /** The value associated with this segmented button. */
  @property() value = '';

  get [segmentSelectionMode](): SegmentedButtonSelection {
    return this.privateSelectionMode;
  }
  set [segmentSelectionMode](mode: SegmentedButtonSelection) {
    if (this.privateSelectionMode !== mode) {
      this.privateSelectionMode = mode;
      this.requestUpdate();
    }
  }
  private privateSelectionMode: SegmentedButtonSelection = 'single';

  get [segmentGroupDisabled](): boolean {
    return this.privateGroupDisabled;
  }
  set [segmentGroupDisabled](disabled: boolean) {
    if (this.privateGroupDisabled !== disabled) {
      this.privateGroupDisabled = disabled;
      if (disabled && this.selected) {
        this.selected = false;
      }
      this.requestUpdate();
    }
  }
  private privateGroupDisabled = false;

  [segmentOwner]: SegmentOwner | null = null;

  get [segmentPosInSet](): number {
    return this.privatePosInSet;
  }
  set [segmentPosInSet](pos: number) {
    if (this.privatePosInSet !== pos) {
      this.privatePosInSet = pos;
      this.requestUpdate();
    }
  }
  private privatePosInSet = 0;

  get [segmentSetSize](): number {
    return this.privateSetSize;
  }
  set [segmentSetSize](size: number) {
    if (this.privateSetSize !== size) {
      this.privateSetSize = size;
      this.requestUpdate();
    }
  }
  private privateSetSize = 0;

  @state() private hasIcon = false;
  @state() private hasLabel = false;

  @query('button') private readonly buttonElement!: HTMLButtonElement | null;

  // Editing text inside an existing text node does not fire `slotchange`.
  private readonly labelObserver = new MutationObserver(() => {
    const slot =
      this.renderRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    if (slot) this.hasLabel = SegmentedButtonElement.hasContent(slot);
  });

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasUpdated) {
      this.initSlottedContentFromChildren();
    }
    this.labelObserver.observe(this, {characterData: true, subtree: true});
  }

  private initSlottedContentFromChildren() {
    let hasIcon = false;
    let hasLabel = false;
    for (const child of Array.from(this.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if ((child as Element).getAttribute('slot') === 'icon') {
          hasIcon = true;
        } else {
          hasLabel = true;
        }
      } else if (child.nodeType === Node.TEXT_NODE) {
        if ((child.textContent ?? '').trim() !== '') {
          hasLabel = true;
        }
      }
    }
    this.hasIcon = hasIcon;
    this.hasLabel = hasLabel;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.labelObserver.disconnect();
  }

  override click() {
    this.buttonElement?.click();
  }

  // Unlike shared/has-slotted, ignore whitespace-only text so formatted markup
  // is not treated as a label; the result drives classes on the inner <button>
  // so the plain-markup stylesheet applies unchanged.
  private static hasContent(slot: HTMLSlotElement): boolean {
    return slot
      .assignedNodes({flatten: true})
      .some((node) =>
        node.nodeType === Node.TEXT_NODE
          ? (node.textContent ?? '').trim() !== ''
          : node.nodeType === Node.ELEMENT_NODE,
      );
  }

  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const hasContent = SegmentedButtonElement.hasContent(slot);
    if (slot.name === 'icon') {
      this.hasIcon = hasContent;
    } else {
      this.hasLabel = hasContent;
    }
  }

  private handleInput(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    this.selected = button.getAttribute('aria-checked') === 'true';
  }

  private handleChange(event: Event) {
    // `selected` was already committed in handleInput.
    redispatchEvent(this, event);
  }

  // Defensive only: the selected setter already syncs aria-checked and the selected class.
  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if ((this.disabled || this.privateGroupDisabled) && this.selected) {
      this.selected = false;
    }
    this.buttonElement?.setAttribute('aria-checked', String(this.selected));
    this.buttonElement?.classList.toggle(
      SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected,
      this.selected,
    );
  }

  protected override render() {
    const isMultiple = this[segmentSelectionMode] === 'multiple';
    const role = isMultiple ? 'checkbox' : 'radio';
    const isDisabled = this.disabled || this[segmentGroupDisabled];

    const ariaStrict = this as ARIAMixinStrict;
    const ariaLabel = ariaStrict.ariaLabel;
    const ariaPosInSet = isMultiple
      ? undefined
      : (ariaStrict.ariaPosInSet ??
        (this[segmentPosInSet] ? String(this[segmentPosInSet]) : undefined));
    const ariaSetSize = isMultiple
      ? undefined
      : (ariaStrict.ariaSetSize ??
        (this[segmentSetSize] ? String(this[segmentSetSize]) : undefined));

    return html`<button
      type="button"
      part="segmented-btn"
      class="${segmentedButton({
        selected: this.selected,
        disabled: isDisabled,
        withIcon: this.hasIcon,
        iconOnly: this.hasIcon && !this.hasLabel,
      })}"
      role=${role}
      aria-checked=${this.selected ? 'true' : 'false'}
      aria-label=${ariaLabel || nothing}
      aria-posinset=${ariaPosInSet || nothing}
      aria-setsize=${ariaSetSize || nothing}
      ?disabled=${isDisabled}
      @input=${this.handleInput}
      @change=${this.handleChange}>
      <span
        class="${SEGMENTED_BUTTON_CLASSES.segmentedBtnGraphic}"
        aria-hidden="true">
        ${renderSegmentedButtonCheckmark()}
        <span
          class="${SEGMENTED_BUTTON_CLASSES.segmentedBtnIcon}"
          ?hidden=${!this.hasIcon}>
          <slot name="icon" @slotchange=${this.handleSlotChange}></slot>
        </span>
      </span>
      <span
        class="${SEGMENTED_BUTTON_CLASSES.segmentedBtnLabel}"
        ?hidden=${!this.hasLabel}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </span>
    </button>`;
  }
}
