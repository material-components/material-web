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
import {BaseElement} from '@material/mwc-base/base-element.js';
import {MDCRippleAdapter} from '@material/ripple/adapter.js';
import MDCRippleFoundation from '@material/ripple/foundation.js';
import {html, internalProperty, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {styleMap} from 'lit-html/directives/style-map.js';
import {RippleAPI} from './ripple-handlers.js';

/** @soyCompatible */
export class RippleBase extends BaseElement implements RippleAPI {
  @query('.mdc-ripple-surface') mdcRoot!: HTMLElement;

  @property({type: Boolean}) primary = false;

  @property({type: Boolean}) accent = false;

  @property({type: Boolean}) unbounded = false;

  @property({type: Boolean}) disabled = false;

  @property({type: Boolean}) activated = false;

  @property({type: Boolean}) selected = false;

  @internalProperty() private hovering = false;

  @internalProperty() private bgFocused = false;

  @internalProperty() private fgActivation = false;

  @internalProperty() private fgDeactivation = false;

  @internalProperty() private fgScale = '';

  @internalProperty() private fgSize = '';

  @internalProperty() private translateStart = '';

  @internalProperty() private translateEnd = '';

  @internalProperty() private leftPos = '';

  @internalProperty() private topPos = '';

  protected mdcFoundationClass = MDCRippleFoundation;

  protected mdcFoundation!: MDCRippleFoundation;

  get isActive() {
    return (this.parentElement || this).matches(':active');
  }

  createAdapter(): MDCRippleAdapter {
    return {
      browserSupportsCssVars: () => true,
      isUnbounded: () => this.unbounded,
      isSurfaceActive: () => this.isActive,
      isSurfaceDisabled: () => this.disabled,
      addClass: (className: string) => {
        switch (className) {
          case 'mdc-ripple-upgraded--background-focused':
            this.bgFocused = true;
            break;
          case 'mdc-ripple-upgraded--foreground-activation':
            this.fgActivation = true;
            break;
          case 'mdc-ripple-upgraded--foreground-deactivation':
            this.fgDeactivation = true;
            break;
          default:
            break;
        }
      },
      removeClass: (className: string) => {
        switch (className) {
          case 'mdc-ripple-upgraded--background-focused':
            this.bgFocused = false;
            break;
          case 'mdc-ripple-upgraded--foreground-activation':
            this.fgActivation = false;
            break;
          case 'mdc-ripple-upgraded--foreground-deactivation':
            this.fgDeactivation = false;
            break;
          default:
            break;
        }
      },
      containsEventTarget: () => true,
      registerInteractionHandler: () => undefined,
      deregisterInteractionHandler: () => undefined,
      registerDocumentInteractionHandler: () => undefined,
      deregisterDocumentInteractionHandler: () => undefined,
      registerResizeHandler: () => undefined,
      deregisterResizeHandler: () => undefined,
      updateCssVariable: (varName: string, value: string) => {
        switch (varName) {
          case '--mdc-ripple-fg-scale':
            this.fgScale = value;
            break;
          case '--mdc-ripple-fg-size':
            this.fgSize = value;
            break;
          case '--mdc-ripple-fg-translate-end':
            this.translateEnd = value;
            break;
          case '--mdc-ripple-fg-translate-start':
            this.translateStart = value;
            break;
          case '--mdc-ripple-left':
            this.leftPos = value;
            break;
          case '--mdc-ripple-top':
            this.topPos = value;
            break;
          default:
            break;
        }
      },
      computeBoundingRect: () =>
          (this.parentElement || this).getBoundingClientRect(),
      getWindowPageOffset: () =>
          ({x: window.pageXOffset, y: window.pageYOffset}),
    };
  }

  startPress(ev?: Event) {
    this.waitForFoundation(() => {
      this.mdcFoundation.activate(ev);
    });
  }

  endPress() {
    this.waitForFoundation(() => {
      this.mdcFoundation.deactivate();
    });
  }

  startFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleFocus();
    });
  }

  endFocus() {
    this.waitForFoundation(() => {
      this.mdcFoundation.handleBlur();
    });
  }

  startHover() {
    this.hovering = true;
  }

  endHover() {
    this.hovering = false;
  }

  /**
   * Wait for the MDCFoundation to be created by `firstUpdated`
   */
  protected waitForFoundation(fn: () => void) {
    if (this.mdcFoundation) {
      fn();
    } else {
      this.updateComplete.then(fn);
    }
  }

  /** @soyCompatible */
  protected render() {
    /** @classMap */
    const classes = {
      'mdc-ripple-upgraded--unbounded': this.unbounded,
      'mdc-ripple-upgraded--background-focused': this.bgFocused,
      'mdc-ripple-upgraded--foreground-activation': this.fgActivation,
      'mdc-ripple-upgraded--foreground-deactivation': this.fgDeactivation,
      'hover': this.hovering,
      'primary': this.primary,
      'accent': this.accent,
      'disabled': this.disabled,
      'activated': this.activated,
      'selected': this.selected,
    };
    return html`
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${classMap(classes)}"
          style="${styleMap({
      '--mdc-ripple-fg-scale': this.fgScale,
      '--mdc-ripple-fg-size': this.fgSize,
      '--mdc-ripple-fg-translate-end': this.translateEnd,
      '--mdc-ripple-fg-translate-start': this.translateStart,
      '--mdc-ripple-left': this.leftPos,
      '--mdc-ripple-top': this.topPos,
    })}"></div>`;
  }
}
