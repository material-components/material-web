/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

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

import {customElement} from 'lit-element';
import {MenuSurfaceBase} from './mwc-menu-surface-base.js';
import {style} from './mwc-menu-surface-css.js';

export {MDCMenuDistance} from '@material/menu-surface/types.js';
export {Corner} from './mwc-menu-surface-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-menu-surface': MenuSurface;
  }
}

@customElement('mwc-menu-surface')
export class MenuSurface extends MenuSurfaceBase {
  static styles = style;
}
