/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement, html, LitElement, TemplateResult} from 'lit-element';

import {style} from './mwc-icon-host-css';

/** @soyCompatible */
@customElement('mwc-icon')
export class Icon extends LitElement {
  static styles = style;

  /** @soyTemplate */
  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-icon': Icon;
  }
}
