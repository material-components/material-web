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
import {BaseElement, html, property, query} from '@material/mwc-base/form-element.js';
import {MDCNotchedOutlineAdapter} from '@material/notched-outline/adapter.js';
import {MDCNotchedOutlineFoundation} from '@material/notched-outline/foundation.js';


export class NotchedOutlineBase extends BaseElement {
  @query('.mdc-notched-outline') protected mdcRoot!: HTMLElement;
  protected mdcFoundation!: MDCNotchedOutlineFoundation;

  protected readonly mdcFoundationClass = MDCNotchedOutlineFoundation;

  @property({type: Number}) width: number = 0;

  @property({type: Boolean, reflect: true}) open: boolean = false;

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
    if (this.open !== this.lastOpen) {
      // workaround for possible bug in foundation causing recalculation
      this.lastOpen = this.open;
      this.openOrClose(this.open, this.width);
    }

    return html`
      <div class="mdc-notched-outline">
        <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch">
          <slot></slot>
        </div>
        <div class="mdc-notched-outline__trailing"></div>
      </div>`;
  }
}
