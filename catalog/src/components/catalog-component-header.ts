/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * A layout element that lays out the
 * catalog-component-header-title[slot="title"] and the header image in our
 * component READMEs. This element is never hydrated only SSRd.
 *
 * See component-template.md in internal team docs for usage.
 */
@customElement('catalog-component-header')
export class CatalogComponentHeader extends LitElement {
  render() {
    return html` <div>
      <slot class="title" name="title"></slot>
      <slot class="image"></slot>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      --catalog-image-border-radius: var(--catalog-shape-xl);
      container: host / inline-size;
      position: relative;
      margin-inline: auto;
    }

    slot {
      height: 100%;
    }

    slot,
    .image::slotted(*) {
      display: flex;
      align-items: start;
      margin: 0;
    }

    .end slot,
    .end .image::slotted(*) {
      align-items: end;
    }

    .center slot,
    .center .image::slotted(*) {
      align-items: center;
    }

    .image {
      /* Color needs to differ from top-app-bar and sidebar */
      background-color: var(--md-sys-color-surface-variant);
      border-radius: var(--catalog-image-border-radius);
      overflow: hidden;
      margin-block-start: 16px;
      aspect-ratio: 3 / 2;
      max-width: 100%;
    }

    ::slotted(*) {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
    }

    .image::slotted(*) {
      --catalog-image-border-radius: 0px;
      --catalog-header-image-height: 100%;
      --catalog-header-image-width: auto;
      display: flex;
      justify-content: center;
    }

    /* fit ipad pro at least */
    @container (width > 1000px) {
      div {
        display: grid;
        grid-gap: 8px;
        gap: 8px;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-flow: row;
      }

      .image {
        margin-block-start: 0;
        aspect-ratio: unset;
      }

      .image,
      .image::slotted(*) {
        min-height: 100%;
        max-height: 544px;
      }
    }
  `;
}
