/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, type PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {updateClassList} from '../shared/update-class-list.js';

import tabsStyles from './tabs.css' with {type: 'css'}; // github-only
// import tabsStyles from './tabs.cssresult.js'; // google3-only

import {setupTabs, tabsClasses, type TabsVariant} from './tabs.js';

/**
 * A Material Design tabs component.
 *
 * This is a reference implementation of the `.tabs` utility class. The same
 * class can be applied to any element with `role="tablist"`.
 *
 * @slot - Used to display `<md-gb-tab>` children.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-height
 * @cssprop --active-indicator-inset
 * @cssprop --active-indicator-min-length
 * @cssprop --active-indicator-shape
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --divider-color
 * @cssprop --divider-thickness
 */
export class TabsElement extends AriaTablistElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [tabsStyles];

  /**
   * The visual variant of the tabs.
   */
  @property({reflect: true}) variant: TabsVariant = 'primary';

  constructor() {
    super();
    setupTabs(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    // Adopt the stylesheet into the scope this element is connected to, so that
    // `.tabs` and the `.tab` children resolve in the same tree scope. The
    // indicator is anchor-positioned and the anchor scope is the connected
    // scope, not the shadow root.
    adoptStyles(this, tabsStyles);
    // Apply initial classes synchronously on connect as a guard against a
    // frame of unstyled content before the first updated lifecycle callback.
    updateClassList(this, tabsClasses({variant: this.variant}));
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('variant')) {
      // The variant modifier is a utility class rather than an attribute
      // selector so that non-element consumers (raw HTML, React, Angular) use
      // the same hook.
      updateClassList(this, tabsClasses({variant: this.variant}));
    }
  }
}
