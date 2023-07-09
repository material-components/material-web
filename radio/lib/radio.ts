/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../internal/controller/events.js';

import {SingleSelectionController} from './single-selection-controller.js';

const CHECKED = Symbol('checked');
let maskId = 0;

/**
 * A radio component.
 */
export class Radio extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /** @nocollapse */
  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  /** @nocollapse */
  static formAssociated = true;

  private maskId = `cutout${++maskId}`;

  /**
   * Whether or not the radio is selected.
   */
  @property({type: Boolean})
  get checked() {
    return this[CHECKED];
  }
  set checked(checked: boolean) {
    const wasChecked = this.checked;
    if (wasChecked === checked) {
      return;
    }

    this[CHECKED] = checked;
    const state = String(checked);
    this.internals.setFormValue(this.checked ? this.value : null, state);
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
  @property() value = 'on';

  /**
   * The HTML name to use in form submission.
   */
  get name() {
    return this.getAttribute('name') ?? '';
  }
  set name(name: string) {
    this.setAttribute('name', name);
  }

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.internals.form;
  }

  /**
   * The labels this element is associated with.
   */
  get labels() {
    return this.internals.labels;
  }

  @query('input') private readonly input!: HTMLInputElement|null;
  private readonly selectionController = new SingleSelectionController(this);
  private readonly internals =
      (this as HTMLElement /* needed for closure */).attachInternals();

  constructor() {
    super();
    this.addController(this.selectionController);
    if (!isServer) {
      this.addEventListener('click', (event: Event) => {
        if (!isActivationClick(event)) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.input!);
      });
    }
  }

  override focus() {
    this.input?.focus();
  }

  protected override render() {
    const classes = {checked: this.checked};
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div class=${classMap(classes)}>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <md-focus-ring for="input"></md-focus-ring>
        <svg class="icon" viewBox="0 0 20 20">
          <mask id="${this.maskId}">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="10" cy="10" r="8" fill="black" />
          </mask>
          <circle class="outer circle" cx="10" cy="10" r="10" mask="url(#${this.maskId})" />
          <circle class="inner circle" cx="10" cy="10" r="5" />
        </svg>
        <input
          id="input"
          type="radio"
          name=${this.name}
          aria-label=${ariaLabel || nothing}
          .checked=${this.checked}
          .value=${this.value}
          ?disabled=${this.disabled}
          @change=${this.handleChange}
        >
      </div>
    `;
  }

  private handleChange(event: Event) {
    if (this.disabled) {
      return;
    }

    // Per spec, the change event on a radio input always represents checked.
    this.checked = true;
    redispatchEvent(this, event);
  }

  /** @private */
  formResetCallback() {
    // The checked property does not reflect, so the original attribute set by
    // the user is used to determine the default value.
    this.checked = this.hasAttribute('checked');
  }

  /** @private */
  formStateRestoreCallback(state: string) {
    this.checked = state === 'true';
  }
}
