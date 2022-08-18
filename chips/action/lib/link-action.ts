/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';
import {PrimaryAction} from './primary-action';

type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

/** @soyCompatible */
export class LinkAction extends PrimaryAction {
  @property({type: String}) href!: string;

  @property({type: String}) target!: string;

  /**
   * @soyTemplate
   * @soyAttributes linkAttributes: .md3-chip__action
   */
  protected override render(): TemplateResult {
    return html`
      <span class="action-link">
        <a class="${classMap(this.getRootClasses())}"
            aria-label="${ifDefined(this.ariaLabel)}"
            href="${ifDefined(this.href)}"
            target="${ifDefined(this.target as LinkTarget)}"
            tabindex="${this.isFocusable ? 0 : -1}">
          ${this.renderTouchTarget()}
          ${this.renderRipple()}
          ${this.renderFocusRing()}
          ${this.renderGraphic()}
          ${this.renderLabel()}
        </a>
      </span>`;
  }
}
