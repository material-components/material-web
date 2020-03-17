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
import {MDCLinearProgressAdapter} from '@material/linear-progress/adapter.js';
import MDCLinearProgressFoundation from '@material/linear-progress/foundation.js';
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {html, property, query} from 'lit-element';

export class LinearProgressBase extends BaseElement {
  protected mdcFoundation!: MDCLinearProgressFoundation;

  protected readonly mdcFoundationClass = MDCLinearProgressFoundation;

  @query('.mdc-linear-progress') protected mdcRoot!: HTMLElement;

  @query('.mdc-linear-progress__primary-bar')
  protected primaryBar!: HTMLElement;

  @query('.mdc-linear-progress__buffer-bar')
  protected bufferElement!: HTMLElement;

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

  @property({type: Boolean, reflect: true})
  @observer(function(this: LinearProgressBase, value: boolean) {
    if (value) {
      this.mdcFoundation.close();
    } else {
      this.mdcFoundation.open();
    }
  })
  closed = false;

  @property() ariaLabel = '';

  protected render() {
    return html`
      <div role="progressbar"
        class="mdc-linear-progress"
        aria-label="${this.ariaLabel}"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow="0">
        <div class="mdc-linear-progress__buffer">
          <div class="mdc-linear-progress__buffer-bar"></div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
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
      forceLayout: () => this.mdcRoot.offsetWidth,
      removeAttribute: (name: string) => {
        this.mdcRoot.removeAttribute(name);
      },
      setAttribute: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      setBufferBarStyle: (property: string, value: string) => {
        // TODO(aomarks) Consider moving this type to the
        // MDCLinearProgressAdapter parameter type, but note that the "-webkit"
        // prefixed CSS properties are not declared in CSSStyleDeclaration.
        //
        // Exclude read-only properties.
        this.bufferElement
            .style[property as Exclude<keyof CSSStyleDeclaration, 'length'|'parentRule'>] =
            value;
      },
      setPrimaryBarStyle: (property: string, value: string) => {
        // TODO(aomarks) Consider moving this type to the
        // MDCLinearProgressAdapter parameter type, but note that the "-webkit"
        // prefixed CSS properties are not declared in CSSStyleDeclaration.
        //
        // Exclude read-only properties.
        this.primaryBar
            .style[property as Exclude<keyof CSSStyleDeclaration, 'length'|'parentRule'>] =
            value;
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
