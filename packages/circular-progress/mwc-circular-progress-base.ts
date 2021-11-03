/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {ariaProperty} from '@material/mwc-base/aria-property';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {styleMap} from 'lit/directives/style-map.js';

/** @soyCompatible */
export class CircularProgressBase extends LitElement {
  @property({type: Boolean, reflect: true}) indeterminate = false;

  @property({type: Number, reflect: true}) progress = 0;

  @property({type: Number, reflect: true}) density = 0;

  @property({type: Boolean, reflect: true}) closed = false;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }

  /**
   * @soyTemplate
   */
  protected override render(): TemplateResult {
    /** @classMap */
    const classes = {
      'mdc-circular-progress--closed': this.closed,
      'mdc-circular-progress--indeterminate': this.indeterminate,
    };

    const containerSideLength = 48 + this.density * 4;
    /** @styleMap */
    const styles = {
      'width': `${containerSideLength}px`,
      'height': `${containerSideLength}px`,
    };

    return html`
      <div
        class="mdc-circular-progress ${classMap(classes)}"
        style="${styleMap(styles)}"
        role="progressbar"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="${
        ifDefined(this.indeterminate ? undefined : this.progress)}">
        ${this.renderDeterminateContainer()}
        ${this.renderIndeterminateContainer()}
      </div>`;
  }

  /**
   * @soyTemplate
   */
  protected renderDeterminateContainer(): TemplateResult {
    const sideLength = 48 + this.density * 4;
    const center = sideLength / 2;
    const circleRadius = this.density >= -3 ? 18 + this.density * 11 / 6 :
                                              12.5 + (this.density + 3) * 5 / 4;
    const circumference = 2 * 3.1415926 * circleRadius;
    const determinateStrokeDashOffset = (1 - this.progress) * circumference;
    const strokeWidth = this.density >= -3 ? 4 + this.density * (1 / 3) :
                                             3 + (this.density + 3) * (1 / 6);

    return html`
      <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic"
             viewBox="0 0 ${sideLength} ${sideLength}">
          <circle class="mdc-circular-progress__determinate-track"
                  cx="${center}" cy="${center}" r="${circleRadius}"
                  stroke-width="${strokeWidth}"></circle>
          <circle class="mdc-circular-progress__determinate-circle"
                  cx="${center}" cy="${center}" r="${circleRadius}"
                  stroke-dasharray="${2 * 3.1415926 * circleRadius}"
                  stroke-dashoffset="${determinateStrokeDashOffset}"
                  stroke-width="${strokeWidth}"></circle>
        </svg>
      </div>`;
  }

  /**
   * @soyTemplate
   */
  protected renderIndeterminateContainer(): TemplateResult {
    return html`
      <div class="mdc-circular-progress__indeterminate-container">
        <div class="mdc-circular-progress__spinner-layer">
          ${this.renderIndeterminateSpinnerLayer()}
        </div>
      </div>`;
  }

  /**
   * @soyTemplate
   */
  protected renderIndeterminateSpinnerLayer(): TemplateResult {
    const sideLength = 48 + this.density * 4;
    const center = sideLength / 2;
    const circleRadius = this.density >= -3 ? 18 + this.density * 11 / 6 :
                                              12.5 + (this.density + 3) * 5 / 4;
    const circumference = 2 * 3.1415926 * circleRadius;
    const halfCircumference = 0.5 * circumference;
    const strokeWidth = this.density >= -3 ? 4 + this.density * (1 / 3) :
                                             3 + (this.density + 3) * (1 / 6);

    return html`
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${sideLength} ${sideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${strokeWidth}"></circle>
          </svg>
        </div>
        <div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${sideLength} ${sideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${strokeWidth * 0.8}"></circle>
          </svg>
        </div>
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${sideLength} ${sideLength}">
            <circle cx="${center}" cy="${center}" r="${circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${strokeWidth}"></circle>
          </svg>
        </div>`;
  }

  override update(changedProperties: Map<string, string>) {
    super.update(changedProperties);

    // Bound progress value in interval [0, 1].
    if (changedProperties.has('progress')) {
      if (this.progress > 1) {
        this.progress = 1;
      }

      if (this.progress < 0) {
        this.progress = 0;
      }
    }
  }
}
