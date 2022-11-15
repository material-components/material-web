import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

export const mdElevationStyles = css`
  :host {
    --_duration: var(--md-comp-elevation-duration, 0s);
    --_easing: var(--md-comp-elevation-easing, linear);
    --_level: var(--md-comp-elevation-level, 0);
    --_shadow-color: var(--md-comp-elevation-shadow-color, black);
    --_surface-tint-color: var(
      --md-comp-elevation-surface-tint-color,
      transparent
    );
  }

  .overlay,
  .key,
  .ambient {
    border-radius: inherit;
    content: "";
    inset: 0;
    position: absolute;
    transition-property: box-shadow, opacity;
    transition-duration: var(--_duration);
    transition-timing-function: var(--_easing);
  }

  .key {
    opacity: 0.3;
    box-shadow: 0px
      calc(
        1px *
          (
            clamp(0, var(--_level), 1) + clamp(0, var(--_level) - 3, 2) +
              clamp(0, var(--_level) - 4, 1)
          )
      )
      calc(
        1px *
          (
            2 * clamp(0, var(--_level) - 0, 1) + clamp(0, var(--_level) - 2, 1) +
              clamp(0, var(--_level) - 4, 1)
          )
      )
      0px var(--_shadow-color);
  }

  .ambient {
    opacity: 0.15;
    box-shadow: 0px
      calc(
        1px *
          (
            clamp(0, var(--_level) - 0, 1) + clamp(0, var(--_level) - 1, 1) + 2 *
              clamp(0, var(--_level) - 2, 1) + 2 *
              clamp(0, var(--_level) - 3, 1) + 2 *
              clamp(0, var(--_level) - 4, 1)
          )
      )
      calc(
        1px *
          (
            3 * clamp(0, var(--_level) - 0, 1) + 3 *
              clamp(0, var(--_level) - 1, 1) + 2 *
              clamp(0, var(--_level) - 2, 1) + 2 *
              clamp(0, var(--_level) - 3, 1) + 2 *
              clamp(0, var(--_level) - 4, 1)
          )
      )
      calc(
        1px *
          (
            clamp(0, var(--_level) - 0, 1) + clamp(0, var(--_level) - 1, 1) +
              clamp(0, var(--_level) - 2, 1) + clamp(0, var(--_level) - 3, 1) +
              2 * clamp(0, var(--_level) - 4, 1)
          )
      )
      var(--_shadow-color);
  }

  .overlay {
    background: var(--_surface-tint-color);
    opacity: calc(
      clamp(0, var(--_level) - 0, 0.05) + clamp(0, var(--_level) - 1, 0.03) +
        clamp(0, var(--_level) - 2, 0.03) + clamp(0, var(--_level) - 3, 0.01) +
        clamp(0, var(--_level) - 4, 0.02)
    );
    transition: opacity var(--_duration) var(--_easing);
  }
`;

@customElement("three-node")
export class Elevation extends LitElement {
  static override styles = [
    css`
      :host {
        border-radius: inherit;
        display: flex;
        position: relative;
      }
    `,
    mdElevationStyles,
  ];

  override render() {
    return html`
      <span class="overlay"></span>
      <span class="key"></span>
      <span class="ambient"></span>
    `;
  }
}
