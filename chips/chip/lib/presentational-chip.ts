/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../action/presentational-action.js';

import {html, TemplateResult} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {Chip} from './chip.js';

/** @soyCompatible */
export class PresentationalChip extends Chip {
  /**
   * @soyTemplate
   * @soyAttributes attributes: .md3-chip
   */
  protected override render(): TemplateResult {
    return html`
      <span class="${classMap(this.getRootClasses())}" role="row">
        ${this.renderOverlay()}
        <span class="md3-chip__cell md3-chip__cell--primary" role="gridcell">
          ${this.renderPrimaryAction()}
        </span>
        ${this.renderDeleteAction()}
      </span>`;
  }

  /** @soyTemplate */
  private renderPrimaryAction(): TemplateResult {
    return html`
      <md-presentational-action
          ?disabled=${this.disabled}
          ?isFocusable=${this.isFocusable}
          ?isTouchable=${this.isTouchable}
          .icon=${this.icon}
          .label=${this.label}
          .ariaLabel=${this.ariaLabel}>
      </md-presentational-action>`;
  }
}

