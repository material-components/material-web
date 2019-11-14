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

import {ripple, RippleOptions} from './ripple-directive.js';

export class RippleBase extends LitElement {
  @property({type: Boolean}) primary = false;

  @property({type: Boolean}) active: boolean|undefined;

  @property({type: Boolean}) accent = false;

  @property({type: Boolean}) unbounded = false;

  @property({type: Boolean}) disabled = false;

  @property({attribute: false}) protected interactionNode: HTMLElement = this;

  connectedCallback() {
    if (this.interactionNode === this) {
      const parent = this.parentNode as HTMLElement | ShadowRoot | null;
      if (parent instanceof HTMLElement) {
        this.interactionNode = parent;
      } else if (
          parent instanceof ShadowRoot && parent.host instanceof HTMLElement) {
        this.interactionNode = parent.host;
      }
    }
    super.connectedCallback();
  }

  // TODO(sorvell) #css: sizing.
  protected render() {
    const classes = {
      'mdc-ripple-surface--primary': this.primary,
      'mdc-ripple-surface--accent': this.accent,
    };
    const {disabled, unbounded, active, interactionNode} = this;
    const rippleOptions: RippleOptions = {disabled, unbounded, interactionNode};
    if (active !== undefined) {
      rippleOptions.active = active;
    }
    return html`
      <div .ripple="${ripple(rippleOptions)}"
          class="mdc-ripple-surface ${classMap(classes)}"></div>`;
  }
}
