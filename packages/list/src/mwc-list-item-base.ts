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

import {observer} from '@material/mwc-base/observer';
import {rippleNode} from '@material/mwc-ripple/ripple-directive';
import {html, LitElement, property, query} from 'lit-element';

export interface RequestSelectedDetail {
  selected: boolean;
  hasCheckboxOrRadio: boolean;
}

/**
 * @emits request-selected
 */
export class ListItemBase extends LitElement {
  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @property({type: String}) value = '';
  @property({type: Number, reflect: true}) tabindex = -1;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) twoline = false;

  @property({type: Boolean, reflect: true})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-selected', 'true');
    } else {
      this.setAttribute('aria-selected', 'false');
    }
  })
  selected = false;

  protected boundOnClick = this.onClick.bind(this);

  get text() {
    const textContent = this.textContent;

    return textContent ? textContent.trim() : '';
  }

  render() {
    return this.renderText();
  }

  protected renderText() {
    const inner = this.twoline ? this.renderTwoline() : this.renderSingleLine();
    return html`
      <span class="mdc-list-item__text">
        ${inner}
      </span>`;
  }

  protected renderSingleLine() {
    return html`<slot></slot>`;
  }

  protected renderTwoline() {
    return html`
      <span class="mdc-list-item__primary-text">
        <slot></slot>
      </span>
      <span class="mdc-list-item__secondary-text">
        <slot name="secondary"></slot>
      </span>
    `;
  }

  protected onClick() {
    const customEv =
        new CustomEvent<RequestSelectedDetail>('request-selected', {
          bubbles: true,
          composed: true,
          detail: {hasCheckboxOrRadio: false, selected: !this.selected}
        });

    this.dispatchEvent(customEv);
  }

  connectedCallback() {
    super.connectedCallback();

    this.toggleAttribute('mwc-list-item', true);
    this.addEventListener('click', this.boundOnClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this.boundOnClick);
  }

  firstUpdated() {
    this.dispatchEvent(
        new Event('list-item-rendered', {bubbles: true, composed: true}));

    rippleNode({surfaceNode: this});
  }
}
