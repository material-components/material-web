import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from 'lit/decorators.js';

@customElement('catalog-component-header')
export class CatalogComponentHeader extends LitElement {
  @property({ attribute: 'image-align' }) imageAlign = 'start';

  render() {
    return html`<div class="${this.imageAlign}">
      <slot class="title" name="title"></slot>
      <slot class="image"></slot>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      --catalog-image-border-radius: 24px;
      container: host / inline-size;
      position: relative;
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

    .image {
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--catalog-image-border-radius);
      overflow: hidden;
      margin-block-start: 16px;
      aspect-ratio: 2 / 1;
    }

    .image::slotted(*) {
      --catalog-image-border-radius: 0px;
      display: flex;
      width: 100%;
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

      ::slotted(*) {
        box-sizing: border-box;
        height: 100%;
      }

      .image {
        margin-block-start: 0;
        aspect-ratio: unset;
        min-height: 544px;
        --catalog-header-image-height: 100%;
        --catalog-header-image-width: auto;
      }

      .image::slotted(*) {
        max-height: 544px;
      }
    /* clean-css ignore:start */
    }
    /* clean-css ignore:end */
  `;
}
