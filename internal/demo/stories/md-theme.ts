/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {initSheetOrElement, removeStyles, replaceStyles, StyleSheetOrElement} from './stylesheet-helpers.js';
import {createTheme} from './theme-changer.js';

/**
 * The host of the element
 */
type Host = ShadowRoot|Document;

/**
 * Memoized Host to adopted stylesheet map
 */
const styleMap = new WeakMap<Host, StyleSheetOrElement|undefined>();

/**
 * Determines whether the given node is a document or fragment node.
 */
function filterRoot(node: Node): node is Host {
  return node.nodeType === Node.DOCUMENT_NODE ||
      node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}

/**
 * A custom element that can set a lib monet theme on its connected root host.
 */
@customElement('md-theme')
export class MdTheme extends HTMLElement {
  /**
   * The shadow root or document hosting the md-theme element
   */
  private styleHost?: Host;

  /**
   * The constructable stylesheet or style element associated to this element's
   * root host. Undefined if no host exists.
   */
  private get sheet() {
    if (!this.styleHost) return undefined;

    let sheet = styleMap.get(this.styleHost);
    if (sheet === undefined) {
      sheet = initSheetOrElement(this.styleHost);
      styleMap.set(this.styleHost, sheet);
    }
    return sheet;
  }

  private internalDark = false;

  set dark(v: boolean) {
    this.internalDark = v;
    this.updateTheme();
  }

  get dark() {
    return this.internalDark;
  }

  private internalColor: string = '#000fff';

  set color(v: string) {
    this.internalColor = v;
    this.updateTheme();
  }

  /**
   * The base color used for lib monet theming. Defaults to MD3 purple: #000fff
   */
  get color() {
    return this.internalColor;
  }

  connectedCallback() {
    const rootNode = this.getRootNode() as Host;
    if (!filterRoot(rootNode)) {
      return;
    }
    this.styleHost = rootNode;
    this.updateTheme();
  }

  disconnectedCallback() {
    this.removeTheme();
  }

  /**
   * Generates and applies the lib monet theme based on the given seed color
   * (`this.color`).
   */
  updateTheme() {
    const color = this.color;
    if (!color) {
      return;
    }
    const sheet = this.sheet;
    if (sheet === undefined) {
      return;
    }
    const themeProps = createTheme(color, this.dark);
    themeProps.push(['background-color', 'var(--md-sys-color-background)']);
    themeProps.push([
      '--mdc-typography-headline-color', 'var(--md-sys-color-on-background)'
    ]);

    replaceStyles(sheet, themeProps);
  }

  /**
   * Removes the currently applied theme.
   */
  removeTheme() {
    if (this.styleHost === undefined || !this.sheet) {
      return;
    }
    removeStyles(this.styleHost, [this.sheet]);
    styleMap.set(this.styleHost, undefined);
    this.styleHost = undefined;
  }
}