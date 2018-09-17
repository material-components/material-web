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
import {classMap} from 'lit-html/directives/classMap.js';
import {style} from './mwc-chip-set-css.js';
import {MDCChipSet} from '@material/chips';

export class MDCWCChipSet extends MDCWebComponentMixin(MDCChipSet) {
  get chips() {
    return Array.from(this.host.chips).map((e) => e._component);
  }

  // override
  set chips(value) {}
}

export class ChipSet extends ComponentElement {
  static get ComponentClass() {
    return MDCWCChipSet;
  }

  static get componentSelector() {
    return '.mdc-chip-set';
  }

  static get properties() {
    return {
      type: {type: String},
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.type = '';
  }

  renderStyle() {
    return style;
  }

  render() {
    const hostClassInfo = {
      'mdc-chip-set--choice': this.type == 'choice',
      'mdc-chip-set--filter': this.type == 'filter',
    };
    // TODO(sorvell) #css: added display
    return html`
      ${this.renderStyle()}
      <div class="mdc-chip-set ${classMap(hostClassInfo)}"><slot></slot></div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    this._slot = this.shadowRoot.querySelector('slot');
  }

  // TODO(sorvell): handle slotchange.
  get chips() {
    return this._slot.assignedNodes({flatten: true}).filter((e) => e.localName == 'mdc-chip');
  }
}

customElements.define('mwc-chip-set', ChipSet);
