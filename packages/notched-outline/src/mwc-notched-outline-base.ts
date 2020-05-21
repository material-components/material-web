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
import {BaseElement} from '@material/mwc-base/base-element.js';
import {MDCNotchedOutlineAdapter} from '@material/notched-outline/adapter.js';
import {MDCNotchedOutlineFoundation} from '@material/notched-outline/foundation.js';
import {html, property, query} from 'lit-element';

export class NotchedOutlineBase extends BaseElement {
  @query('.mdc-notched-outline') protected mdcRoot!: HTMLElement;
  protected mdcFoundation!: MDCNotchedOutlineFoundation;

  protected readonly mdcFoundationClass = MDCNotchedOutlineFoundation;

  @property({type: Number}) width = 0;

  @property({type: Boolean, reflect: true}) open = false;

  protected lastOpen = this.open;

  @query('.mdc-notched-outline__notch') protected notchElement!: HTMLDivElement;

  protected createAdapter(): MDCNotchedOutlineAdapter {
    return {
      addClass: (className) => this.mdcRoot.classList.add(className),
      removeClass: (className) => this.mdcRoot.classList.remove(className),
      setNotchWidthProperty: (width) =>
          this.notchElement.style.setProperty('width', `${width}px`),
      removeNotchWidthProperty: () =>
          this.notchElement.style.removeProperty('width'),
    };
  }

  protected openOrClose(shouldOpen: boolean, width?: number) {
    if (!this.mdcFoundation) {
      return;
    }

    if (shouldOpen && width !== undefined) {
      this.mdcFoundation.notch(width);
    } else {
      this.mdcFoundation.closeNotch();
    }
  }

  render() {
    this.openOrClose(this.open, this.width);

    return html`
      <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
  }
}
