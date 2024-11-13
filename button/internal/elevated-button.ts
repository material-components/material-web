/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html} from 'lit';
import {literal} from 'lit/static-html.js';

import {Button} from './button.js';

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

/**
 * An elevated button component.
 */
export class ElevatedButton extends Button {
  protected readonly focusRingTag = literal`md-focus-ring`;

  protected readonly rippleTag = literal`md-ripple`;

  protected override renderElevationOrOutline() {
    return html`<md-elevation part="elevation"></md-elevation>`;
  }
}
