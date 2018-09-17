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
import {ComponentElement, MDCWebComponentMixin, html} from '@material/mwc-base/component-element.js';
import {style} from './mwc-snackbar-css.js';
import {MDCSnackbar} from '@material/snackbar';

export class MDCWCSnackbar extends MDCWebComponentMixin(MDCSnackbar) {}

export class Snackbar extends ComponentElement {
  static get ComponentClass() {
    return MDCWCSnackbar;
  }

  static get componentSelector() {
    return '.mdc-snackbar';
  }

  static get properties() {
    return {
      message: {type: String},
      timeout: {type: Number},
      multiline: {type: Boolean},
      actionText: {type: String},
      actionOnBottom: {type: Boolean},
      dismissesOnAction: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.message = '';
    this.actionText = '';
    this.timeout = -1;
    this.multiline = false;
    this.actionOnBottom = false;
    this.dismissesOnAction = true;
    this._boundActionHandler = this._actionHandler.bind(this);
  }

  renderStyle() {
    return style;
  }

  render() {
    return html`${this.renderStyle()}
      <div class="mdc-snackbar"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden="true">
      <div class="mdc-snackbar__text"></div>
      <div class="mdc-snackbar__action-wrapper">
        <button type="button" class="mdc-snackbar__action-button"></button>
      </div>
    </div>`;
  }

  show(data) {
    this.componentReady().then((component) => {
      const options = {
        message: this.message,
        actionText: this.actionText,
        multiline: this.multiLine,
        actionOnBottom: this.actionOnBottom,
        actionHandler: this._boundActionHandler,
      };
      if (this.timeout >= 0) {
        options.timeout = this.timeout;
      }
      component.show(Object.assign(options, data));
    });
  }

  _actionHandler() {
    this.dispatchEvent(new CustomEvent('MDCSnackbar:action'));
  }

  get dismissesOnAction() {
    return this._component && this._component.dismissesOnAction;
  }

  set dismissesOnAction(value) {
    this.componentReady().then((component) => {
      component.dismissesOnAction = value;
    });
  }
}

customElements.define('mwc-snackbar', Snackbar);
