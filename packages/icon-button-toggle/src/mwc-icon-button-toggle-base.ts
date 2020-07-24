/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '@material/mwc-ripple/mwc-ripple';

import {MDCIconButtonToggleAdapter} from '@material/icon-button/adapter';
import MDCIconButtonToggleFoundation from '@material/icon-button/foundation';
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {eventOptions, html, internalProperty, property, query, queryAsync} from 'lit-element';

export class IconButtonToggleBase extends BaseElement {
  protected mdcFoundationClass = MDCIconButtonToggleFoundation;

  protected mdcFoundation!: MDCIconButtonToggleFoundation;

  @query('.mdc-icon-button') protected mdcRoot!: HTMLElement;

  @property({type: String}) label = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  @property({type: Boolean, reflect: true})
  @observer(function(this: IconButtonToggleBase, state: boolean) {
    this.mdcFoundation.toggle(state);
  })
  on = false;

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  @internalProperty() protected shouldRenderRipple = false;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  protected createAdapter(): MDCIconButtonToggleAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      getAttr: (name: string) => {
        return this.mdcRoot.getAttribute(name);
      },
      setAttr: (name: string, value: string) => {
        this.mdcRoot.setAttribute(name, value);
      },
      notifyChange: (evtData: {isOn: boolean}) => {
        this.dispatchEvent(new CustomEvent(
            'MDCIconButtonToggle:change', {detail: evtData, bubbles: true}));
      },
    };
  }

  protected handleClick() {
    this.on = !this.on;
    this.mdcFoundation.handleClick();
  }

  focus() {
    this.rippleHandlers.startFocus();
    this.mdcRoot.focus();
  }

  blur() {
    this.rippleHandlers.endFocus();
    this.mdcRoot.blur();
  }

  protected renderRipple() {
    return html`${
        this.shouldRenderRipple ? html`
            <mwc-ripple
                .disabled="${this.disabled}"
                unbounded>
            </mwc-ripple>` :
                                  ''}`;
  }

  protected render() {
    return html`
      <button
          class="mdc-icon-button"
          @click="${this.handleClick}"
          aria-hidden="true"
          aria-label="${this.label}"
          ?disabled="${this.disabled}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleMouseDown}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleTouchStart}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}">
        ${this.renderRipple()}
        <span class="mdc-icon-button__icon">
          <slot name="offIcon">
            <i class="material-icons">${this.offIcon}</i>
          </slot>
        </span>
        <span class="mdc-icon-button__icon mdc-icon-button__icon--on">
          <slot name="onIcon">
            <i class="material-icons">${this.onIcon}</i>
          </slot>
        </span>
      </button>`;
  }

  @eventOptions({passive: true})
  protected handleRippleMouseDown(event?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event?: Event) {
    this.rippleHandlers.startPress(event);
  }

  protected handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  protected handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
}
