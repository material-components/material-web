/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '@material/mwc-ripple/mwc-ripple';

import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

/**
 * Fab Base class logic and template definition
 * @soyCompatible
 */
export class FabBase extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  @property({type: Boolean}) mini = false;

  @property({type: Boolean}) exited = false;

  @property({type: Boolean}) disabled = false;

  @property({type: Boolean}) extended = false;

  @property({type: Boolean}) showIconAtEnd = false;

  @property({type: Boolean}) reducedTouchTarget = false;

  @property() icon = '';

  @property() label = '';

  @state() protected shouldRenderRipple = false;

  @state() protected useStateLayerCustomProperties = false;

  protected rippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  /**
   * @soyTemplate
   * @soyClasses fabClasses: .mdc-fab
   */
  protected override render(): TemplateResult {
    const hasTouchTarget = this.mini && !this.reducedTouchTarget;
    /** @classMap */
    const classes = {
      'mdc-fab--mini': this.mini,
      'mdc-fab--touch': hasTouchTarget,
      'mdc-fab--exited': this.exited,
      'mdc-fab--extended': this.extended,
      'icon-end': this.showIconAtEnd,
    };

    const ariaLabel = this.label ? this.label : this.icon;

    /*
     * Some internal styling is sensitive to whitespace in this template, take
     * care when modifying it.
     */
    return html`<button
          class="mdc-fab ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${ariaLabel}"
          @mouseenter=${this.handleRippleMouseEnter}
          @mouseleave=${this.handleRippleMouseLeave}
          @focus=${this.handleRippleFocus}
          @blur=${this.handleRippleBlur}
          @mousedown=${this.handleRippleActivate}
          @touchstart=${this.handleRippleStartPress}
          @touchend=${this.handleRippleDeactivate}
          @touchcancel=${this.handleRippleDeactivate}><!--
        -->${this.renderBeforeRipple()}<!--
        -->${this.renderRipple()}<!--
        -->${this.showIconAtEnd ? this.renderLabel() : ''}<!--
        --><span class="material-icons mdc-fab__icon"><!--
          --><slot name="icon">${this.icon}</slot><!--
       --></span><!--
        -->${!this.showIconAtEnd ? this.renderLabel() : ''}<!--
        -->${this.renderTouchTarget()}<!--
      --></button>`;
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult {
    // TODO(b/191914389): reimplement once Wit issue is resolved
    return html``;
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    const hasTouchTarget = this.mini && !this.reducedTouchTarget;

    return html`${
        hasTouchTarget ? html`<div class="mdc-fab__touch"></div>` : ''}`;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult {
    const showLabel = this.label !== '' && this.extended;

    return html`${
        showLabel ? html`<span class="mdc-fab__label">${this.label}</span>` :
                    ''}`;
  }

  /** @soyTemplate */
  protected renderBeforeRipple(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ? html`<mwc-ripple class="ripple"
        .internalUseStateLayerCustomProperties="${
                                         this.useStateLayerCustomProperties}"
         ></mwc-ripple>` :
                                     '';
  }

  protected handleRippleActivate(event?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.handleRippleStartPress(event);
  }

  @eventOptions({passive: true})
  protected handleRippleStartPress(event?: Event) {
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
