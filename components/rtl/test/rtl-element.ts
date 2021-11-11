/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement} from 'lit';
import {customElement, query} from 'lit/decorators';

import {RTLController} from '../rtl-controller';

import {styles} from './rtl-element.css';

declare global {
  interface HTMLElementTagNameMap {
    'rtl-element': RTLElement;
  }
}

@customElement('rtl-element')
export class RTLElement extends LitElement {
  static override styles = [styles];

  @query('.test') testElement!: HTMLElement;

  rtlController = new RTLController(this);

  override connectedCallback() {
    super.connectedCallback();
    this.rtlController.connect();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.rtlController.disconnect();
  }

  override render() {
    return html`<div class="test">Test</div>`;
  }
}