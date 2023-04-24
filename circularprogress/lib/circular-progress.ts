/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {ARIAMixinStrict} from '../../types/aria.js';

/**
 * Circular Progress component.
 */
export class CircularProgress extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /**
   * Progress to display, a fraction between 0 and 1.
   */
  @property({type: Number}) progress = 0;


  /**
   * Whether or not to display an animated spinner representing indeterminate
   * progress.
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * Whether or not to render indeterminate mode using 4 colors instead of one.
   *
   */
  @property({type: Boolean, attribute: 'four-color'}) fourColor = false;

  protected override render(): TemplateResult {
    const classes = {
      'indeterminate': this.indeterminate,
      'four-color': this.fourColor
    };

    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div
        class="circular-progress ${classMap(classes)}"
        role="progressbar"
        aria-label="${ariaLabel || nothing}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="${this.indeterminate ? nothing : this.progress}">
        ${
        this.indeterminate ? this.renderIndeterminateContainer() :
                             this.renderDeterminateContainer()}
      </div>
      <slot></slot>`;
  }

  // Determinate mode is rendered with an svg so the progress arc can be
  // easily animated via stroke-dashoffset.
  protected renderDeterminateContainer() {
    const dashOffset = (1 - this.progress) * 100;
    // note, dash-array/offset are relative to Setting `pathLength` but
    // Chrome seems to render this inaccurately and using a large viewbox helps.
    const pathLength = 100;
    return html`<svg viewBox="0 0 4800 4800">
      <circle class="track" pathLength="${pathLength}"></circle>
      <circle class="progress" pathLength="${pathLength}" stroke-dashoffset="${
        dashOffset}"></circle>
    </svg>`;
  }

  // Indeterminate mode rendered with 2 bordered-divs. The borders are
  // clipped into half circles by their containers. The divs are then carefully
  // animated to produce changes to the spinner arc size.
  // This approach has 4.5x the FPS of rendering via svg on Chrome 111.
  // See https://lit.dev/playground/#gist=febb773565272f75408ab06a0eb49746.
  protected renderIndeterminateContainer() {
    return html`
      <div class="spinner">
        <div class="left">
          <div class="circle"></div>
        </div>
        <div class="right">
          <div class="circle"></div>
        </div>
      </div>`;
  }
}
