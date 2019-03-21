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
import { LitElement, html, property, customElement, classMap } from '@material/mwc-base/base-element';
import { style } from './mwc-card-media-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-card-media': CardMedia;
  }
}

@customElement('mwc-card-media' as any)
export class CardMedia extends LitElement {

  @property({type: String})
  aspectRatio = '';

  static styles = style;

  render() {
    // (zoofadoofa): we may want to support css property for aspectRatio
    // providing an aspect ratio mixin override of the mdc mixin
    const classes = {
      'mdc-card__media': true,
      'mdc-card__media--16-9': this.aspectRatio === '16-9',
      'mdc-card__media--square': this.aspectRatio === 'square'
    };
    return html`
      <div class="${classMap(classes)}">
        <div class="mdc-card__media-content">
          <slot></slot>
        </div>
      </div>`;
  }

}