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
import {MDCDialogAdapter} from '@material/dialog/adapter.js';
import MDCDialogFoundation from '@material/dialog/foundation.js';
import {addHasRemoveClass, FormElement, html, HTMLElementWithRipple, query} from '@material/mwc-base/form-element.js';

export class DialogBase extends FormElement {
  @query('.mdc-dialog') protected mdcRoot!: HTMLElementWithRipple;

  @query('input') protected formElement!: HTMLInputElement;

  protected mdcFoundationClass = MDCDialogFoundation;

  protected mdcFoundation!: MDCDialogFoundation;

  protected createAdapter(): MDCDialogAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
    };
  }

  protected render() {
    return html`
      <div class="mdc-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="my-dialog-title"
        aria-describedby="my-dialog-content">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface">
          <h2 class="mdc-dialog__title" id="my-dialog-title">Dialog Title</h2>
          <div class="mdc-dialog__content" id="my-dialog-content">
            Dialog body text goes here.
          </div>
          <footer class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
              <span class="mdc-button__label">No</span>
            </button>
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
              <span class="mdc-button__label">Yes</span>
            </button>
          </footer>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>`;
  }
}
