/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {html, internalProperty, LitElement, property} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';
import {styleMap} from 'lit-html/directives/style-map';

/** @soyCompatible */
export class CircularProgressBase extends LitElement {
  @property({type: Boolean, reflect: true}) indeterminate = false;

  @property({type: Number, reflect: true}) progress = 0;

  @property({type: Number, reflect: true}) density = 0;

  @property({type: Boolean, reflect: true}) closed = false;

  @property({type: String}) ariaLabel = '';

  @internalProperty() containerSideLength = 0;

  @internalProperty() circleRadius = 0;

  @internalProperty() determinateStrokeDashOffset = 0;

  @internalProperty() strokeWidth = 0;

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }

  /**
   * @soyCompatible
   */
  protected render() {
    /** @classMap */
    const classes = {
      'mdc-circular-progress--closed': this.closed,
      'mdc-circular-progress--indeterminate': this.indeterminate,
    };

    const styles = {
      'width': `${this.containerSideLength}px`,
      'height': `${this.containerSideLength}px`,
    };

    return html`
      <div
        class="mdc-circular-progress ${classMap(classes)}"
        style="${styleMap(styles)}"
        role="progressbar"
        aria-label="${this.ariaLabel}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="${
        ifDefined(this.indeterminate ? undefined : this.progress)}">
        ${this.renderDeterminateContainer()}
        ${this.renderIndeterminateContainer()}
      </div>`;
  }

  /**
   * @soyCompatible
   */
  private renderDeterminateContainer() {
    const center = this.containerSideLength / 2;

    return html`
      <div class="mdc-circular-progress__determinate-container">
        <svg class="mdc-circular-progress__determinate-circle-graphic"
             viewBox="0 0 ${this.containerSideLength} ${
        this.containerSideLength}">
          <circle class="mdc-circular-progress__determinate-circle"
                  cx="${center}" cy="${center}" r="${this.circleRadius}"
                  stroke-dasharray="${2 * 3.1415926 * this.circleRadius}"
                  stroke-dashoffset="${this.determinateStrokeDashOffset}"
                  stroke-width="${this.strokeWidth}"></circle>
        </svg>
      </div>`;
  }

  /**
   * @soyCompatible
   */
  protected renderIndeterminateContainer() {
    return html`
      <div class="mdc-circular-progress__indeterminate-container">
        ${this.renderIndeterminateSpinnerLayer()}
      </div>`;
  }

  /**
   * @soyCompatible
   */
  protected renderIndeterminateSpinnerLayer(classes = '') {
    const center = this.containerSideLength / 2;
    const circumference = 2 * 3.1415926 * this.circleRadius;
    const halfCircumference = 0.5 * circumference;

    return html`
      <div class="mdc-circular-progress__spinner-layer ${classes}">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${this.containerSideLength} ${
        this.containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${this.circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${this.strokeWidth}"></circle>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${this.containerSideLength} ${
        this.containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${this.circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${this.strokeWidth * 0.8}"></circle>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic"
               viewBox="0 0 ${this.containerSideLength} ${
        this.containerSideLength}">
            <circle cx="${center}" cy="${center}" r="${this.circleRadius}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${halfCircumference}"
                    stroke-width="${this.strokeWidth}"></circle>
          </svg>
        </div>
      </div>`;
  }

  update(changedProperties: Map<string, string>) {
    super.update(changedProperties);

    this.containerSideLength = this.getContainerSideLength();
    this.circleRadius = this.getCircleRadius();
    this.determinateStrokeDashOffset = this.getDeterminateStrokeDashOffset();
    this.strokeWidth = this.getStrokeWidth();

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

  private getContainerSideLength() {
    return 48 + this.density * 4;
  }

  private getDeterminateStrokeDashOffset(): number {
    const circleRadius = this.getCircleRadius();
    const circumference = 2 * 3.1415926 * circleRadius;

    return (1 - this.progress) * circumference;
  }

  private getCircleRadius() {
    return this.density >= -3 ? 18 + this.density * 11 / 6 :
                                12.5 + (this.density + 3) * 5 / 4;
  }

  private getStrokeWidth() {
    return this.density >= -3 ? 4 + this.density * (1 / 3) :
                                3 + (this.density + 3) * (1 / 6);
  }
}
