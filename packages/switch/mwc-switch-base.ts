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
import '@material/mwc-ripple/mwc-ripple';

import {addHasRemoveClass, FormElement} from '@material/mwc-base/form-element';
import {observer} from '@material/mwc-base/observer';
import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {MDCSwitchAdapter} from '@material/switch/adapter';
import MDCSwitchFoundation from '@material/switch/foundation';
import {eventOptions, html, internalProperty, property, query, queryAsync} from 'lit-element';

export class SwitchBase extends FormElement {
  @property({type: Boolean})
  @observer(function(this: SwitchBase, value: boolean) {
    this.mdcFoundation.setChecked(value);
  })
  checked = false;

  @property({type: Boolean})
  @observer(function(this: SwitchBase, value: boolean) {
    this.mdcFoundation.setDisabled(value);
  })
  disabled = false;

  @query('.mdc-switch') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  @internalProperty() protected shouldRenderRipple = false;

  protected mdcFoundation!: MDCSwitchFoundation;

  private changeHandler(e: Event) {
    this.mdcFoundation.handleChange(e);
    // catch "click" event and sync properties
    this.checked = this.formElement.checked;
  }

  protected readonly mdcFoundationClass = MDCSwitchFoundation;

  protected createAdapter(): MDCSwitchAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setNativeControlChecked: (checked: boolean) => {
        this.formElement.checked = checked;
      },
      setNativeControlDisabled: (disabled: boolean) => {
        this.formElement.disabled = disabled;
      },
      setNativeControlAttr: (attr, value) => {
        this.formElement.setAttribute(attr, value);
      },
    };
  }

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  protected renderRipple() {
    return html`${
        this.shouldRenderRipple ? html`
        <mwc-ripple 
          .accent="${this.checked}" 
          .disabled="${this.disabled}" 
          unbounded>
        </mwc-ripple>` :
                                  html``}`;
  }

  focus() {
    const formElement = this.formElement;
    if (formElement) {
      this.rippleHandlers.startFocus();
      formElement.focus();
    }
  }

  blur() {
    const formElement = this.formElement;
    if (formElement) {
      this.rippleHandlers.endFocus();
      formElement.blur();
    }
  }

  protected render() {
    return html`
      <div class="mdc-switch">
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__thumb-underlay">
          ${this.renderRipple()}
          <div class="mdc-switch__thumb">
            <input
              type="checkbox"
              id="basic-switch"
              class="mdc-switch__native-control"
              role="switch"
              @change="${this.changeHandler}"
              @focus="${this.handleRippleFocus}"
              @blur="${this.handleRippleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
          </div>
        </div>
      </div>`;
  }

  @eventOptions({passive: true})
  protected handleRippleMouseDown(event: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(event);
  }

  @eventOptions({passive: true})
  protected handleRippleTouchStart(event: Event) {
    this.rippleHandlers.startPress(event);
  }

  private handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  private handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  private handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  private handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  private handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
}
