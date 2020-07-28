/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

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
import {MDCLinearProgressAdapter} from '@material/linear-progress/adapter';
import MDCLinearProgressFoundation from '@material/linear-progress/foundation';
import {BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {html, internalProperty, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {styleMap} from 'lit-html/directives/style-map';

/** @soyCompatible */
export class LinearProgressBase extends BaseElement {
  protected mdcFoundation!: MDCLinearProgressFoundation;

  protected readonly mdcFoundationClass = MDCLinearProgressFoundation;

  @query('.mdc-linear-progress') protected mdcRoot!: HTMLElement;

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgressBase, value: boolean) {
    this.mdcFoundation.setDeterminate(!value);
  })
  indeterminate = false;

  @property({type: Number})
  @observer(function(this: LinearProgressBase, value: number) {
    this.mdcFoundation.setProgress(value);
  })
  progress = 0;

  @property({type: Number})
  @observer(function(this: LinearProgressBase, value: number) {
    this.mdcFoundation.setBuffer(value);
  })
  buffer = 1;

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgressBase, value: boolean) {
    this.mdcFoundation.setReverse(value);
  })
  reverse = false;

  @property({type: Boolean, reflect: true}) closed = false;

  @property() ariaLabel = '';

  @internalProperty() protected bufferFlexBasisValue = '';

  @internalProperty() protected primaryTransformValue = '';

  /**
   * @soyCompatible
   */
  protected render() {
    /** @classMap */
    const classes = {
      'mdc-linear-progress--closed': this.closed,
      'mdc-linear-progress--indeterminate': this.indeterminate,
      'mdc-linear-progress--reversed': this.reverse,
    };

    const bufferBarStyles = {
      'flex-basis': this.bufferFlexBasisValue,
    };

    const primaryBarStyles = {
      transform: this.primaryTransformValue,
    };

    return html`
      <div
          role="progressbar"
          class="mdc-linear-progress ${classMap(classes)}"
          aria-label="${this.ariaLabel}"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow="0">
        <div class="mdc-linear-progress__buffer">
          <div
            class="mdc-linear-progress__buffer-bar"
            style=${styleMap(bufferBarStyles)}>
          </div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div
            class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
            style=${styleMap(primaryBarStyles)}>
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`;
  }

  protected createAdapter(): MDCLinearProgressAdapter {
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      hasClass: (name: string) => {
        return this.mdcRoot.classList.contains(name);
      },
      forceLayout: () => this.mdcRoot.offsetWidth,
      removeAttribute: (name: string) => {
        this.mdcRoot.removeAttribute(name);
      },
      setAttribute: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      setBufferBarStyle: (_property: string, value: string) => {
        this.bufferFlexBasisValue = value;
      },
      setPrimaryBarStyle: (_property: string, value: string) => {
        this.primaryTransformValue = value;
      },
    };
  }

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }
}
