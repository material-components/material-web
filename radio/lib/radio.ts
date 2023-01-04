/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
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
 * @fires checked
 * @soyCompatible
 */
export class Radio extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  static formAssociated = true;

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

  @property({type: Boolean}) disabled = false;

  /**
   * The element value to use in form submission when checked.
   */
  @property({type: String}) value = 'on';

  /**
   * The HTML name to use in form submission.
   */
  @property({type: String, reflect: true}) name = '';

  /**
   * Touch target extends beyond visual boundary of a component by default.
   * Set to `true` to remove touch target added to the component.
   * @see https://material.io/design/usability/accessibility.html
   */
  @property({type: Boolean}) reducedTouchTarget = false;

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.closest('form');
  }

  @state() private focused = false;
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

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('checked') && this.input) {
      this.input.checked = this.checked;
      if (!this.checked) {
        // Remove focus ring when unchecked on other radio programmatically.
        // Blur on input since this determines the focus style.
        this.input.blur();
      }
    }
  }

  /**
   * @soyTemplate
   * @soyAttributes radioAttributes: input
   * @soyClasses radioClasses: .md3-radio
   */
  protected override render(): TemplateResult {
    /** @classMap */
    const classes = {
      'md3-radio--touch': !this.reducedTouchTarget,
      'md3-ripple-upgraded--background-focused': this.focused,
      'md3-radio--disabled': this.disabled,
    };

    return html`
      <div class="md3-radio ${classMap(classes)}">
        ${this.renderFocusRing()}
        <input
          class="md3-radio__native-control"
          type="radio"
          name="${this.name}"
          aria-label="${this.ariaLabel || nothing}"
          .checked="${this.checked}"
          .value="${this.value}"
          ?disabled="${this.disabled}"
          @change="${this.handleChange}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown=${this.handlePointerDown}
          ${ripple(this.getRipple)}
          >
        <div class="md3-radio__background">
          <div class="md3-radio__outer-circle"></div>
          <div class="md3-radio__inner-circle"></div>
        </div>
        <div class="md3-radio__ripple">
          ${when(this.showRipple, this.renderRipple)}
        </div>
      </div>`;
  }

  private handleBlur() {
    this.focused = false;
    this.showFocusRing = false;
  }

  private handleFocus() {
    this.focused = true;
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

  private handlePointerDown(event: PointerEvent) {
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
