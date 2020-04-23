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
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {html, LitElement, property, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';

export class FabBase extends LitElement {
  @property({type: Boolean}) mini = false;

  @property({type: Boolean}) exited = false;

  @property({type: Boolean}) disabled = false;

  @property({type: Boolean}) extended = false;

  @property({type: Boolean}) showIconAtEnd = false;

  @property() icon = '';

  @property() label = '';

  protected createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  protected render() {
    const classes = {
      'mdc-fab--mini': this.mini,
      'mdc-fab--exited': this.exited,
      'mdc-fab--extended': this.extended,
      'icon-end': this.showIconAtEnd,
    };
    const showLabel = this.label !== '' && this.extended;

    let iconTemplate: TemplateResult|string = '';

    if (this.icon) {
      iconTemplate = html`
        <span class="material-icons mdc-fab__icon">${this.icon}</span>`;
    }

    let label = html``;

    if (showLabel) {
      label = html`<span class="mdc-fab__label">${this.label}</span>`;
    }

    return html`
      <button
          class="mdc-fab ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}"
          .ripple="${ripple()}">
        <div class="mdc-fab__ripple"></div>
        ${this.showIconAtEnd ? label : ''}
        <slot name="icon">
          ${iconTemplate}
        </slot>
        ${!this.showIconAtEnd ? label : ''}
      </button>`;
  }
}
