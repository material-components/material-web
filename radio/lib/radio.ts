/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

import {SingleSelectionController} from './single-selection-controller.js';

const CHECKED = Symbol('checked');

/**
 * A radio component.
 */
export class Radio extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  static formAssociated = true;

  /**
   * Whether or not the radio is selected.
   */
  @property({type: Boolean, reflect: true})
  get checked() {
    return this[CHECKED];
  }
  set checked(checked: boolean) {
    const wasChecked = this.checked;
    if (wasChecked === checked) {
      return;
    }

    this[CHECKED] = checked;
    this.requestUpdate('checked', wasChecked);
    this.selectionController.handleCheckedChange();
  }

  [CHECKED] = false;

  /**
   * Whether or not the radio is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The element value to use in form submission when checked.
   */
  @property({type: String}) value = 'on';

  /**
   * The HTML name to use in form submission.
   */
  @property({type: String, reflect: true}) name = '';

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.closest('form');
  }

  @query('input') private readonly input!: HTMLInputElement|null;
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;
  private readonly selectionController = new SingleSelectionController(this);
  @state() private showFocusRing = false;
  @state() private showRipple = false;

  constructor() {
    super();
    this.addController(new FormController(this));
    this.addController(this.selectionController);
    this.addEventListener('click', (event: Event) => {
      if (!isActivationClick(event)) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.input!);
    });
  }

  [getFormValue]() {
    return this.checked ? this.value : null;
  }

  override focus() {
    this.input?.focus();
  }

  protected override render(): TemplateResult {
    return html`
      ${when(this.showRipple, this.renderRipple)}
      ${this.renderFocusRing()}
      <svg class="icon" viewBox="0 0 20 20">
        <mask id="cutout">
          <rect width="100%" height="100%" fill="white" />
          <circle cx="10" cy="10" r="8" fill="black" />
        </mask>
        <circle class="outer circle" cx="10" cy="10" r="10" mask="url(#cutout)" />
        <circle class="inner circle" cx="10" cy="10" r="5" />
      </svg>
      <input
        type="radio"
        name=${this.name}
        aria-label=${this.ariaLabel || nothing}
        .checked=${this.checked}
        .value=${this.value}
        ?disabled=${this.disabled}
        @change=${this.handleChange}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        @pointerdown=${this.handlePointerDown}
        ${ripple(this.getRipple)}
      >
    `;
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handleChange(event: Event) {
    if (this.disabled) {
      return;
    }

    // Per spec, the change event on a radio input always represents checked.
    this.checked = true;
    redispatchEvent(this, event);
  }

  private handlePointerDown() {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  private readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {
    return html`<md-ripple unbounded ?disabled=${this.disabled}></md-ripple>`;
  };

  private renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible=${this.showFocusRing}></md-focus-ring>`;
  }
}
