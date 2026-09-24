/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, html} from 'lit';
import {AriaTabElement} from '../../../aria/tabs/tab.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {updateClassList} from '../shared/update-class-list.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import tabsStyles from './tabs.css' with {type: 'css'}; // github-only
// import tabsStyles from './tabs.cssresult.js'; // google3-only

import {TAB_CLASSES} from './tabs.js';

/**
 * A Material Design tab component.
 *
 * This is a reference implementation of the `.tab` utility class. The same
 * class can be applied to any element with `role="tab"`.
 *
 * @slot - Used to display an optional leading icon, such as `<md-gb-icon>`.
 *     Icons are unclassed; the tab sets `--md-icon-*` for them.
 * @slot label - Used to display the tab's label. `<span class="tab-label">` in
 *     the default slot is equivalent. Bare text is not supported.
 * @slot badge - Used to display an optional badge, such as `<span class="badge tab-badge">`.
 * @cssstate selected - Whether the tab is selected.
 * @cssprop --badge-space
 * @cssprop --focus-indicator-clearance
 * @cssprop --focus-indicator-inset
 * @cssprop --focus-indicator-shape
 * @cssprop --icon-badge-inset
 * @cssprop --icon-color
 * @cssprop --icon-label-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --stacked-icon-label-space
 * @cssprop --tab-scroll-margin
 * @cssprop --trailing-space
 */
export class TabElement extends AriaTabElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    tabsStyles,
  ];

  override connectedCallback() {
    super.connectedCallback();
    // `.tab`, `.focus-ring-inner`, and `.ripple` live on the host in the light
    // tree: a shadow-scoped `anchor-name` is invisible to the container's
    // `::after`, and host-class composition on a light-DOM element requires all
    // three stylesheets (focus ring, ripple, and tabs) to be adopted into the
    // connected scope, not just the shadow root.
    adoptStyles(this, [focusRingStyles, rippleStyles, tabsStyles]);
    updateClassList(this, {
      [TAB_CLASSES.tab]: true,
      [TAB_CLASSES.focusRingInner]: true,
      [TAB_CLASSES.ripple]: true,
    });
  }

  protected override render() {
    return html`
      <slot></slot>
      <slot name="label" class="${TAB_CLASSES.tabLabel}"></slot>
      <slot name="badge"></slot>
    `;
  }
}
