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
import {BaseElement, html, property, observer, query, customElement, addHasRemoveClass} from '@material/mwc-base/base-element.js';
import {style} from './mwc-linear-progress-css.js';
import MDCLinearProgressFoundation from '@material/linear-progress/foundation.js';
import {MDCLinearProgressAdapter} from '@material/linear-progress/adapter.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-linear-progress': LinearProgress;
  }
}

@customElement('mwc-linear-progress' as any)
export class LinearProgress extends BaseElement {
  protected mdcFoundation!: MDCLinearProgressFoundation;

  protected readonly mdcFoundationClass = MDCLinearProgressFoundation;

  @query('.mdc-linear-progress')
  protected mdcRoot!: HTMLElement

  @query('.mdc-linear-progress__primary-bar')
  protected primaryBar!: HTMLElement

  @query('.mdc-linear-progress__buffer')
  protected bufferElement!: HTMLElement

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgress, value: boolean) {
    this.mdcFoundation.setDeterminate(value);
  })
  determinate = false;

  @property({type: Number})
  @observer(function(this: LinearProgress, value: number) {
    this.mdcFoundation.setProgress(value);
  })
  progress = 0;

  @property({type: Number})
  @observer(function(this: LinearProgress, value: number) {
    this.mdcFoundation.setBuffer(value);
  })
  buffer = 0;

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgress, value: boolean) {
    this.mdcFoundation.setReverse(value);
  })
  reverse = false;

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgress, value: boolean) {
    if (value) {
      this.mdcFoundation.close();
    } else {
      this.mdcFoundation.open();
    }
  })
  closed = false;

  static styles = style;

  render() {
    return html`
      <div role="progressbar" class="mdc-linear-progress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`;
  }

  protected createAdapter(): MDCLinearProgressAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      getPrimaryBar: () => this.primaryBar,
      getBuffer: () => this.bufferElement,
      setStyle: (el: HTMLElement, property: string, value: string) => el.style[property] = value,
    };
  }

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }
}
