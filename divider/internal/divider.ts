/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * A divider component.
 */
export class Divider extends LitElement {
  /**
   * Indents the divider with equal padding on both sides.
   */
  @property({type: Boolean, reflect: true}) accessor inset = false;

  /**
   * Indents the divider with padding on the leading side.
   */
  @property({type: Boolean, reflect: true, attribute: 'inset-start'})
  accessor insetStart = false;

  /**
   * Indents the divider with padding on the trailing side.
   */
  @property({type: Boolean, reflect: true, attribute: 'inset-end'})
  accessor insetEnd = false;
}
