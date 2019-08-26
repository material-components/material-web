/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import {observer, property} from '@material/mwc-base/base-element';
import {TopAppBarBaseBase} from '@material/mwc-top-app-bar/mwc-top-app-bar-base-base';

import MDCShortTopAppBarFoundation from './mdc-top-app-bar-short-foundation';

export class TopAppBarShortBase extends TopAppBarBaseBase {
  protected mdcFoundation!: MDCShortTopAppBarFoundation;

  protected mdcFoundationClass = MDCShortTopAppBarFoundation;

  @property({type: Boolean})
  @observer(function(this: TopAppBarShortBase, value: boolean) {
    this.mdcFoundation.setAlwaysCollapsed(value);
  })
  alwaysCollapsed = false;

  protected barClasses() {
    return {
      'mdc-top-app-bar--short': true,
    };
  }

  protected contentClasses() {
    return {'mdc-top-app-bar--short-fixed-adjust': true};
  }

  protected handleTargetScroll = () => {
    this.mdcFoundation.handleTargetScroll();
    this.toggleAttribute('collapsed', this.mdcFoundation.isCollapsed);
  }
}
