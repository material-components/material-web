/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';
import {PrimaryAction} from './primary-action';

/** @soyCompatible */
export class PresentationalAction extends PrimaryAction {

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <span class="${classMap(this.getRootClasses())}"
          aria-label="${ifDefined(this.ariaLabel)}"
          role="presentation">
        ${this.renderGraphic()}
        ${this.renderLabel()}
      </span>`;
  }

  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-chip__action--presentational': true,
    };
  }
}
