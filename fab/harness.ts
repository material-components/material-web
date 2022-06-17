/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';

import {Fab} from './lib/fab';
import {FabExtended} from './lib/fab-extended';


/**
 * Test harness for floating action buttons.
 */
export class FabHarness extends Harness<Fab|FabExtended> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-fab') as
        HTMLButtonElement;
  }
}
