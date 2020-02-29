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
import {Ripple} from './mwc-ripple.js';

/**
 * Class that encapsulates the events handlers for `mwc-ripple`
 *
 *
 * Example:
 * ```
 * class XFoo extends LitElement {
 *   async getRipple() {
 *     this.renderRipple = true;
 *     await this.updateComplete;
 *     return this.renderRoot.querySelector('mwc-ripple');
 *   }
 *   rippleHandlers = new RippleHandlers(() => this.getRipple());
 *
 *   render() {
 *     return html`
 *       <div @mousedown=${this.rippleHandlers.activate}></div>
 *       ${this.renderRipple ? html`<mwc-ripple></mwc-ripple>` : ''}
 *     `;
 *   }
 * }
 * ```
 */
export class RippleHandlers {
  activate: (ev?: Event) => void;
  deactivate: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;

  constructor(
      /** Function that returns a `mwc-ripple` */
      rippleFn: () => Promise<Ripple|null>) {
    this.activate = (ev?: Event) => {
      rippleFn().then((r) => {
        r && r.activate(ev);
      });
    };
    this.deactivate = () => {
      rippleFn().then((r) => {
        r && r.deactivate();
      });
    };
    this.handleFocus = () => {
      rippleFn().then((r) => {
        r && r.handleFocus();
      });
    };
    this.handleBlur = () => {
      rippleFn().then((r) => {
        r && r.handleBlur();
      });
    };
    this.handleMouseEnter = () => {
      rippleFn().then((r) => {
        r && r.handleMouseEnter();
      });
    };
    this.handleMouseLeave = () => {
      rippleFn().then((r) => {
        r && r.handleMouseLeave();
      });
    };
  }
}
