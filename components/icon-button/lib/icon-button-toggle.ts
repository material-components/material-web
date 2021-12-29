/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property';
import {Ripple} from '../../ripple/mwc-ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';

/** @soyCompatible */
export class IconButtonToggle extends LitElement {
  @query('.md3-icon-button') protected mdcRoot!: HTMLElement;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  // `aria-label` of the button when `on` is true.
  @property({type: String}) ariaLabelOn!: string;

  // `aria-label` of the button when `on` is false.
  @property({type: String}) ariaLabelOff!: string;

  @property({type: Boolean, reflect: true}) isOn = false;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  protected handleClick() {
    this.isOn = !this.isOn;
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change',
        {detail: {isOn: this.isOn}, bubbles: true}));
  }

  override click() {
    this.mdcRoot.focus();
    this.mdcRoot.click();
  }

  override focus() {
    this.rippleHandlers.startFocus();
    this.mdcRoot.focus();
  }

  override blur() {
    this.rippleHandlers.endFocus();
    this.mdcRoot.blur();
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? html`
            <md-ripple
                .disabled="${this.disabled}"
                unbounded>
            </md-ripple>` :
                                     '';
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    /** @classMap */
    const classes = {
      'md3-icon-button--on': this.isOn,
    };
    const hasToggledAriaLabel =
        this.ariaLabelOn !== undefined && this.ariaLabelOff !== undefined;
    const ariaPressedValue = hasToggledAriaLabel ? undefined : this.isOn;
    const ariaLabelValue = hasToggledAriaLabel ?
        (this.isOn ? this.ariaLabelOn : this.ariaLabelOff) :
        this.ariaLabel;
    return html`<button
          class="md3-icon-button ${classMap(classes)}"
          aria-pressed="${ifDefined(ariaPressedValue)}"
          aria-label="${ifDefined(ariaLabelValue)}"
          @click="${this.handleClick}"
          ?disabled="${this.disabled}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleMouseDown}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleTouchStart}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}"
        >${this.renderRipple()}
        <span class="md3-icon-button__icon">
          <slot name="offIcon">
            <i class="material-icons">${this.offIcon}</i>
          </slot>
        </span>
        <span class="md3-icon-button__icon md3-icon-button__icon--on">
          <slot name="onIcon">
            <i class="material-icons">${this.onIcon}</i>
          </slot>
        </span>
      </button>`;
  }

  @eventOptions({passive: true})
  protected handleRippleMouseDown(event?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event?: Event) {
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  protected handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
}
