/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../elevation/elevation.js';

import {html, LitElement, nothing, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

/**
 * b/265346501 - add docs
 *
 * @fires navigation-drawer-changed {CustomEvent<{opened: boolean}>}
 * Dispatched whenever the drawer opens or closes --bubbles --composed
 */
export class NavigationDrawer extends LitElement {
  static {
    requestUpdateOnAriaChange(NavigationDrawer);
  }

  @property({type: Boolean}) opened = false;
  @property() pivot: 'start' | 'end' = 'end';

  protected override render() {
    const ariaExpanded = this.opened ? 'true' : 'false';
    const ariaHidden = !this.opened ? 'true' : 'false';
    // Needed for closure conformance
    const {ariaLabel, ariaModal} = this as ARIAMixinStrict;
    return html`
      <div
        aria-expanded="${ariaExpanded}"
        aria-hidden="${ariaHidden}"
        aria-label=${ariaLabel || nothing}
        aria-modal="${ariaModal || nothing}"
        class="md3-navigation-drawer ${this.getRenderClasses()}"
        role="dialog">
        <md-elevation part="elevation"></md-elevation>
        <div class="md3-navigation-drawer__slot-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private getRenderClasses() {
    return classMap({
      'md3-navigation-drawer--opened': this.opened,
      'md3-navigation-drawer--pivot-at-start': this.pivot === 'start',
    });
  }

  protected override updated(
    changedProperties: PropertyValues<NavigationDrawer>,
  ) {
    if (changedProperties.has('opened')) {
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('navigation-drawer-changed', {
            detail: {opened: this.opened},
            bubbles: true,
            composed: true,
          }),
        );
      }, 250);
    }
  }
}
