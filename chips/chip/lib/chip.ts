/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../elevation/elevation.js';
import '../../action/delete-action.js';

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {ActionElement} from '../../../actionelement/action-element.js';
import {ariaProperty} from '../../../decorators/aria-property.js';

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

  @property({type: Boolean, reflect: true}) hasDeleteAction = false;

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
      'md3-chip--with-delete-action': this.hasDeleteAction,
    };
  }

  /** @soyTemplate */
  protected renderOverlay(): TemplateResult {
    return this.borderType === BorderType.ELEVATED ?
        html`<md-elevation aria-hidden="true" shadow surface></md-elevation>` :
        html``;
  }

  /** @soyTemplate */
  protected renderDeleteAction(): TemplateResult {
    if (!this.hasDeleteAction) {
      return html``;
    } else {
      return html`
        <span class="md3-chip__cell md3-chip__cell--delete"
              role="gridcell">
          <md-delete-action
            ?disabled=${this.disabled}
            ?isFocusable=${this.isFocusable}
            ?isTouchable=${this.isTouchable}
            .ariaLabel=${this.closeActionAriaLabel}>
          </md-delete-action>
        </span>`;
    }
  }
}
