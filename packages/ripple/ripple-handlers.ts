/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {RippleInterface} from '@material/mwc-base/utils';

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
 *       <div @mousedown=${this.rippleHandlers.startPress}></div>
 *       ${this.renderRipple ? html`<mwc-ripple></mwc-ripple>` : ''}
 *     `;
 *   }
 * }
 * ```
 */
export class RippleHandlers implements RippleInterface {
  startPress: (ev?: Event) => void;
  endPress: () => void;
  startFocus: () => void;
  endFocus: () => void;
  startHover: () => void;
  endHover: () => void;

  constructor(
      /** Function that returns a `mwc-ripple` */
      rippleFn: () => Promise<RippleInterface|null>) {
    this.startPress = (ev?: Event) => {
      rippleFn().then((r) => {
        r && r.startPress(ev);
      });
    };
    this.endPress = () => {
      rippleFn().then((r) => {
        r && r.endPress();
      });
    };
    this.startFocus = () => {
      rippleFn().then((r) => {
        r && r.startFocus();
      });
    };
    this.endFocus = () => {
      rippleFn().then((r) => {
        r && r.endFocus();
      });
    };
    this.startHover = () => {
      rippleFn().then((r) => {
        r && r.startHover();
      });
    };
    this.endHover = () => {
      rippleFn().then((r) => {
        r && r.endHover();
      });
    };
  }
}
