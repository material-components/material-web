/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../../testing/harness';
import {Button} from '../lib/button';

/**
 * Test harness for buttons.
 */
export class ButtonHarness extends Harness<Button> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-button') as HTMLElement;
  }

  override async press() {
    await this.hoverEnter();
    await super.press();
    // The ripple adapter unconditionally returns true for
    // `containsEventTarget`, which effectively blocks simultaneous ripple
    // activations. We need simulatenous activations for testing though, so
    // passing a null event to skip that singleton check.
    this.element['handleRippleActivate']();
  }
}
