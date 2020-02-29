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

import {style} from '@material/mwc-icon-button/mwc-icon-button-css';
import {customElement} from 'lit-element';

import {IconButtonToggleBase} from './mwc-icon-button-toggle-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-icon-button-toggle': IconButtonToggle;
  }
}

@customElement('mwc-icon-button-toggle')
export class IconButtonToggle extends IconButtonToggleBase {
  static styles = style;
}
