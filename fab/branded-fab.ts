/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Fab, FabVariant} from './lib/fab.js';
import {styles} from './lib/fab-branded-styles.css.js';
import {styles as forcedColors} from './lib/forced-colors-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

export {FabSize} from './lib/shared.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-branded-fab': MdBrandedFab;
  }
}

/**
 * @summary Floating action buttons (FABs) help people take primary actions.
 * They’re used to represent the most important action on a screen, such as
 * Create or Reply.
 *
 * @description
 * __Emphasis:__ High emphasis – For the primary, most important, or most common
 * action on a screen
 *
 * __Rationale:__ The FAB remains the default component for a screen’s primary
 * action. It comes in three sizes: small FAB, FAB, and large FAB. The extended
 * FAB’s wider format and text label give it more visual prominence than a  FAB.
 * It’s often used on larger screens where a FAB would seem too small. Branded
 * FABs are used to specifically call attention to branded logo icons.
 *
 * __Example usages:__
 * - FAB
 *   - Create
 *   - Compose
 * - Extended FAB
 *   - Create
 *   - Compose
 *   - New Thread
 *   - New File
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-branded-fab')
export class MdBrandedFab extends Fab {
  /**
   * Branded FABs have no variants
   */
  override variant!: FabVariant;

  override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'primary': false,
      'secondary': false,
      'tertiary': false,
      'small': false,
    };
  }
  static override styles = [sharedStyles, styles, forcedColors];
}
