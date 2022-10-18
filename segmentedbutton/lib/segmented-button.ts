/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';

import {html, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../actionelement/action-element.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * SegmentedButton is a web component implementation of the Material Design
 * segmented button component. It is intended **only** for use as a child of a
 * `SementedButtonSet` component. It is **not** intended for use in any other
 * context.
 * @soyCompatible
 */
export class SegmentedButton extends ActionElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) selected = false;
  @property({type: String}) label = '';
  @property({type: Boolean}) noCheckmark = false;
  @property({type: Boolean}) hasIcon = false;

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @state() protected animState: string = '';
  @state() protected showFocusRing = false;
  @queryAssignedElements({slot: 'icon', flatten: true})
  protected iconElement!: HTMLElement[];
  @query('md-ripple') ripple!: MdRipple;

  protected override update(props: PropertyValues<SegmentedButton>) {
    this.animState = this.nextAnimationState(props);
    super.update(props);
    // NOTE: This needs to be set *after* calling super.update() to ensure the
    // appropriate CSS classes are applied.
    this.hasIcon = this.iconElement.length > 0;
  }

  private nextAnimationState(changedProps: PropertyValues<SegmentedButton>):
      string {
    const prevSelected = changedProps.get('selected');
    // Early exit for first update.
    if (prevSelected === undefined) return '';

    const nextSelected = this.selected;
    const nextHasCheckmark = !this.noCheckmark;
    if (!prevSelected && nextSelected && nextHasCheckmark) {
      return 'selecting';
    }
    if (prevSelected && !nextSelected && nextHasCheckmark) {
      return 'deselecting';
    }
    return '';
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
    if (!options.cancelled) {
      const event = new Event(
          'segmented-button-interaction', {bubbles: true, composed: true});
      this.dispatchEvent(event);
    }
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
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

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <button
        tabindex="${this.disabled ? '-1' : '0'}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-pressed=${this.selected}
        ?disabled=${this.disabled}
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        @pointerup="${this.handlePointerUp}"
        @pointercancel="${this.handlePointerCancel}"
        @pointerleave="${this.handlePointerLeave}"
        @pointerenter="${this.handlePointerEnter}"
        @click="${this.handleClick}"
        @contextmenu="${this.handleContextMenu}"
        class="md3-segmented-button ${classMap(this.getRenderClasses())}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.renderOutline()}
        ${this.renderLeading()}
        ${this.renderLabel()}
        ${this.renderTouchTarget()}
      </button>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-segmented-button--selected': this.selected,
      'md3-segmented-button--unselected': !this.selected,
      'md3-segmented-button--with-label': this.label !== '',
      'md3-segmented-button--without-label': this.label === '',
      'md3-segmented-button--with-icon': this.hasIcon,
      'md3-segmented-button--with-checkmark': !this.noCheckmark,
      'md3-segmented-button--without-checkmark': this.noCheckmark,
      'md3-segmented-button--selecting': this.animState === 'selecting',
      'md3-segmented-button--deselecting': this.animState === 'deselecting',
    };
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}" class="md3-segmented-button__focus-ring"></md-focus-ring>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple ?disabled="${
        this.disabled}" class="md3-segmented-button__ripple"> </md-ripple>`;
  }

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderLeading(): TemplateResult {
    return this.label === '' ? this.renderLeadingWithoutLabel() :
                               this.renderLeadingWithLabel();
  }

  /** @soyTemplate */
  protected renderLeadingWithoutLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path class="md3-segmented-button__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
        </span>
        <span class="md3-segmented-button__icon" aria-hidden="true">
          <slot name="icon"></slot>
        </span>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderLeadingWithLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__leading" aria-hidden="true">
        <span class="md3-segmented-button__graphic">
          <svg class="md3-segmented-button__checkmark" viewBox="0 0 24 24">
            <path class="md3-segmented-button__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <span class="md3-segmented-button__icon" aria-hidden="true">
            <slot name="icon"></slot>
          </span>
        </span>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult {
    return html`
      <span class="md3-segmented-button__label-text">${this.label}</span>
    `;
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-segmented-button__touch"></span>`;
  }
}
