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
export class NavigationDrawerModal extends LitElement {
  /* aria properties */
  @property({attribute: 'aria-describedby', type: String})
  ariaDescribedBy: string|undefined;
  @property({attribute: 'aria-label', type: String})
  override ariaLabel: string|undefined;
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
        class="md3-navigation-drawer-modal__frame ${this.getFrameClasses()}"
        @keydown="${this.handleKeyDown}"
        role="dialog">
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
  protected getFrameClasses() {
    return classMap({
      'md3-navigation-drawer-modal--closed-to-opened': this.opened,
      'md3-navigation-drawer-modal--pivot-at-start': this.pivot === 'start',
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      this.opened = false;
    }
  }

  private handleScrimClick(e: MouseEvent) {
    this.opened = !this.opened;
  }
}
