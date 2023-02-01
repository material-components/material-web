/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Dialog} from './lib/dialog.js';


/**
 * Test harness for dialog.
 */
export class DialogHarness extends Harness<Dialog> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.dialog') as
        HTMLDialogElement;
  }

  async isOpening() {
    await this.element.updateComplete;
    return Boolean(this.element.open && this.element.hasAttribute('opening'));
  }

  async isClosing() {
    await this.element.updateComplete;
    return Boolean(!this.element.open && this.element.hasAttribute('closing'));
  }

  async transitionComplete() {
    let resolve = () => {};
    const doneTransitioning = new Promise<void>(resolver => {
      resolve = () => {
        resolver();
      };
    });
    if (await this.isOpening()) {
      this.element.addEventListener('opened', resolve, {once: true});
    } else if (await this.isClosing()) {
      this.element.addEventListener('closed', resolve, {once: true});
    } else {
      resolve();
    }
    await doneTransitioning;
  }

  async isDialogVisible() {
    await this.transitionComplete();
    const dialogElement = await this.getInteractiveElement();
    const {display} = getComputedStyle(dialogElement);
    return display !== 'none';
  }

  async isScrimVisible() {
    await this.transitionComplete();
    const dialogElement = await this.getInteractiveElement();
    const {backgroundColor, display} =
        getComputedStyle(dialogElement, '::before');
    const hiddenBg = `rgba(0, 0, 0, 0)`;
    return backgroundColor !== hiddenBg && display !== 'none';
  }
}
