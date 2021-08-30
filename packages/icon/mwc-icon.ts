/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement, html, LitElement, TemplateResult} from 'lit-element';

import {styles} from './mwc-icon-host.css';

/** @soyCompatible */
@customElement('mwc-icon')
export class Icon extends LitElement {
  static override styles = [styles];

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<span><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-icon': Icon;
  }
}
