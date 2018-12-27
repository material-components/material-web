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
import { LitElement, html, property, customElement } from '@polymer/lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { lineRipple, LineRippleOptions } from './line-ripple-directive';
import { style } from './mwc-line-ripple-css';

@customElement('mwc-line-ripple' as any)
export class LineRipple extends LitElement {

  @property({ type: Boolean })
  primary = false;

  @property({ type: Boolean })
  active: boolean | undefined;

  @property({ type: Boolean })
  accent = false;

  @property({ type: Boolean })
  disabled = false;

  @property()
  protected rootNode: HTMLElement = this;

  renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: sizing.
  render() {
    const classes = {
      'mdc-line-ripple--primary': this.primary,
      'mdc-line-ripple--accent': this.accent,
    };
    const { disabled, active, rootNode } = this;
    const rippleOptions: LineRippleOptions = { disabled, rootNode };
    
    if (active !== undefined) {
      rippleOptions.active = active;
    }

    return html`
      ${this.renderStyle()}
      <div .lineRipple="${lineRipple(rippleOptions)}" class="mdc-line-ripple ${classMap(classes)}"></div>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-line-ripple': LineRipple;
  }
}
