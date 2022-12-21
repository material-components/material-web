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

import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

import {SingleSelectionController} from './single-selection-controller.js';

/**
 * @fires checked
 * @soyCompatible
 */
export class Radio extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  static formAssociated = true;

  @property({type: Boolean, reflect: true})
  get checked(): boolean {
    return this._checked;
  }

  /**
   * We define our own getter/setter for `checked` because we need to track
   * changes to it synchronously.
   *
   * The order in which the `checked` property is set across radio buttons
   * within the same group is very important. However, we can't rely on
   * UpdatingElement's `updated` callback to observe these changes (which is
   * also what the `@observer` decorator uses), because it batches changes to
   * all properties.
   *
   * Consider:
   *
   *   radio1.disabled = true;
   *   radio2.checked = true;
   *   radio1.checked = true;
   *
   * In this case we'd first see all changes for radio1, and then for radio2,
   * and we couldn't tell that radio1 was the most recently checked.
   */
  set checked(isChecked: boolean) {
    const oldValue = this._checked;
    if (isChecked === oldValue) {
      return;
    }
    this._checked = isChecked;
    this.selectionController?.update(this);

    this.requestUpdate('checked', oldValue);

    // useful when unchecks self and wrapping element needs to synchronize
    // TODO(b/168543810): Remove triggering event on programmatic API call.
    this.dispatchEvent(new Event('checked', {bubbles: true, composed: true}));
  }

  private _checked = false;  // tslint:disable-line:enforce-name-casing

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

  /**
   * input's tabindex is updated based on checked status.
   * Tab navigation will be removed from unchecked radios.
   */
  @property({type: Number}) formElementTabIndex = 0;

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
  private selectionController?: SingleSelectionController;
  @state() private showFocusRing = false;
  @state() private showRipple = false;

  constructor() {
    super();
    this.addController(new FormController(this));
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

  override connectedCallback() {
    super.connectedCallback();
    // Note that we must defer creating the selection controller until the
    // element has connected, because selection controllers are keyed by the
    // radio's shadow root. For example, if we're stamping in a lit map
    // or repeat, then we'll be constructed before we're added to a root node.
    //
    // Also note if we aren't using native shadow DOM, we still need a
    // SelectionController, because we should update checked status of other
    // radios in the group when selection changes. It also simplifies
    // implementation and testing to use one in all cases.
    //
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.selectionController = SingleSelectionController.getController(this);
    this.selectionController.register(this);

    // Radios maybe checked before connected, update selection as soon it is
    // connected to DOM. Last checked radio button in the DOM will be selected.
    //
    // NOTE: If we update selection only after firstUpdate() we might mistakenly
    // update checked status before other radios are rendered.
    this.selectionController.update(this);
  }

  override disconnectedCallback() {
    // The controller is initialized in connectedCallback, so if we are in
    // disconnectedCallback then it must be initialized.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.selectionController!.unregister(this);
    this.selectionController = undefined;
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
          tabindex="${this.formElementTabIndex}"
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

  private handleChange() {
    if (this.disabled) {
      return;
    }

    // Per spec, the change event on a radio input always represents checked.
    this.checked = true;
    this.dispatchEvent(new Event('change', {
      bubbles: true,
      composed: true,
    }));
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
