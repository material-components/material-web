/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {isServer, LitElement, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

import {
  Attachable,
  AttachableController,
} from '../../internal/controller/attachable-controller.js';

/**
 * Events that the focus ring listens to.
 */
const EVENTS = ['focusin', 'focusout', 'pointerdown'];

let hadKeyboardEvent = false;

window.addEventListener('keydown', (e: KeyboardEvent) => {
  // Ignore modifier-only keys
  if (e.metaKey || e.altKey || e.ctrlKey) return;
  hadKeyboardEvent = true;
}, true);

window.addEventListener('pointerdown', () => {
  hadKeyboardEvent = false;
}, true);

/**
 * A focus ring component.
 *
 * @fires visibility-changed {Event} Fired whenever `visible` changes.
 */
export class FocusRing extends LitElement implements Attachable {
  /**
   * Makes the focus ring visible.
   */
  @property({type: Boolean, reflect: true}) visible = false;

  /**
   * Makes the focus ring animate inwards instead of outwards.
   */
  @property({type: Boolean, reflect: true}) inward = false;

  get htmlFor() {
    return this.attachableController.htmlFor;
  }

  set htmlFor(htmlFor: string | null) {
    this.attachableController.htmlFor = htmlFor;
  }

  get control() {
    return this.attachableController.control;
  }
  set control(control: HTMLElement | null) {
    this.attachableController.control = control;
  }

  private readonly attachableController = new AttachableController(
    this,
    this.onControlChange.bind(this),
  );

  attach(control: HTMLElement) {
    this.attachableController.attach(control);
  }

  detach() {
    this.attachableController.detach();
  }

  override connectedCallback() {
    super.connectedCallback();
    // Needed for VoiceOver, which will create a "group" if the element is a
    // sibling to other content.
    this.setAttribute('aria-hidden', 'true');
  }

  /** @private */
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
        // Only use hadKeyboardEvent when using safari.
        // It works around an issue.
        const isSafari = this.isSafari();
        const focusVisible = this.control?.matches(':focus-visible') ?? false;
        this.visible = isSafari ? hadKeyboardEvent : focusVisible;
        break;
      case 'focusout':
      case 'pointerdown':
        this.visible = false;
        break;
    }

    event[HANDLED_BY_FOCUS_RING] = true;
  }

  private onControlChange(prev: HTMLElement | null, next: HTMLElement | null) {
    if (isServer) return;

    for (const event of EVENTS) {
      prev?.removeEventListener(event, this);
      next?.addEventListener(event, this);
    }
  }

  override update(changed: PropertyValues<FocusRing>) {
    if (changed.has('visible')) {
      // This logic can be removed once the `:has` selector has been introduced
      // to Firefox. This is necessary to allow correct submenu styles.
      this.dispatchEvent(new Event('visibility-changed'));
    }
    super.update(changed);
  }
  isSafari() {
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    );
  }
}

const HANDLED_BY_FOCUS_RING = Symbol('handledByFocusRing');

interface FocusRingEvent extends Event {
  [HANDLED_BY_FOCUS_RING]: true;
}
