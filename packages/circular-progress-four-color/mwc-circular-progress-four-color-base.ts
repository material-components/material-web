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
import {CircularProgressBase} from '@material/mwc-circular-progress/mwc-circular-progress-base';
import {html} from 'lit-element';

/** @soyCompatible */
export class CircularProgressFourColorBase extends CircularProgressBase {
  /** @soyCompatible */
  protected renderIndeterminateContainer() {
    return html`
      <div class="mdc-circular-progress__indeterminate-container">
             ${
        this.renderIndeterminateSpinnerLayer('mdc-circular-progress__color-1')}
     ${this.renderIndeterminateSpinnerLayer('mdc-circular-progress__color-2')}
     ${this.renderIndeterminateSpinnerLayer('mdc-circular-progress__color-3')}
     ${this.renderIndeterminateSpinnerLayer('mdc-circular-progress__color-4')}
      </div>`;
  }
}
