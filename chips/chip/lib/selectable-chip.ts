/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../action/selectable-action.js';

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {Chip} from './chip.js';

/** @soyCompatible */
export class SelectableChip extends Chip {
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * @soyTemplate
   * @soyAttributes attributes: .md3-chip
   */
  protected override render(): TemplateResult {
    return html`
      <span class="${classMap(this.getRootClasses())}" role="presentation">
        ${this.renderOverlay()}
        ${this.renderPrimaryAction()}
        ${this.renderDeleteAction()}
      </span>`;
  }

  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-chip--with-primary-graphic': true,
      'md3-chip--selectable': true,
      'md3-chip--selected': this.selected,
    };
  }

  /** @soyTemplate */
  private renderPrimaryAction(): TemplateResult {
    return html`
      <md-selectable-action
          ?disabled=${this.disabled}
          ?selected=${this.selected}
          ?isFocusable=${this.isFocusable}
          ?isTouchable=${this.isTouchable}
          .icon=${this.icon}
          .label=${this.label}
          .ariaLabel=${this.ariaLabel}>
      </md-selectable-action>`;
  }
}

