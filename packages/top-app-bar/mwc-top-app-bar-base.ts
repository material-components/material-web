/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation';
import {property} from 'lit-element';

import {passiveEventOptionsIfSupported, TopAppBarBaseBase} from './mwc-top-app-bar-base-base';

export class TopAppBarBase extends TopAppBarBaseBase {
  protected mdcFoundationClass = MDCTopAppBarFoundation;
  protected mdcFoundation!: MDCTopAppBarFoundation;

  @property({type: Boolean, reflect: true}) prominent = false;

  @property({type: Boolean, reflect: true}) dense = false;

  protected handleResize = () => {
    this.mdcFoundation.handleWindowResize();
  };

  protected barClasses() {
    return {
      'mdc-top-app-bar--dense': this.dense,
      'mdc-top-app-bar--prominent': this.prominent,
      'center-title': this.centerTitle,
    };
  }

  protected contentClasses() {
    return {
      'mdc-top-app-bar--fixed-adjust': !this.dense && !this.prominent,
      'mdc-top-app-bar--dense-fixed-adjust': this.dense && !this.prominent,
      'mdc-top-app-bar--prominent-fixed-adjust': !this.dense && this.prominent,
      'mdc-top-app-bar--dense-prominent-fixed-adjust':
          this.dense && this.prominent,
    };
  }

  protected override registerListeners() {
    super.registerListeners();
    window.addEventListener(
        'resize', this.handleResize, passiveEventOptionsIfSupported);
  }

  protected override unregisterListeners() {
    super.unregisterListeners();
    window.removeEventListener('resize', this.handleResize);
  }
}
