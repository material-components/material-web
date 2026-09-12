/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ToolbarButtonElement,
  ToolbarIconButtonElement,
} from './toolbar-button-element.js';
import {ToolbarElement} from './toolbar-element.js';
import {ToolbarSeparatorElement} from './toolbar-separator-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design gBreeze toolbar container custom element. */
    'md-gb-toolbar': ToolbarElement;
    /** A Material Design gBreeze toolbar button custom element. */
    'md-gb-toolbar-button': ToolbarButtonElement;
    /** A Material Design gBreeze toolbar icon button custom element. */
    'md-gb-toolbar-icon-button': ToolbarIconButtonElement;
    /** A Material Design gBreeze toolbar separator custom element. */
    'md-gb-toolbar-separator': ToolbarSeparatorElement;
  }
}

customElements.define('md-gb-toolbar', ToolbarElement);
customElements.define('md-gb-toolbar-button', ToolbarButtonElement);
customElements.define('md-gb-toolbar-icon-button', ToolbarIconButtonElement);
customElements.define('md-gb-toolbar-separator', ToolbarSeparatorElement);

export {
  ToolbarElement as MdGbToolbar,
  ToolbarButtonElement as MdGbToolbarButton,
  ToolbarIconButtonElement as MdGbToolbarIconButton,
  ToolbarSeparatorElement as MdGbToolbarSeparator,
  ToolbarElement as Toolbar,
  ToolbarButtonElement as ToolbarButton,
  ToolbarIconButtonElement as ToolbarIconButton,
  ToolbarSeparatorElement as ToolbarSeparator,
};
