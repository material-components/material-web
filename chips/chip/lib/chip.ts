/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../action/trailing-action.js';

import {ActionElement} from '@material/web/actionelement/action-element.js';
import {ariaProperty} from '@material/web/decorators/aria-property.js';
import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

/** Defines the border type of a chip. */
export enum BorderType {
  ELEVATED = 'ELEVATED',
  HAIRLINE = 'HAIRLINE',
}

/** Defines the shape of the vertical edge of a chip. */
export enum EdgeType {
  ROUNDED = 'ROUNDED',
  STRAIGHT = 'STRAIGHT',
}

/** @soyCompatible */
export abstract class Chip extends ActionElement {
  @property({type: Boolean, reflect: true}) isFocusable = false;

  @property({type: Boolean, reflect: true}) isTouchable = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean, reflect: true}) hasAvatar = false;

  @property({type: Boolean, reflect: true}) hasTrailingAction = false;

  @property({type: Boolean, reflect: true}) hasNavigableTrailingAction = false;

  @property({type: String}) icon = '';

  @property({type: String}) label = '';

  @property({type: String}) borderType = BorderType.HAIRLINE;

  @property({type: String}) edgeType = EdgeType.ROUNDED;

  @property({type: String}) addedAnnouncement = '';

  @property({type: String}) removedAnnouncement = '';

  @property({type: String}) closeActionAriaLabel = '';

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyTemplate */
  protected getRootClasses(): ClassInfo {
    const hasIcon = this.icon.trim().length > 0;
    return {
      'md3-chip': true,
      'md3-chip--disabled': this.disabled,
      'md3-chip--touch': this.isTouchable,
      'md3-chip--with-primary-graphic': hasIcon,
      'md3-chip--with-primary-icon': hasIcon,
      'md3-chip--with-avatar': this.hasAvatar,
      'md3-chip--with-trailing-action': this.hasTrailingAction,
    };
  }

  /** @soyTemplate */
  protected renderOverlay(): TemplateResult {
    return this.borderType === BorderType.ELEVATED ?
        html`<div class="md3-elevation-overlay" aria-hidden="true"></div>` :
        html``;
  }

  /** @soyTemplate */
  protected renderTrailingAction(): TemplateResult {
    if (!this.hasTrailingAction) {
      return html``;
    } else {
      const trailingAction = html`
        <md-trailing-action
            ?disabled=${this.disabled}
            ?isFocusable=${this.isFocusable}
            ?isTouchable=${this.isTouchable}
            ?isNavigable=${this.hasNavigableTrailingAction}
            .ariaLabel=${this.closeActionAriaLabel}>
        </md-trailing-action>`;

      return this.hasNavigableTrailingAction ?
          html`
            <span class="md3-chip__cell md3-chip__cell--trailing"
                  role="gridcell">
              ${trailingAction}
            </span>` :
          trailingAction;
    }
  }
}
