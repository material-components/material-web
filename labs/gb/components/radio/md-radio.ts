/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  afterDispatch,
  setupDispatchHooks,
} from '@material/web/internal/events/dispatch-hooks.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '@material/web/labs/behaviors/constraint-validation.js';
import {
  internals,
  mixinElementInternals,
} from '@material/web/labs/behaviors/element-internals.js';
import {mixinFocusable} from '@material/web/labs/behaviors/focusable.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '@material/web/labs/behaviors/form-associated.js';
import {RadioValidator} from '@material/web/labs/behaviors/validators/radio-validator.js';
import {SingleSelectionController} from '@material/web/radio/internal/single-selection-controller.js';
import {css, CSSResultOrNative, html, isServer, LitElement} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js'; // google3-only
import radioStyles from './radio.css' with {type: 'css'}; // github-only
// import {styles as radioStyles} from './radio.cssresult.js'; // google3-only

import {radio} from './radio.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design radio component. */
    'md-radio': Radio;
  }
}

// Separate variable needed for closure.
const radioBaseClass = mixinConstraintValidation(
  mixinFormAssociated(mixinElementInternals(mixinFocusable(LitElement))),
);

/**
 * A Material Design radio component.
 */
@customElement('md-radio')
export class Radio extends radioBaseClass {
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    radioStyles,
    css`
      :host {
        display: inline-flex;
        outline: none;
      }
      .radio {
        flex: 1;
      }
    `,
  ];

  /**
   * Whether or not the radio is selected.
   */
  @property({type: Boolean})
  get checked() {
    return this[internals].ariaChecked === 'true';
  }
  set checked(checked: boolean) {
    const wasChecked = this.checked;
    if (wasChecked === checked) {
      return;
    }

    this[internals].ariaChecked = String(checked);
    this.requestUpdate('checked', wasChecked);
    this.selectionController.handleCheckedChange();
  }

  /**
   * The default checked state of the radio.
   */
  get defaultChecked(): boolean {
    return this.hasAttribute('checked');
  }
  set defaultChecked(value: boolean) {
    this.toggleAttribute('checked', value || false);
  }

  /**
   * Whether or not the radio is required. If any radio is required in a group,
   * all radios are implicitly required.
   */
  @property({type: Boolean}) required = false;

  /**
   * The element value to use in form submission when checked.
   */
  @property() value = 'on';

  @query('.radio', true) private readonly radio!: HTMLElement;
  private readonly selectionController = new SingleSelectionController(this);
  /**
   * Mimics the behavior of <input> dirty checkedness, where the `checked`
   * attribute only updates the checked state if the radio has not been
   * interacted with.
   *
   * @see https://html.spec.whatwg.org/multipage/input.html#concept-input-checked-dirty-flag
   */
  private dirtyCheckedness = false;
  @state() private isFocused = false;

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'radio';
    this.addController(this.selectionController);
    setupDispatchHooks(this, 'click', 'keydown');
    this.addEventListener('click', (event) => {
      // Return if disabled, or already checked since clicking on a checked
      // radio does not dispatch events.
      if (this.disabled || this.checked) return;
      afterDispatch(event, () => {
        if (event.defaultPrevented) return;
        // Per spec, clicking on a radio input always selects it.
        this.checked = true;
        this.dirtyCheckedness = true;
        this.dispatchEvent(new Event('change', {bubbles: true}));
        this.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
      });
    });

    this.addEventListener('keydown', (event) => {
      afterDispatch(event, () => {
        if (event.key !== ' ' || event.defaultPrevented) {
          return;
        }

        this.click();
      });
    });

    this.addEventListener('focus', () => {
      this.isFocused = true;
    });

    this.addEventListener('blur', () => {
      this.isFocused = false;
    });
  }

  protected override render() {
    return html`<div
      part="radio"
      class="ripple-host focus-ring-host ${radio({
        checked: this.checked,
        disabled: this.disabled,
        focus: this.isFocused,
      })}"></div>`;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'checked' && this.dirtyCheckedness) {
      // The 'checked' attribute does not update radios that have been
      // interacted with.
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override [getFormValue]() {
    return this.checked ? this.value : null;
  }

  override [getFormState]() {
    return String(this.checked);
  }

  override formResetCallback() {
    this.dirtyCheckedness = false;
    this.checked = this.defaultChecked;
  }

  override formStateRestoreCallback(state: string) {
    this.checked = state === 'true';
  }

  override [createValidator]() {
    return new RadioValidator(() => {
      if (!this.selectionController) {
        // Validation runs on superclass construction, so selection controller
        // might not actually be ready until this class constructs.
        return [this];
      }

      return this.selectionController.controls as [Radio, ...Radio[]];
    });
  }

  override [getValidityAnchor]() {
    return this.radio;
  }
}
