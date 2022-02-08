/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabIndicatorFoundation} from './foundation';

/* istanbul ignore next: subclass is not a branch statement */
export class MDCFadingTabIndicatorFoundation extends MDCTabIndicatorFoundation {
  activate() {
    this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }

  deactivate() {
    this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCFadingTabIndicatorFoundation;
