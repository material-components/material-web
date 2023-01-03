/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property.js';

/** @soyCompatible */
export class NavigationDrawer extends LitElement {
  /* aria properties */
  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property(
      {type: String, attribute: 'data-aria-describedby', noAccessor: true})
  ariaDescribedBy: string|undefined;

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({attribute: 'data-aria-modal', type: String, noAccessor: true})
  override ariaModal: 'true'|'false' = 'false';

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({type: String, attribute: 'data-aria-labelledby', noAccessor: true})
  ariaLabelledBy: string|undefined;

  @property({type: Boolean})  // tslint:disable-next-line:no-new-decorators
  opened = false;
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
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
        aria-modal="${this.ariaModal}"
        class="md3-navigation-drawer ${this.getRenderClasses()}"
        role="dialog">
        <md-elevation shadow surface></md-elevation>
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

  protected override updated(changedProperties:
                                 PropertyValues<NavigationDrawer>) {
    if (changedProperties.has('opened')) {
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent(
            'navigation-drawer-changed',
            {detail: {opened: this.opened}, bubbles: true, composed: true}));
      }, 250);
    }
  }
}
