import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('catalog-component-header-title')
export class CatalogComponentHeaderTitle extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: var(--catalog-image-border-radius);
      padding: 56px;
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface-container);
    }

    slot::slotted(h1) {
      font-size: var(--catalog-display-xl-font-size) !important;
      margin-block-end: 8px;
      font-weight: 475;
    }

    slot::slotted(p) {
      font-size: var(--catalog-title-l-font-size) !important;
    }

    slot::slotted(*) {
      margin-block-start: 0;
    }

    slot::slotted(*:last-child) {
      margin-block-end: 0;
    }

    @media screen and (max-width: 600px) {
      :host {
        padding: 32px;
      }
    }
  `;
}