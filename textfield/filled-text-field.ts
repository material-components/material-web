/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/field/filled-field';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

// TODO(b/236285090): update with HCM best practices
import {styles as filledForcedColorsStyles} from './lib/filled-forced-colors-styles.css';
import {styles as filledStyles} from './lib/filled-styles.css';
import {FilledTextField} from './lib/filled-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-text-field': MdFilledTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-text-field')
export class MdFilledTextField extends FilledTextField {
  static override styles =
      [sharedStyles, filledStyles, filledForcedColorsStyles];

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    // TODO(b/239690585): move start/end slots to renderFieldContent
    return html`
      <md-filled-field
        class="md3-text-field__field"
        ?disabled=${this.disabled}
        ?error=${this.error}
        ?hasEnd=${this.hasTrailingIcon}
        ?hasStart=${this.hasLeadingIcon}
        .label=${this.label}
        ?populated=${!!this.value}
        ?required=${this.required}
      >
        <span slot="start">
          ${this.renderLeadingIcon()}
        </span>
        ${this.renderFieldContent()}
        <span slot="end">
          ${this.renderTrailingIcon()}
        </span>
      </md-filled-field>
    `;
  }
}
