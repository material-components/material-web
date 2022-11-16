import { LitElement, css, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

const genElevationStyle = (sel = ":host") => {
  const safeSel = unsafeCSS(sel);
  return css`
    ${safeSel} {
      border-radius: inherit;
      display: flex;
      position: relative;

      --_duration: var(--md-comp-elevation-duration, 0s);
      --_easing: var(--md-comp-elevation-easing, linear);
      --_level: var(--md-comp-elevation-level, 0);
      --_shadow-color: var(--md-comp-elevation-shadow-color, 0, 0, 0);
      --_surface-tint-color: var(
        --md-comp-elevation-surface-tint-color,
        transparent
      );

      transition-property: box-shadow, background-color, opacity;
      transition-duration: var(--_duration);
      transition-timing-function: var(--_easing);

      /* key */
      --_key-shadow-color: rgb(var(--_shadow-color), 0.3);
      --_key-box-shadow: 0px
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
              2 * clamp(0, var(--_level) - 0, 1) +
                clamp(0, var(--_level) - 2, 1) + clamp(0, var(--_level) - 4, 1)
            )
        )
        0px var(--_key-shadow-color);

      /* ambient */
      --_ambient-shadow-color: rgb(var(--_shadow-color), 0.15);
      --_ambient-box-shadow: 0px
        calc(
          1px *
            (
              clamp(0, var(--_level) - 0, 1) + clamp(0, var(--_level) - 1, 1) +
                2 * clamp(0, var(--_level) - 2, 1) + 2 *
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
        var(--_ambient-shadow-color);

      box-shadow: var(--_key-box-shadow), var(--_ambient-box-shadow);
    }

    /* overlay */
    ${safeSel}::after {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      content: "";
      transition: inherit;
      opacity: calc(
        clamp(0, var(--_level) - 0, 0.05) + clamp(0, var(--_level) - 1, 0.03) +
          clamp(0, var(--_level) - 2, 0.03) + clamp(0, var(--_level) - 3, 0.01) +
          clamp(0, var(--_level) - 4, 0.02)
      );
      background: var(--_surface-tint-color);
    }
  `;
};

export const hostStyles = genElevationStyle();

export const mdElevationStyles = genElevationStyle(".md-elevation");

@customElement("one-node")
export class Elevation extends LitElement {
  static override styles = hostStyles;

  override render(): any {
    return null;
  }
}
