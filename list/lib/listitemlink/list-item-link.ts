/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../../aria/aria.js';
import {ListItemEl} from '../listitem/list-item.js';

type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemLink extends ListItemEl {
  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property() href!: string;

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute.
   */
  @property() target!: string;
  protected override renderListItem(content: unknown) {
    return html`
      <a
        id="item"
        tabindex=${this.disabled ? -1 : this.itemTabIndex}
        role=${this.listItemRole}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href}
        target=${this.target as LinkTarget || nothing}
        @click=${this.onClick}
        @pointerenter=${this.onPointerenter}
        @pointerleave=${this.onPointerleave}
        @keydown=${this.onKeydown}
      >${content}</a>
    `;
  }
}
