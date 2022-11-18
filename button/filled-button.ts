/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledButton} from './lib/filled-button.js';
import {styles as filledStyles} from './lib/filled-styles.css.js';
import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-button': MdFilledButton;
  }
}

/**
 *
 * @description A button element for high emphasis – for the primary, most
 * important, or most common action on a screen.
 * The filled button’s contrasting surface color makes it the most prominent
 * button after the FAB. It’s used for final or unblocking actions in a flow.
 * @summary A filled button for high emphasis.
 *
 * @cssProperty --md-comp-filled-button-container-color: defaults to --md-sys-color-primary
 * @cssProperty --md-comp-filled-button-container-height: defaults to 40px
 * @cssProperty --md-comp-filled-button-container-shape: defaults to 9999px
 * @cssProperty --md-comp-filled-button-disabled-container-color: defaults to rgb(var(--md-sys-color-on-surface-rgb, 0.12)
 * @cssProperty --md-comp-filled-button-disabled-container-opacity: defaults to 0.12
 * @cssProperty --md-comp-filled-button-disabled-label-text-color: defaults to rgb(var(--md-sys-color-on-surface-rgb), 0.12
 * @cssProperty --md-comp-filled-button-disabled-label-text-opacity: defaults to 0.38
 * @cssProperty --md-comp-filled-button-dragged-container-elevation: defaults to 6
 * @cssProperty --md-comp-filled-button-dragged-label-text-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-dragged-state-layer-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-dragged-state-layer-opacity: defaults to 0.16
 * @cssProperty --md-comp-filled-button-focus-label-text-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-focus-state-layer-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-focus-state-layer-opacity: defaults to 0.12
 * @cssProperty --md-comp-filled-button-hover-label-text-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-hover-state-layer-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-hover-state-layer-opacity: defaults to 0.08
 * @cssProperty --md-comp-filled-button-label-text-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-label-text-font: defaults to Roboto
 * @cssProperty --md-comp-filled-button-label-text-line-height: defaults to 1.25rem
 * @cssProperty --md-comp-filled-button-label-text-size: defaults to 0.875rem
 * @cssProperty --md-comp-filled-button-label-text-tracking: defaults to 0.00625rem
 * @cssProperty --md-comp-filled-button-label-text-weight: defaults to 500
 * @cssProperty --md-comp-filled-button-pressed-label-text-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-pressed-state-layer-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-pressed-state-layer-opacity: defaults to 0.12
 * @cssProperty --md-comp-filled-button-with-icon-disabled-icon-color: defaults to rgb(var(--md-sys-color-on-surface-rgb), 0.38)
 * @cssProperty --md-comp-filled-button-with-icon-disabled-icon-opacity: defaults to 0.38
 * @cssProperty --md-comp-filled-button-with-icon-dragged-icon-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-with-icon-focus-icon-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-with-icon-hover-icon-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-with-icon-icon-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-with-icon-icon-size: defaults to 18px
 * @cssProperty --md-comp-filled-button-with-icon-pressed-icon-color: defaults to --md-sys-color-on-primary
 * @cssProperty --md-comp-filled-button-spacing-leading: defaults to 24px
 * @cssProperty --md-comp-filled-button-spacing-trailing: defaults to 24px
 * @cssProperty --md-comp-filled-button-with-icon-spacing-leading: defaults to 16px
 * @cssProperty --md-comp-filled-button-with-icon-spacing-trailing: defaults to 24px
 * @cssProperty --md-comp-filled-button-with-trailing-icon-spacing-leading: defaults to 24px
 * @cssProperty --md-comp-filled-button-with-trailing-icon-spacing-trailing: defaults to 16px
 * @cssProperty --md-comp-filled-button-container-elevation-shadow: defaults to none
 * @cssProperty --md-comp-filled-button-container-elevation-overlay-opacity: defaults to 0
 * @cssProperty --md-comp-filled-button-disabled-container-elevation-shadow: defaults to none
 * @cssProperty --md-comp-filled-button-disabled-container-elevation-overlay-opacity: defaults to 0
 * @cssProperty --md-comp-filled-button-focus-container-elevation-shadow: defaults to none
 * @cssProperty --md-comp-filled-button-focus-container-elevation-overlay-opacity: defaults to 0
 * @cssProperty --md-comp-filled-button-hover-container-elevation-shadow: defaults to 0px 1px 2px 0px rgb(var(--md-sys-color-shadow-rg), 0.3), 0px 1px 3px 1px rgb(var(--md-sys-color-shadow-rgb), 0.15)
 * @cssProperty --md-comp-filled-button-hover-container-elevation-overlay-opacity: defaults to 0.05
 * @cssProperty --md-comp-filled-button-pressed-container-elevation-shadow: defaults to none
 * @cssProperty --md-comp-filled-button-pressed-container-elevation-overlay-opacity: defaults to 0

 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-button')
export class MdFilledButton extends FilledButton {
  static override styles = [sharedStyles, sharedElevationStyles, filledStyles];
}
