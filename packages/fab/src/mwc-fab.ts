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
import {LitElement, html, property, customElement, classMap} from '@material/mwc-base/base-element';
import {style} from './mwc-fab-css.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import '@material/mwc-icon/mwc-icon-font.js';

@customElement('mwc-fab' as any)
export class Fab extends LitElement {

  @property({type: Boolean})
  mini = false;

  @property({type: Boolean})
  exited = false;

  @property({type: Boolean})
  disabled = false;

  @property({type: Boolean})
  extended = false;

  @property({type: Boolean})
  showIconAtEnd = false;

  @property()
  icon = '';

  @property()
  label = '';


  createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  static styles = style;

  render() {
    const classes = {
      'mdc-fab--mini': this.mini,
      'mdc-fab--exited': this.exited,
      'mdc-fab--extended': this.extended,
    };
    const showLabel = this.label !== '' && this.extended;
    return html`
      <button
          .ripple="${ripple()}"
          class="mdc-fab ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}">
        ${showLabel && this.showIconAtEnd ? this.label : ''}
        ${this.icon ? html`<span class="material-icons mdc-fab__icon">${this.icon}</span>` : ''}
        ${showLabel && !this.showIconAtEnd ? this.label : ''}
      </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-fab': Fab;
  }
}