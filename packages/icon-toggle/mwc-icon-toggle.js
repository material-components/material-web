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
import {style} from './mwc-icon-toggle-css.js';
import {MDCIconToggle} from '@material/icon-toggle';
import '@material/mwc-icon/mwc-icon-font.js';

export class MDCWCIconToggle extends MDCWebComponentMixin(MDCIconToggle) {}

export class IconToggle extends ComponentElement {
  static get ComponentClass() {
    return MDCWCIconToggle;
  }

  static get componentSelector() {
    return '.mdc-icon-toggle';
  }

  static get properties() {
    return {
      disabled: Boolean,
      on: Boolean,
      icon: String,
      offIcon: String,
      label: '',
      offLabel: '',
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.icon = '';
    this.offIcon = '';
    this.label = '';
    this.offLabel = '';
    this.disabled = false;
    this.on = false;
    this._boundChangeHandler = this._changeHandler.bind(this);
  }

  static get formElementSelector() {
    return '.mdc-icon-toggle';
  }

  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: added display
  _render({on, disabled, icon, offIcon, label, offLabel}) {
    offIcon = offIcon || icon;
    return html`
      ${this._renderStyle()}
      <span class$="mdc-icon-toggle material-icons ${disabled ? 'mdc-icon-toggle--disabled' : ''}"
            role="button"
            aria-disabled$="${disabled}"
            tabindex="0"
            data-toggle-on$='{"label": "${label}", "content": "${icon}"}'
            data-toggle-off$='{"label": "${offLabel}", "content": "${offIcon}"}'
            on-MDCIconToggle:change="${this._boundChangeHandler}">
      </span>`;
  }

  _didRender(props, changed) {
    if ('icon' in changed || 'label' in changed ||
      'offIcon' in changed || 'offLabel' in changed) {
      this.componentReady().then((component) => component.refreshToggleData());
    }
    if ('on' in changed) {
      this.componentReady().then((component) => component.on = props.on);
    }
  }

  _changeHandler(e) {
    this.on = e.detail.isOn;
  }
}

customElements.define('mwc-icon-toggle', IconToggle);
