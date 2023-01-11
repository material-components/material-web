/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {stringConverter} from '../../controller/string-converter.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * A checkbox component.
 */
export class Checkbox extends LitElement {
  static formAssociated = true;

  /**
   * Whether or not the checkbox is selected.
   */
  @property({type: Boolean, reflect: true}) checked = false;

  /**
   * Whether or not the checkbox is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether or not the checkbox is invalid.
   */
  @property({type: Boolean, reflect: true}) error = false;

  /**
   * Whether or not the checkbox is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
   */
  @property({type: Boolean, reflect: true}) indeterminate = false;

  /**
   * The value of the checkbox that is submitted with a form when selected.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
   */
  @property() value = 'on';

  /**
   * The HTML name to use in form submission.
   */
  @property({type: String, reflect: true, converter: stringConverter})
  name = '';

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.closest('form');
  }

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @state() private prevChecked = false;
  @state() private prevDisabled = false;
  @state() private prevIndeterminate = false;
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;
  @query('input') private readonly input!: HTMLInputElement|null;
  @state() private showFocusRing = false;
  @state() private showRipple = false;

  constructor() {
    super();
    this.addController(new FormController(this));
    this.addEventListener('click', (event: MouseEvent) => {
      if (!isActivationClick(event)) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.input!);
    });
  }

  override focus() {
    this.input?.focus();
  }

  [getFormValue]() {
    return this.checked ? this.value : null;
  }

  protected override update(changed: PropertyValues<Checkbox>) {
    if (changed.has('checked') || changed.has('disabled') ||
        changed.has('indeterminate')) {
      this.prevChecked = changed.get('checked') ?? this.checked;
      this.prevDisabled = changed.get('disabled') ?? this.disabled;
      this.prevIndeterminate =
          changed.get('indeterminate') ?? this.indeterminate;
    }

    super.update(changed);
  }

  protected override render(): TemplateResult {
    const prevNone = !this.prevChecked && !this.prevIndeterminate;
    const prevChecked = this.prevChecked && !this.prevIndeterminate;
    const prevIndeterminate = this.prevIndeterminate;
    const isChecked = this.checked && !this.indeterminate;
    const isIndeterminate = this.indeterminate;

    const containerClasses = classMap({
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

    return html`
      <div class="container ${containerClasses}">
        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring .visible=${this.showFocusRing}></md-focus-ring>
        ${when(this.showRipple, this.renderRipple)}
        <svg class="icon" viewBox="0 0 18 18">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
      <input type="checkbox"
        aria-checked=${isIndeterminate ? 'mixed' : nothing}
        aria-label=${this.ariaLabel || nothing}
        ?disabled=${this.disabled}
        .indeterminate=${this.indeterminate}
        .checked=${this.checked}
        @blur=${this.handleBlur}
        @change=${this.handleChange}
        @focus=${this.handleFocus}
        @pointerdown=${this.handlePointerDown}
        ${ripple(this.getRipple)}
      >
     `;
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;

    redispatchEvent(this, event);
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handlePointerDown() {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  private readonly getRipple = () => {  // bind to this
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {  // bind to this
    return html`<md-ripple ?disabled=${this.disabled} unbounded></md-ripple>`;
  };
}
