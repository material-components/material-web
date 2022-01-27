/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export class NavigationDrawer extends LitElement {
  /* aria properties */
  @property({attribute: 'aria-describedby', type: String})
  ariaDescribedBy: string|undefined;
  @property({attribute: 'aria-label', type: String})
  override ariaLabel: string = 'navigational drawer';
  @property({attribute: 'aria-modal', type: String})
  override ariaModal: 'true'|'false' = 'false';
  @property({attribute: 'aria-labelledby', type: String})
  ariaLabelledBy: string|undefined;

  @property({type: Boolean}) opened = false;
  @property({type: String}) pivot: 'start'|'end' = 'end';

  /** @soyTemplate */
  override render(): TemplateResult {
    const ariaExpanded = this.opened ? 'true' : 'false';
    const ariaHidden = !this.opened ? 'true' : 'false';

    return html`
      <div
        aria-describedby="${ifDefined(this.ariaDescribedBy)}"
        aria-expanded="${ariaExpanded}"
        aria-hidden="${ariaHidden}"
        aria-label="${this.ariaLabel}"
        aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
        aria-modal="${this.ariaModal}"
        class="md3-navigation-drawer ${this.getRenderClasses()}"
        role="dialog"><div class="md3-elevation-overlay"
        ></div>
        <div class="md3-navigation-drawer__slot-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /** @soyTemplate classMap */
  protected getRenderClasses() {
    return classMap({
      'md3-navigation-drawer--opened': this.opened,
      'md3-navigation-drawer--pivot-at-start': this.pivot === 'start',
    });
  }
}
