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
import {html, LitElement, property} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

export type AspectRatioType = '16-9'|'square'|'';

export class CardMediaBase extends LitElement {
  @property({type: String}) aspectRatio: AspectRatioType = '';

  render() {
    // (zoofadoofa): we may want to support css property for aspectRatio
    // providing an aspect ratio mixin override of the mdc mixin
    const classes = {
      'mdc-card__media--16-9': this.aspectRatio === '16-9',
      'mdc-card__media--square': this.aspectRatio === 'square'
    };
    return html`
      <div class="mdc-card__media ${classMap(classes)}">
        <div class="mdc-card__media-content">
          <slot></slot>
        </div>
      </div>`;
  }
}
