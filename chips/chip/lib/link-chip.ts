/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import '@material/web/chips/action.js';
import '../../action/link-action.js';

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {Chip} from './chip.js';

/** @soyCompatible */
export class LinkChip extends Chip {
  @property({type: String}) href!: string;

  @property({type: String}) target!: string;

  /**
   * @soyTemplate
   * @soyAttributes attributes: .md3-chip
   * @soyAttributes linkAttributes: .md3-chip__action
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
      <md-link-action
          ?disabled=${this.disabled}
          ?isFocusable=${this.isFocusable}
          ?isTouchable=${this.isTouchable}
          .icon=${this.icon}
          .label=${this.label}
          .ariaLabel=${this.ariaLabel}
          .href=${this.href}
          .target=${this.target}>
      </md-link-action>`;
  }
}
