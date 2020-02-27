/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation.js';
import {property} from 'lit-element';

import {passiveEventOptionsIfSupported, TopAppBarBaseBase} from './mwc-top-app-bar-base-base.js';

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

  protected registerListeners() {
    super.registerListeners();
    window.addEventListener(
        'resize', this.handleResize, passiveEventOptionsIfSupported);
  }

  protected unregisterListeners() {
    super.unregisterListeners();
    window.removeEventListener('resize', this.handleResize);
  }
}
