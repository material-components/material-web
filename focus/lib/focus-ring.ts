/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * A focus ring component.
 */
export class FocusRing extends LitElement {
  /**
   * Makes the focus ring visible.
   */
  @property({type: Boolean, reflect: true}) visible = false;

  /**
   * Reflects the value of the `for` attribute, which is the ID of the focus
   * ring's associated control element.
   *
   * Use this when the focus ring's associated element is not a parent element.
   *
   * To manually control a focus ring, set its `for` attribute to `""`.
   *
   * @example
   * ```html
   * <div class="container">
   *   <md-focus-ring for="interactive"></md-focus-ring>
   *   <button id="interactive">Action</button>
   * </div>
   * ```
   *
   * @example
   * ```html
   * <button class="manually-controlled">
   *   <md-focus-ring visible for=""></md-focus-ring>
   * </button>
   * ```
   */
  @property({attribute: 'for', reflect: true}) htmlFor = '';

  /**
   * The element that controls the visibility of the focus ring. It is one of:
   *
   * - The element referenced by the `for` attribute.
   * - The element provided to `.attach(element)`
   * - The parent element.
   * - `null` if the focus ring is not controlled.
   */
  get control() {
    if (this.hasAttribute('for')) {
      if (!this.htmlFor) {
        return null;
      }

      return (this.getRootNode() as Document | ShadowRoot)
          .querySelector<HTMLElement>(`#${this.htmlFor}`);
    }

    return this.currentControl || this.parentElement;
  }

  private currentControl: HTMLElement|null = null;

  /**
   * Attaches the focus ring to an interactive element.
   *
   * @param control The element that controls the focus ring.
   */
  attach(control: HTMLElement) {
    if (control === this.currentControl) {
      return;
    }

    this.detach();
    for (const event of ['focusin', 'focusout', 'pointerdown']) {
      control.addEventListener(event, this);
    }

    this.currentControl = control;
    this.removeAttribute('for');
  }

  /**
   * Detaches the focus ring from its current interactive element.
   */
  detach() {
    for (const event of ['focusin', 'focusout', 'pointerdown']) {
      this.currentControl?.removeEventListener(event, this);
    }

    this.currentControl = null;
    this.setAttribute('for', '');
  }

  override connectedCallback() {
    super.connectedCallback();
    const {control} = this;
    if (control) {
      this.attach(control);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.detach();
  }

  protected override updated(changedProperties: PropertyValues<FocusRing>) {
    if (changedProperties.has('htmlFor')) {
      const {control} = this;
      if (control) {
        this.attach(control);
      }
    }
  }

  /**
   * @private
   */
  handleEvent(event: FocusRingEvent) {
    if (event[HANDLED_BY_FOCUS_RING]) {
      // This ensures the focus ring does not activate when multiple focus rings
      // are used within a single component.
      return;
    }

    switch (event.type) {
      default:
        return;
      case 'focusin':
        this.visible = this.control?.matches(':focus-visible') ?? false;
        break;
      case 'focusout':
      case 'pointerdown':
        this.visible = false;
        break;
    }

    event[HANDLED_BY_FOCUS_RING] = true;
  }
}

const HANDLED_BY_FOCUS_RING = Symbol('handledByFocusRing');

interface FocusRingEvent extends Event {
  [HANDLED_BY_FOCUS_RING]: true;
}
