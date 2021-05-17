/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {BaseElement} from '@material/mwc-base/base-element';
import {MDCNotchedOutlineAdapter} from '@material/notched-outline/adapter';
import {MDCNotchedOutlineFoundation} from '@material/notched-outline/foundation';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

export class NotchedOutlineBase extends BaseElement {
  @query('.mdc-notched-outline') protected mdcRoot!: HTMLElement;
  protected mdcFoundation!: MDCNotchedOutlineFoundation;

  protected readonly mdcFoundationClass = MDCNotchedOutlineFoundation;

  @property({type: Number}) width = 0;

  @property({type: Boolean, reflect: true}) open = false;

  protected lastOpen = this.open;

  @query('.mdc-notched-outline__notch') protected notchElement!: HTMLDivElement;

  protected createAdapter(): MDCNotchedOutlineAdapter {
    return {
      addClass: (className) => this.mdcRoot.classList.add(className),
      removeClass: (className) => this.mdcRoot.classList.remove(className),
      setNotchWidthProperty: (width) =>
          this.notchElement.style.setProperty('width', `${width}px`),
      removeNotchWidthProperty: () =>
          this.notchElement.style.removeProperty('width'),
    };
  }

  protected openOrClose(shouldOpen: boolean, width?: number) {
    if (!this.mdcFoundation) {
      return;
    }

    if (shouldOpen && width !== undefined) {
      this.mdcFoundation.notch(width);
    } else {
      this.mdcFoundation.closeNotch();
    }
  }

  render() {
    this.openOrClose(this.open, this.width);

    const classes = classMap({
      'mdc-notched-outline--notched': this.open,
    });

    return html`
      <span class="mdc-notched-outline ${classes}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
  }
}
