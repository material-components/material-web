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
import {BaseElement, html, property, query, observer} from '@material/mwc-base/form-element.js';
import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCFloatingLabelAdapter} from '@material/floating-label/adapter.js';

declare global {
  interface Window {
    _labelNumber?: number
  }
}

if (!window._labelNumber) {
  window._labelNumber = 0;
}

const findOwnerDocument = (node: Node): null | Document | DocumentFragment => {
  let currentNode: Node | null = node;
  while(currentNode &&
      !(currentNode instanceof DocumentFragment ||
      currentNode instanceof Document)) {
    currentNode = currentNode.parentNode;
  }

  return currentNode as null | Document | DocumentFragment;
}

export class FloatingLabelBase extends BaseElement {
  protected mdcFoundation!: MDCFloatingLabelFoundation;
  protected readonly mdcFoundationClass = MDCFloatingLabelFoundation;

  @query('label')
  protected mdcRoot!: HTMLElement;

  @property({type: String})
  label: string = '';

  @property({type: String})
  @observer(function(this: FloatingLabelBase, value: string) {
    if (this.forElement) {
      this.forElement.removeAttribute('aria-labelledby');
    }

    const ownerDoc = findOwnerDocument(this);

    if (!ownerDoc) {
      return;
    }

    this.forElement = value ? ownerDoc.querySelector(`#${value}`) : null;

    if (this.forElement) {
      this.forElement.setAttribute('aria-labelledby', value);
    }
  })
  for: string = '';

  @query('.mdc-floating-label')
  protected labelElement!: HTMLElement;

  protected forElement: HTMLElement|null = null;
  protected labelId: string = `mwc-floating-label-${window._labelNumber!++}`;

  protected createAdapter(): MDCFloatingLabelAdapter {
    return {
      addClass: className => this.classList.add(className),
      removeClass: className => this.classList.remove(className),
      getWidth: () => this.scrollWidth,
      registerInteractionHandler: (evtType, handler) => {this.labelElement.addEventListener(evtType, handler)},
      deregisterInteractionHandler: (evtType, handler) => {this.labelElement.removeEventListener(evtType, handler)},
    }
  }

  protected createFoundation() {
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
  }

  float(shouldFloat: boolean) {
    this.mdcFoundation.float(shouldFloat);
  }

  getWidth() {
    return this.mdcFoundation.getWidth();
  }

  shake(shouldShake: boolean) {
    this.mdcFoundation.shake(shouldShake);
  }

  protected clickHandler() {
    if (this.forElement) {
      this.forElement.click();
    }
  }

  render() {
    return html`
      <label
          id="${this.labelId}"
          @click=${this.clickHandler}>
        ${this.label}
      </label>`;
  }
}