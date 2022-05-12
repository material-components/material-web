/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../ripple/ripple.js';

import {html, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action-element/action-element.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * @soyCompatible
 */
export class FabShared extends ActionElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean}) disabled = false;

  @property() icon = '';

  @property() label = '';

  @property({type: Boolean}) lowered = false;

  @property({type: Boolean}) reducedTouchTarget = false;

  @query('md-ripple') ripple!: MdRipple;

  /**
   * @soyTemplate
   * @soyClasses fabClasses: .md3-fab
   */
  protected override render(): TemplateResult {
    const ariaLabel = this.label ? this.label : this.icon;

    return html`
      <button
        class="md3-fab md3-surface ${classMap(this.getRenderClasses())}"
        ?disabled="${this.disabled}"
        aria-label="${ariaLabel}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @clickmod="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}"
      >${this.renderElevationOverlay()}${this.renderRipple()}
        <span class="material-icons md3-fab__icon">
          <slot name="icon">${this.icon}</slot>
        </span>
        ${this.renderLabel()}${this.renderTouchTarget()}
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {'md3-fab--lowered': this.lowered};
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult {
    // TODO(b/191914389): reimplement once Wit issue is resolved
    return html``;
  }

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
  protected renderElevationOverlay(): TemplateResult {
    return html`<div class="md3-elevation-overlay"></div>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple class="md3-fab__ripple" .disabled="${
        this.disabled}"></md-ripple>`;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
  }

  override handlePointerUp(e: PointerEvent) {
    super.handlePointerUp(e);
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }
}
