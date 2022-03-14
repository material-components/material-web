/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabIndicatorFoundation} from './foundation';

/* istanbul ignore next: subclass is not a branch statement */
export class MDCSlidingTabIndicatorFoundation extends
    MDCTabIndicatorFoundation {
  activate(previousIndicatorClientRect?: DOMRect) {
    // Early exit if no indicator is present to handle cases where an indicator
    // may be activated without a prior indicator state
    if (!previousIndicatorClientRect) {
      this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
      return;
    }

    // This animation uses the FLIP approach. You can read more about it at the
    // link below: https://aerotwist.com/blog/flip-your-animations/

    // Calculate the dimensions based on the dimensions of the previous
    // indicator
    const currentClientRect = this.computeContentClientRect();
    const widthDelta =
        previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.setContentStyleProperty(
        'transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    // Force repaint before updating classes and transform to ensure the
    // transform properly takes effect
    this.computeContentClientRect();

    this.adapter.removeClass(
        MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
    this.adapter.setContentStyleProperty('transform', '');
  }

  deactivate() {
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCSlidingTabIndicatorFoundation;
