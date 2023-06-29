/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {FieldHarness} from '../field/harness.js';
import {Field} from '../field/lib/field.js';
import {Harness} from '../testing/harness.js';

import {Select} from './lib/select.js';
import {SelectOptionHarness} from './lib/selectoption/harness.js';

/**
 * Test harness for menu.
 */
export class SelectHarness extends Harness<Select> {
  protected getField() {
    return this.element.renderRoot.querySelector('.field') as Field;
  }
  /**
   * Shows the menu and returns the first list item element.
   */
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.getField();
  }

  override async startHover() {
    const field = await this.getField();
    const element =
        await (new SelectFieldHardness(field)).getInteractiveElement();
    this.simulateStartHover(element);
  }

  /** @return ListItem harnesses for the menu's items. */
  getItems() {
    return this.element.options.map(
        (item) => new SelectOptionHarness(item as typeof item&LitElement));
  }

  async click(quick = true) {
    this.element.quick = quick;
    await this.element.updateComplete;
    const field = await this.getField();
    field.click();
  }

  async clickOption(index: number) {
    const menu = this.element.renderRoot.querySelector('md-menu')!;
    if (!menu.open) {
      console.warn(
          'Internal menu is not open. Try calling SelectHarness.prototype.click()');
    }
    (await this.getItems()[index].getInteractiveElement()).click();
  }
}

// Private class (not exported)
class SelectFieldHardness extends FieldHarness {
  /* Expose so that we can call it from our internal code in SelectHarness. */
  override getInteractiveElement() {
    return super.getInteractiveElement();
  }
}
