/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * @fires input {InputEvent} Fired whenever `selected` changes due to user
 * interaction (bubbles and composed).
 * @fires change {Event} Fired whenever `selected` changes due to user
 * interaction (bubbles).
 */
export class Switch extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * @nocollapse
   */
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
  @property({reflect: true}) name = '';

  /**
   * The value associated with this switch on form submission. `null` is
   * submitted when `selected` is `false`.
   */
  @property() value = 'on';

  [getFormValue]() {
    return this.selected ? this.value : null;
  }

  constructor() {
    super();
    this.addController(new FormController(this));
    if (!isServer) {
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
  }

  protected override render(): TemplateResult {
    // NOTE: buttons must use only [phrasing
    // content](https://html.spec.whatwg.org/multipage/dom.html#phrasing-content)
    // children, which includes custom elements, but not `div`s
    return html`
      <button
        type="button"
        class="switch ${classMap(this.getRenderClasses())}"
        role="switch"
        aria-checked="${this.selected}"
        aria-label=${(this as ARIAMixin).ariaLabel || nothing}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
        ${ripple(this.getRipple)}
      >
        <md-focus-ring></md-focus-ring>
        <span class="track">
          ${this.renderHandle()}
        </span>
      </button>
    `;
  }

  private getRenderClasses(): ClassInfo {
    return {
      'switch--selected': this.selected,
      'switch--unselected': !this.selected,
    };
  }

  private readonly renderRipple = () => {
    return html`
      <span class="ripple">
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

  private renderHandle() {
    const classes = {
      'with-icon': this.icons || (this.showOnlySelectedIcon && this.selected),
    };
    return html`
      <span class="handle-container">
        ${when(this.showRipple, this.renderRipple)}
        <span class="handle ${classMap(classes)}">
          ${this.shouldShowIcons() ? this.renderIcons() : html``}
        </span>
        ${this.renderTouchTarget()}
      </span>
    `;
  }

  private renderIcons() {
    return html`
      <div class="icons">
        ${this.renderOnIcon()}
        ${this.showOnlySelectedIcon ? html`` : this.renderOffIcon()}
      </div>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Acheck%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   */
  private renderOnIcon() {
    return html`
      <svg class="icon icon--on" viewBox="0 0 24 24">
        <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z"/>
      </svg>
    `;
  }

  /**
   * https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Aclose%3AFILL%400%3Bwght%40500%3BGRAD%400%3Bopsz%4024
   */
  private renderOffIcon() {
    return html`
      <svg class="icon icon--off" viewBox="0 0 24 24">
        <path d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"/>
      </svg>
    `;
  }

  private renderTouchTarget() {
    return html`<span class="touch"></span>`;
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
}
