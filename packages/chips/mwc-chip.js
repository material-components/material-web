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
import {style} from './mwc-chip-css.js';
import {MDCChip} from '@material/chips';
import '@material/mwc-icon/mwc-icon-font.js';

export class MDCWCChip extends MDCWebComponentMixin(MDCChip) {}

export class Chip extends ComponentElement {
  static get ComponentClass() {
    return MDCWCChip;
  }

  static get componentSelector() {
    return '.mdc-chip';
  }

  static get properties() {
    return {
      leadingIcon: String,
      trailingIcon: String,
      label: String,
      active: Boolean,
    };
  }

  constructor() {
    super();
    this.leadingIcon = '';
    this.trailingIcon = '';
    this.label = '';
    this.active = false;
    this._boundInteractionHandler = this._interactionHandler.bind(this);
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell): Note, nice to have vars for activated colors.
  _render({leadingIcon, trailingIcon, label}) {
    const leadingIconPart = leadingIcon ? html`<i class="material-icons mdc-chip__icon mdc-chip__icon--leading">${leadingIcon}</i>` : '';
    const trailingIconPart = trailingIcon ? html`<i class="material-icons mdc-chip__icon mdc-chip__icon--trailing">${trailingIcon}</i>` : '';
    // TODO(sorvell) #css: added display
    return html`
      ${this._renderStyle()}
      <div class$="mdc-chip ${this.active ? 'mdc-chip--activated' : ''}"
        on-MDCChip:interaction="${this._boundInteractionHandler}">
        ${leadingIconPart}
        <div class="mdc-chip__text">${label}</div>
        ${trailingIconPart}
      </div>`;
  }

  // TODO(sorvell): Prefer being able to set a property for active rather than
  // having a method. This enables declarative setting.
  // toggleActive() {
  //   this.componentReady().then((component) => component.toggleActive());
  // }

  _interactionHandler(e) {
    requestAnimationFrame(() => {
      this.active = this._componentRoot.classList.contains('mdc-chip--activated');
    });
  }
}

customElements.define('mwc-chip', Chip);
