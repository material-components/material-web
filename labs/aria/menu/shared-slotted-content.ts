/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css} from 'lit';

/**
 * Shared styles used by `<md-aria-menulist>` and `<md-aria-fieldset>`, to
 * simulate the descendant combinator in UA styles for `<menuitem>`.
 */
export const sharedSlottedContentStyles = css`
  ::slotted(md-aria-menuitem) {
    display: flex;
    align-items: center;
    user-select: none;
    min-inline-size: 24px;
    min-block-size: max(24px, 1lh);
    font-weight: inherit;
    gap: 0.5em;
    padding-inline: 0.5em;
  }

  ::slotted(md-aria-menuitem:state(enabled):hover) {
    background-color: color-mix(in lab, currentColor 10%, transparent);
  }

  ::slotted(md-aria-menuitem:state(disabled)) {
    color: color-mix(in lab, currentColor 50%, transparent);
  }

  ::slotted(md-aria-fieldset) {
    margin-inline: 0;
    border: none;
    padding-block: 0;
    padding-inline: 0;
  }

  ::slotted(hr) {
    color: inherit;
    margin-inline: 0;
    border: none;
    border-block-start: 1px solid currentColor;
    border-image: none;
  }

  ::slotted(a:any-link),
  ::slotted(img[usemap]) {
    display: none;
  }
`;
