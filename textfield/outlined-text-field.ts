/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/field/outlined-field';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

// TODO(b/236285090): update with HCM best practices
import {styles as outlinedForcedColorsStyles} from './lib/outlined-forced-colors-styles.css';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {OutlinedTextField} from './lib/outlined-text-field';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-text-field': MdOutlinedTextField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-text-field')
export class MdOutlinedTextField extends OutlinedTextField {
  static override styles =
      [sharedStyles, outlinedStyles, outlinedForcedColorsStyles];

  /** @soyTemplate */
  protected override renderField(): TemplateResult {
    return html`
      <md-outlined-field
        class="md3-text-field__field"
        ?disabled=${this.disabled}
        ?error=${this.error}
        ?hasEnd=${this.hasTrailingIcon}
        ?hasStart=${this.hasLeadingIcon}
        .label=${this.label}
        ?populated=${!!this.value}
        ?required=${this.required}
      >
        ${this.renderLeadingIcon()}
        ${this.renderFieldContent()}
        ${this.renderTrailingIcon()}
        ${this.renderSupportingText()}
      </md-outlined-field>
    `;
  }
}
