/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * A progress component.
 */
export abstract class Progress extends LitElement {
  static {
    requestUpdateOnAriaChange(Progress);
  }

  /**
   * Progress to display, a fraction between 0 and `max`.
   */
  @property({type: Number}) value = 0;

  /**
   * Maximum progress to display, defaults to 1.
   */
  @property({type: Number}) max = 1;

  /**
   * Whether or not to display indeterminate progress, which gives no indication
   * to how long an activity will take.
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * Whether or not to render indeterminate mode using 4 colors instead of one.
   */
  @property({type: Boolean, attribute: 'four-color'}) fourColor = false;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div
        class="progress ${classMap(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${ariaLabel || nothing}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? nothing : this.value}
        >${this.renderIndicator()}</div
      >
    `;
  }

  protected getRenderClasses() {
    return {
      'indeterminate': this.indeterminate,
      'four-color': this.fourColor,
    };
  }

  protected abstract renderIndicator(): TemplateResult;
}
