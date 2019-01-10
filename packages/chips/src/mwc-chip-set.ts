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
import { LitElement, property, html, customElement } from "@polymer/lit-element";
import { classMap } from 'lit-html/directives/class-map.js';
import { style } from './mwc-chip-css.js';

@customElement('mwc-chip-set' as any)
export class ChipSet extends LitElement {

  @property({ type: String })
  type = '';
  
  renderStyle() {
    return style;
  }
  
  render() {
    const hostClassInfo = {
      'mdc-chip-set--choice': this.type === 'choice',
      'mdc-chip-set--filter': this.type === 'filter',
    };

    return html`
      ${this.renderStyle()}
      <div class="mdc-chip-set ${classMap(hostClassInfo)}">
        <slot></slot>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-chip-set": ChipSet;
  }
}
