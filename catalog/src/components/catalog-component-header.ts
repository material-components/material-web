import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('catalog-component-header')
export class CatalogComponentHeader extends LitElement {
  render() {
    return html`<div class="">
      <slot class="title" name="title"></slot>
      <slot
        class="image"
      ></slot>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      --catalog-image-border-radius: 24px;
      container: host / inline-size;
      position: relative;
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
      background-color: var(--md-sys-color-surface-container);
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

    /* clean-css ignore:start */
    @container (width > 1200px) {
      /* clean-css ignore:end */
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
      /* clean-css ignore:start */
    }
    /* clean-css ignore:end */
  `;
}
