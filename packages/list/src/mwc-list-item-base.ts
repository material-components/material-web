/**
 @license
 Copyright 2020 Google Inc. All Rights Reserved.

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

export type SelectionSource = 'interaction'|'property';
export interface RequestSelectedDetail {
  selected: boolean;
  source: SelectionSource;
}

export type GraphicType = 'avatar'|'icon'|'medium'|'large'|'control'|null;

/**
 * @fires request-selected {RequestSelectedDetail}
 * @fires list-item-rendered
 */
export class ListItemBase extends LitElement {
  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @property({type: String}) value = '';
  @property({type: String, reflect: true}) group: string|null = null;
  @property({type: Number, reflect: true}) tabindex = -1;
  @property({type: Boolean, reflect: true})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.setAttribute('aria-disabled', 'false');
    }
  })
  disabled = false;
  @property({type: Boolean, reflect: true}) twoline = false;
  @property({type: Boolean, reflect: true}) activated = false;
  @property({type: String, reflect: true}) graphic: GraphicType = null;
  @property({type: Boolean}) hasMeta = false;
  @property({type: Boolean, reflect: true})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.removeAttribute('aria-checked');
      this.removeAttribute('mwc-list-item');
      this.selected = false;
      this.activated = false;
      this.tabIndex = -1;
    } else {
      this.setAttribute('mwc-list-item', '');
    }
  })
  noninteractive = false;
  @property({type: Boolean, reflect: true})
  @observer(function(this: ListItemBase, value: boolean) {
    if (value) {
      this.setAttribute('aria-selected', 'true');
    } else {
      this.setAttribute('aria-selected', 'false');
    }

    if (this._firstChanged) {
      this._firstChanged = false;
    } else {
      this.fireRequestSelected(value, 'property');
    }
  })
  selected = false;

  protected boundOnClick = this.onClick.bind(this);
  protected _firstChanged = true;

  get text() {
    const textContent = this.textContent;

    return textContent ? textContent.trim() : '';
  }

  render() {
    const text = this.renderText();
    const graphic = this.graphic ? this.renderGraphic() : html``;
    const meta = this.hasMeta ? this.renderMeta() : html``;

    return html`
      ${graphic}
      ${text}
      ${meta}`;
  }

  protected renderGraphic() {
    return html`
      <span class="mdc-list-item__graphic material-icons">
        <slot name="graphic"></slot>
      </span>`;
  }

  protected renderMeta() {
    return html`
      <span class="mdc-list-item__meta material-icons">
        <slot name="meta"></slot>
      </span>`;
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
    this.fireRequestSelected(!this.selected, 'interaction');
  }

  protected fireRequestSelected(selected: boolean, source: SelectionSource) {
    if (this.noninteractive) {
      return;
    }

    const customEv = new CustomEvent<RequestSelectedDetail>(
        'request-selected',
        {bubbles: true, composed: true, detail: {source, selected}});

    this.dispatchEvent(customEv);
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.noninteractive) {
      this.setAttribute('mwc-list-item', '');
    }
    this.addEventListener('click', this.boundOnClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this.boundOnClick);
  }

  protected firstUpdated() {
    this.dispatchEvent(
        new Event('list-item-rendered', {bubbles: true, composed: true}));
    rippleNode({surfaceNode: this, unbounded: false});
  }
}
