/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../internal/controller/events.js';

/**
 * A checkbox component.
 */
export class Checkbox extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @nocollapse */
  static formAssociated = true;

  /**
   * Whether or not the checkbox is selected.
   */
  @property({type: Boolean}) checked = false;

  /**
   * Whether or not the checkbox is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether or not the checkbox is invalid.
   */
  @property({type: Boolean}) error = false;

  /**
   * Whether or not the checkbox is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * The value of the checkbox that is submitted with a form when selected.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
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

  @state() private prevChecked = false;
  @state() private prevDisabled = false;
  @state() private prevIndeterminate = false;
  @query('input') private readonly input!: HTMLInputElement|null;
  private readonly internals =
      (this as HTMLElement /* needed for closure */).attachInternals();

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', (event: MouseEvent) => {
        if (!isActivationClick(event)) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.input!);
      });
    }
  }

  protected override update(changed: PropertyValues<Checkbox>) {
    if (changed.has('checked') || changed.has('disabled') ||
        changed.has('indeterminate')) {
      this.prevChecked = changed.get('checked') ?? this.checked;
      this.prevDisabled = changed.get('disabled') ?? this.disabled;
      this.prevIndeterminate =
          changed.get('indeterminate') ?? this.indeterminate;
    }

    const hasValue = this.checked || this.indeterminate;
    const state = this.checked ? 'checked' :
        this.indeterminate     ? 'indeterminate' :
                                 null;
    this.internals.setFormValue(hasValue ? this.value : null, state);
    super.update(changed);
  }

  protected override render() {
    const prevNone = !this.prevChecked && !this.prevIndeterminate;
    const prevChecked = this.prevChecked && !this.prevIndeterminate;
    const prevIndeterminate = this.prevIndeterminate;
    const isChecked = this.checked && !this.indeterminate;
    const isIndeterminate = this.indeterminate;

    const containerClasses = classMap({
      'disabled': this.disabled,
      'selected': isChecked || isIndeterminate,
      'unselected': !isChecked && !isIndeterminate,
      'checked': isChecked,
      'indeterminate': isIndeterminate,
      'error': this.error && !this.disabled,
      'prev-unselected': prevNone,
      'prev-checked': prevChecked,
      'prev-indeterminate': prevIndeterminate,
      'prev-disabled': this.prevDisabled,
    });

    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div class="container ${containerClasses}">
        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>

        <input type="checkbox"
          id="input"
          aria-checked=${isIndeterminate ? 'mixed' : nothing}
          aria-label=${ariaLabel || nothing}
          aria-invalid=${this.error || nothing}
          ?disabled=${this.disabled}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @change=${this.handleChange}
        >
      </div>
    `;
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;

    redispatchEvent(this, event);
  }

  /** @private */
  formResetCallback() {
    // The checked/indeterminate properties do not reflect, so the original
    // attribute set by the user is used to determine the default value.
    this.checked = this.hasAttribute('checked');
    this.indeterminate = this.hasAttribute('indeterminate');
  }

  /** @private */
  formStateRestoreCallback(state: 'checked'|'indeterminate'|null) {
    this.checked = state === 'checked';
    this.indeterminate = state === 'indeterminate';
  }
}
