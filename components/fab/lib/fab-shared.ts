/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '@material/mwc-ripple/mwc-ripple';

import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

/**
 * Fab Base class logic and template definition
 * @soyCompatible
 */
export class FabShared extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  @property({type: Boolean}) disabled = false;

  @property() icon = '';

  @property() label = '';

  @property({type: Boolean}) lowered = false;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  /**
   * @soyTemplate
   * @soyClasses fabClasses: .md3-fab
   */
  protected override render(): TemplateResult {
    const ariaLabel = this.label ? this.label : this.icon;

    /*
     * Some internal styling is sensitive to whitespace in this template, take
     * care when modifying it.
     */
    return html`
      <button
          class="md3-fab md3-surface ${classMap(this.getRootClasses())}"
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
        -->${this.renderElevationOverlay()}<!--
        -->${this.renderRipple()}<!--
        --><span class="material-icons md3-fab__icon"><!--
          --><slot name="icon">${this.icon}</slot><!--
        --></span><!--
        -->${this.renderLabel()}<!--
        -->${this.renderTouchTarget()}<!--
      </button>`;
  }

  /** @soyTemplate */
  protected getRootClasses(): ClassInfo {
    return {'md3-fab--lowered': this.lowered};
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult {
    // TODO(b/191914389): reimplement once Wit issue is resolved
    return html``;
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderElevationOverlay(): TemplateResult {
    return html`<div class="md3-elevation-overlay"></div>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return this.shouldRenderRipple ? html`
      <mwc-ripple
          class="md3-fab__ripple"
          internalUseStateLayerCustomProperties>
      </mwc-ripple>` :
                                     html``;
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