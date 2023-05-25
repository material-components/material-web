/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {noChange} from 'lit';
import {Directive, directive, DirectiveParameters, ElementPart, PartInfo, PartType} from 'lit/directive.js';

import {Ripple} from './lib/ripple.js';

/**
 * Normalized ripple accessor type.
 *
 * Use with `await rippleFunction()`
 */
type RippleFunction = () => Ripple|null|Promise<Ripple|null>;

class RippleDirective extends Directive {
  private rippleGetter: RippleFunction = async () => null;
  private element?: HTMLElement;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `ripple` directive must be used on an element');
    }
  }

  render(ripple: RippleFunction|Promise<Ripple|null>) {
    return noChange;
  }

  // Use EventListenerObject::handleEvent interface to handle events without
  // generating bound event handlers
  async handleEvent(event: Event) {
    const ripple = await this.rippleGetter();
    if (!ripple) {
      return;
    }

    await ripple.handleEvent(event);
  }

  override update(part: ElementPart, [ripple]: DirectiveParameters<this>) {
    if (!this.element) {
      // NOTE: addEventListener typing needs to be used with HTMLElements or a
      // subclass
      this.element = part.element as HTMLElement;
      this.element.addEventListener('click', this);
      this.element.addEventListener('contextmenu', this);
      this.element.addEventListener('pointercancel', this);
      this.element.addEventListener('pointerdown', this);
      this.element.addEventListener('pointerenter', this);
      this.element.addEventListener('pointerleave', this);
      this.element.addEventListener('pointerup', this);
    }
    // Normalize given ripple accessor
    this.rippleGetter = typeof ripple === 'function' ? ripple : () => ripple;
    return noChange;
  }
}

/**
 * Connects a Ripple element to a node that drives the interaction
 *
 * @param rippleGetter A function that returns an `md-ripple` element
 * @param simulateKeyboardClick For elements that do not issue a click on
 *     keyboard interaction, pass `true` to enable press animations on Enter or
 *     Spacebar
 */
export const ripple = directive(RippleDirective);
