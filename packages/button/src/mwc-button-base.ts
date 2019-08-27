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
import {classMap, html, LitElement, property} from '@material/mwc-base/base-element';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {CssClasses} from './mwc-button-constant';

export class ButtonBase extends LitElement {
  @property({type: Boolean}) raised = false;

  @property({type: Boolean}) unelevated = false;

  @property({type: Boolean}) outlined = false;

  @property({type: Boolean}) dense = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean}) trailingIcon = false;

  @property({type: String}) href = '';

  @property() icon = '';

  @property() label = '';

  private renderChildren() {
    const iconLabel = this.icon;
    const icon = html`
      <span class="material-icons ${CssClasses.ICON}">
        ${iconLabel}
      </span>
    `;
    return html`
      ${iconLabel && !this.trailingIcon ? icon : ''}
      <span class="${CssClasses.LABEL}">${this.label}</span>
      ${iconLabel && this.trailingIcon ? icon : ''}
      <slot></slot>
    `;
  }

  protected createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  get classes() {
    return classMap({
      [CssClasses.ROOT]: true,
      [CssClasses.RAISED]: this.raised,
      [CssClasses.UNELEVATED]: this.unelevated,
      [CssClasses.OUTLINED]: this.outlined,
      [CssClasses.DENSE]: this.dense,
    });
  }

  get ariaLabel() {
    return this.label || this.icon;
  }

  protected render() {
    const boundedRipple = ripple({unbounded: false});

    return this.href ? (html`
        <a
          .ripple="${boundedRipple}"
          class="${this.classes}"
          href="${this.disabled ? '' : this.href}"
          aria-label="${this.ariaLabel}"
        >
          ${this.renderChildren()}
        </a>
      `) :
                       (html`
        <button
          .ripple="${boundedRipple}"
          class="${this.classes}"
          ?disabled="${this.disabled}"
          aria-label="${this.ariaLabel}"
        >
          ${this.renderChildren()}
        </button>
      `);
  }
}
