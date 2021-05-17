/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {TopAppBarBase} from '@material/mwc-top-app-bar/mwc-top-app-bar-base';
import {passiveEventOptionsIfSupported} from '@material/mwc-top-app-bar/mwc-top-app-bar-base-base';
import MDCFixedTopAppBarFoundation from '@material/top-app-bar/fixed/foundation';

export class TopAppBarFixedBase extends TopAppBarBase {
  protected mdcFoundation!: MDCFixedTopAppBarFoundation;

  protected mdcFoundationClass = MDCFixedTopAppBarFoundation;

  protected barClasses() {
    return {
      ...super.barClasses(),
      'mdc-top-app-bar--fixed': true,
    };
  }

  protected registerListeners() {
    this.scrollTarget.addEventListener(
        'scroll', this.handleTargetScroll, passiveEventOptionsIfSupported);
  }

  protected unregisterListeners() {
    this.scrollTarget.removeEventListener('scroll', this.handleTargetScroll);
  }
}
