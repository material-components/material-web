/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// tslint:disable:no-new-decorators

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress as focusRingPointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * @fires input {InputEvent} Fired whenever `selected` changes due to user
 * interaction (bubbles and composed).
 * @fires change {Event} Fired whenever `selected` changes due to user
 * interaction (bubbles).
 */
export class Switch extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  static formAssociated = true;

  /**
   * Disables the switch and makes it non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Puts the switch in the selected state and sets the form submission value to
   * the `value` property.
   */
  @property({type: Boolean}) selected = false;

  /**
   * Shows both the selected and deselected icons.
   */
  @property({type: Boolean}) icons = false;

  /**
   * Shows only the selected icon, and not the deselected icon. If `true`,
   * overrides the behavior of the `icons` property.
   */
  @property({type: Boolean}) showOnlySelectedIcon = false;

  @ariaProperty
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @ariaProperty
  @property({type: String, attribute: 'data-aria-labelledby', noAccessor: true})
  ariaLabelledBy = '';

  @state() private showFocusRing = false;
  @state() private showRipple = false;

  // Ripple
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  // Button
  @query('button') private readonly button!: HTMLButtonElement|null;

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.closest('form');
  }

  /**
   * The HTML name to use in form submission.
   */
  @property({type: String, reflect: true}) name = '';

  /**
   * The value associated with this switch on form submission. `null` is
   * submitted when `selected` is `false`.
   */
  @property({type: String}) value = 'on';

  [getFormValue]() {
    return this.selected ? this.value : null;
  }

  constructor() {
    super();
    this.addController(new FormController(this));
    this.addEventListener('click', (event: MouseEvent) => {
      if (!isActivationClick(event)) {
        return;
      }
      this.button?.focus();
      if (this.button != null) {
        // this triggers the click behavior, and the ripple
        dispatchActivationClick(this.button);
      }
    });
  }

  protected override render(): TemplateResult {
    const ariaLabelValue = this.ariaLabel ? this.ariaLabel : undefined;
    const ariaLabelledByValue =
        this.ariaLabelledBy ? this.ariaLabelledBy : undefined;
    // NOTE: buttons must use only [phrasing
    // content](https://html.spec.whatwg.org/multipage/dom.html#phrasing-content)
    // children, which includes custom elements, but not `div`s
    return html`
      <button
        type="button"
        class="md3-switch ${classMap(this.getRenderClasses())}"
        role="switch"
        aria-checked="${this.selected}"
        aria-label="${ifDefined(ariaLabelValue)}"
        aria-labelledby="${ifDefined(ariaLabelledByValue)}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown=${this.handlePointerDown}
        ${ripple(this.getRipple)}
      >
        ${when(this.showFocusRing, this.renderFocusRing)}
        <span class="md3-switch__track">
          ${this.renderHandle()}
        </span>
      </button>
    `;
  }

  private getRenderClasses(): ClassInfo {
    return {
      'md3-switch--selected': this.selected,
      'md3-switch--unselected': !this.selected,
    };
  }

  private readonly renderRipple = () => {
    return html`
      <span class="md3-switch__ripple">
        <md-ripple
          ?disabled="${this.disabled}"
          unbounded>
        </md-ripple>
      </span>
    `;
  };

  private readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderFocusRing = () => {
    return html`<md-focus-ring visible></md-focus-ring>`;
  };

  private renderHandle(): TemplateResult {
    /** @classMap */
    const classes = {
      'md3-switch__handle--big': this.icons && !this.showOnlySelectedIcon,
    };
    return html`
      <span class="md3-switch__handle-container">
        ${when(this.showRipple, this.renderRipple)}
        <span class="md3-switch__handle ${classMap(classes)}">
          ${this.shouldShowIcons() ? this.renderIcons() : html``}
        </span>
        ${this.renderTouchTarget()}
      </span>
    `;
  }

  private renderIcons(): TemplateResult {
    return html`
      <div class="md3-switch__icons">
        ${this.renderOnIcon()}
        ${this.showOnlySelectedIcon ? html`` : this.renderOffIcon()}
      </div>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Acheck%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   */
  private renderOnIcon(): TemplateResult {
    return html`
      <svg class="md3-switch__icon md3-switch__icon--on" viewBox="0 0 24 24">
        <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z"/>
      </svg>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aclose%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   */
  private renderOffIcon(): TemplateResult {
    return html`
      <svg class="md3-switch__icon md3-switch__icon--off" viewBox="0 0 24 24">
        <path d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"/>
      </svg>
    `;
  }

  private renderTouchTarget(): TemplateResult {
    return html`<span class="md3-switch__touch"></span>`;
  }

  private shouldShowIcons(): boolean {
    return this.icons || this.showOnlySelectedIcon;
  }

  private handleClick() {
    if (this.disabled) {
      return;
    }

    this.selected = !this.selected;
    this.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}));
    // Bubbles but does not compose to mimic native browser <input> & <select>
    // Additionally, native change event is not an InputEvent.
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  @eventOptions({passive: true})
  private handlePointerDown() {
    focusRingPointerPress();
    this.showFocusRing = false;
  }
}
