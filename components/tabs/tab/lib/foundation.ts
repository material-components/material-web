/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCFoundation} from '@material/base/foundation';
import {MDCTabAdapter} from './adapter';
import {cssClasses, strings} from './constants';
import {MDCTabDimensions} from './types';

export class MDCTabFoundation extends MDCFoundation<MDCTabAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCTabAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: () => false,
      activateIndicator: () => undefined,
      deactivateIndicator: () => undefined,
      notifyInteracted: () => undefined,
      getOffsetLeft: () => 0,
      getOffsetWidth: () => 0,
      getContentOffsetLeft: () => 0,
      getContentOffsetWidth: () => 0,
      focus: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  private focusOnActivate = true;

  constructor(adapter?: Partial<MDCTabAdapter>) {
    super({...MDCTabFoundation.defaultAdapter, ...adapter});
  }

  handleClick() {
    // It's up to the parent component to keep track of the active Tab and
    // ensure we don't activate a Tab that's already active.
    this.adapter.notifyInteracted();
  }

  isActive(): boolean {
    return this.adapter.hasClass(cssClasses.ACTIVE);
  }

  /**
   * Sets whether the tab should focus itself when activated
   */
  setFocusOnActivate(focusOnActivate: boolean) {
    this.focusOnActivate = focusOnActivate;
  }

  /**
   * Activates the Tab
   */
  activate(previousIndicatorClientRect?: DOMRect) {
    this.adapter.addClass(cssClasses.ACTIVE);
    this.adapter.activateIndicator(previousIndicatorClientRect);
    if (this.focusOnActivate) {
      this.adapter.focus();
    }
  }

  /**
   * Deactivates the Tab
   */
  deactivate() {
    // Early exit
    if (!this.isActive()) {
      return;
    }

    this.adapter.removeClass(cssClasses.ACTIVE);
    this.adapter.deactivateIndicator();
  }

  /**
   * Returns the dimensions of the Tab
   */
  computeDimensions(): MDCTabDimensions {
    const rootWidth = this.adapter.getOffsetWidth();
    const rootLeft = this.adapter.getOffsetLeft();
    const contentWidth = this.adapter.getContentOffsetWidth();
    const contentLeft = this.adapter.getContentOffsetLeft();

    return {
      contentLeft: rootLeft + contentLeft,
      contentRight: rootLeft + contentLeft + contentWidth,
      rootLeft,
      rootRight: rootLeft + rootWidth,
    };
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabFoundation;
