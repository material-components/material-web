/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO(b/231221156): remove compat dependencies
import {AnyDuringAriaMigration, ariaProperty as legacyAriaProperty} from '@material/web/compat/base/aria-property.js';
import {observer} from '@material/web/compat/base/observer.js';
import {ariaProperty} from '@material/web/decorators/aria-property.js';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

/** @soyCompatible */
export class NavigationDrawerModal extends LitElement {
  /* aria properties */
  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @legacyAriaProperty
  @property({type: String, attribute: 'aria-describedby'})
  ariaDescribedBy: string|undefined;

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel: string|AnyDuringAriaMigration;

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({attribute: 'data-aria-modal', type: String, noAccessor: true})
  override ariaModal: 'true'|'false' = 'false';

  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @legacyAriaProperty
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy: string|undefined;

  @property({type: Boolean})  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: NavigationDrawerModal, value: boolean) {
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent(
          'navigation-drawer-changed',
          {detail: {opened: value}, bubbles: true, composed: true}));
    }, 250);
  })
  opened = false;
  @property({type: String}) pivot: 'start'|'end' = 'end';

  /** @soyTemplate */
  override render(): TemplateResult {
    const ariaExpanded = this.opened ? 'true' : 'false';
    const ariaHidden = !this.opened ? 'true' : 'false';

    return html`
      <div
        class="md3-navigation-drawer-modal__scrim ${this.getScrimClasses()}"
        @click="${this.handleScrimClick}">
      </div>
      <div
        aria-describedby="${ifDefined(this.ariaDescribedBy)}"
        aria-expanded="${ariaExpanded}"
        aria-hidden="${ariaHidden}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
        aria-modal="${this.ariaModal}"
        class="md3-navigation-drawer-modal ${this.getRenderClasses()}"
        @keydown="${this.handleKeyDown}"
        role="dialog"><div class="md3-elevation-overlay"
        ></div>
        <div class="md3-navigation-drawer-modal__slot-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  /** @soyTemplate classMap */
  protected getScrimClasses() {
    return classMap({
      'md3-navigation-drawer-modal--scrim-visible': this.opened,
    });
  }

  /** @soyTemplate classMap */
  protected getRenderClasses() {
    return classMap({
      'md3-navigation-drawer-modal--opened': this.opened,
      'md3-navigation-drawer-modal--pivot-at-start': this.pivot === 'start',
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      this.opened = false;
    }
  }

  private handleScrimClick() {
    this.opened = !this.opened;
  }
}
