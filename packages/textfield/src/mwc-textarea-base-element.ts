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

import {html, property, query, classMap} from '@material/mwc-base/form-element.js';
import {TextFieldBase} from './mwc-textfield-base-element.js';

export abstract class TextAreaBase extends TextFieldBase {
  @query('textarea')
  protected formElement!: HTMLInputElement;

  @property({type: Number})
  rows = 2;

  @property({type: Number})
  cols = 20;

  render() {
    const classes = {
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--no-label': !this.label,
      'mdc-text-field--outlined': this.outlined,
      'mdc-text-field--fullwidth': this.fullWidth,
    };
    return html`
      <div class="mdc-text-field mdc-text-field--textarea ${classMap(classes)}">
        ${this.charCounter ? html`<div class="mdc-text-field-character-counter"></div>` : ''}
        ${this.renderInput()}
        ${this.outlined ? this.renderOutlined() : this.renderLabelText()}
      </div>
      ${this.helper ? this.renderHelperText() : ''}
    `;
  }

  protected renderInput() {
    return html`
      <textarea id="text-field"
          class="mdc-text-field__input"
          .value="${this.value}"
          rows="${this.rows}"
          cols="${this.cols}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          maxlength="${this.maxlength}"
          @change="${this.handleInputChange}"></textarea>`;
  }
}
