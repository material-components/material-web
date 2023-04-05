/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation-surface.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';

import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * @soyCompatible
 */
export abstract class FabShared extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property() icon = '';

  @property() label = '';

  @property({type: Boolean}) lowered = false;

  @property({type: Boolean}) reducedTouchTarget = false;

  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;
  @state() private showFocusRing = false;
  @state() private showRipple = false;

  /**
   * @soyTemplate
   * @soyClasses fabClasses: .md3-fab
   */
  protected override render(): TemplateResult {
    const ariaLabel = this.label ? this.label : this.icon;
    const getRipple = () => {
      this.showRipple = true;
      return this.ripple;
    };

    return html`
      <button
        class="md3-fab md3-surface ${classMap(this.getRenderClasses())}"
        aria-label="${ariaLabel}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        ${ripple(getRipple)}>
        ${this.renderElevation()}
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        <span class="md3-fab__icon">
          <slot name="icon">${this.renderIcon(this.icon)}</slot>
        </span>
        ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {'md3-fab--lowered': this.lowered};
  }

  /** @soyTemplate */
  protected abstract renderIcon(icon: string): TemplateResult|string;

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return this.reducedTouchTarget ? html`` :
                                     html`<div class="md3-fab__touch"></div>`;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult|string {
    return '';
  }

  /** @soyTemplate */
  protected renderElevation(): TemplateResult {
    return html`<md-elevation-surface shadow></md-elevation-surface>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  private handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  private readonly renderRipple = () => {
    return html`<md-ripple class="md3-fab__ripple"></md-ripple>`;
  };
}
