/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ariaProperty as legacyAriaProperty} from '@material/mwc-base/aria-property';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export class TabPanel extends LitElement {
  @property({type: Boolean, reflect: true, attribute: 'active'}) active = false;

  /** @soyPrefixAttribute */
  // TODO(b/229296098): Use M3 ariaProperty decorator.
  @legacyAriaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy!: string;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
    <div role="tabpanel"
    aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
    class="md3-tab-panel ${classMap(this.getRenderClasses())}">
      <slot></slot>
    </div>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-tab-panel--active': this.active,
    };
  }
}