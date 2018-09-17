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
import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {style} from './mwc-card-css.js';

export class Card extends LitElement {
  static get properties() {
    return {
      stroke: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.stroke = false;
  }

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-card ${classMap({'mdc-card--stroked': this.stroke})}">
        <slot></slot>
      </div>`;
  }
}

customElements.define('mwc-card', Card);
