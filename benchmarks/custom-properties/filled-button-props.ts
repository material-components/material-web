import {css, unsafeCSS} from 'lit';

export const filledButtonProps = (selector = `:host`) => css`
  ${unsafeCSS(selector)} {
    --_container-color: var(
      --md-filled-button-container-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_container-height: var(--md-filled-button-container-height, 40px);
    --_container-shape: var(--md-filled-button-container-shape, 9999px);
    --_disabled-container-color: var(
      --md-filled-button-disabled-container-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.12)
    );
    --_disabled-container-opacity: var(
      --md-filled-button-disabled-container-opacity,
      0.12
    );
    --_disabled-label-text-color: var(
      --md-filled-button-disabled-label-text-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.38)
    );
    --_disabled-label-text-opacity: var(
      --md-filled-button-disabled-label-text-opacity,
      0.38
    );
    --_dragged-container-elevation: var(
      --md-filled-button-dragged-container-elevation,
      6
    );
    --_dragged-label-text-color: var(
      --md-filled-button-dragged-label-text-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_dragged-state-layer-color: var(
      --md-filled-button-dragged-state-layer-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_dragged-state-layer-opacity: var(
      --md-filled-button-dragged-state-layer-opacity,
      0.16
    );
    --_focus-label-text-color: var(
      --md-filled-button-focus-label-text-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_focus-state-layer-color: var(
      --md-filled-button-focus-state-layer-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_focus-state-layer-opacity: var(
      --md-filled-button-focus-state-layer-opacity,
      0.12
    );
    --_hover-label-text-color: var(
      --md-filled-button-hover-label-text-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_hover-state-layer-color: var(
      --md-filled-button-hover-state-layer-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_hover-state-layer-opacity: var(
      --md-filled-button-hover-state-layer-opacity,
      0.08
    );
    --_label-text-color: var(
      --md-filled-button-label-text-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_label-text-font: var(--md-filled-button-label-text-font, Roboto);
    --_label-text-line-height: var(
      --md-filled-button-label-text-line-height,
      1.25rem
    );
    --_label-text-size: var(--md-filled-button-label-text-size, 0.875rem);
    --_label-text-tracking: var(
      --md-filled-button-label-text-tracking,
      0.00625rem
    );
    --_label-text-weight: var(--md-filled-button-label-text-weight, 500);
    --_pressed-label-text-color: var(
      --md-filled-button-pressed-label-text-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_pressed-state-layer-color: var(
      --md-filled-button-pressed-state-layer-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_pressed-state-layer-opacity: var(
      --md-filled-button-pressed-state-layer-opacity,
      0.12
    );
    --_with-icon-disabled-icon-color: var(
      --md-filled-button-with-icon-disabled-icon-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.38)
    );
    --_with-icon-disabled-icon-opacity: var(
      --md-filled-button-with-icon-disabled-icon-opacity,
      0.38
    );
    --_with-icon-dragged-icon-color: var(
      --md-filled-button-with-icon-dragged-icon-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_with-icon-focus-icon-color: var(
      --md-filled-button-with-icon-focus-icon-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_with-icon-hover-icon-color: var(
      --md-filled-button-with-icon-hover-icon-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_with-icon-icon-color: var(
      --md-filled-button-with-icon-icon-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_with-icon-icon-size: var(--md-filled-button-with-icon-icon-size, 18px);
    --_with-icon-pressed-icon-color: var(
      --md-filled-button-with-icon-pressed-icon-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_spacing-leading: var(--md-filled-button-spacing-leading, 24px);
    --_spacing-trailing: var(--md-filled-button-spacing-trailing, 24px);
    --_with-icon-spacing-leading: var(
      --md-filled-button-with-icon-spacing-leading,
      16px
    );
    --_with-icon-spacing-trailing: var(
      --md-filled-button-with-icon-spacing-trailing,
      24px
    );
    --_with-trailing-icon-spacing-leading: var(
      --md-filled-button-with-trailing-icon-spacing-leading,
      24px
    );
    --_with-trailing-icon-spacing-trailing: var(
      --md-filled-button-with-trailing-icon-spacing-trailing,
      16px
    );
    --_container-elevation-shadow: var(
      --md-filled-button-container-elevation-shadow,
      none
    );
    --_container-elevation-overlay-opacity: var(
      --md-filled-button-container-elevation-overlay-opacity,
      0
    );
    --_disabled-container-elevation-shadow: var(
      --md-filled-button-disabled-container-elevation-shadow,
      none
    );
    --_disabled-container-elevation-overlay-opacity: var(
      --md-filled-button-disabled-container-elevation-overlay-opacity,
      0
    );
    --_focus-container-elevation-shadow: var(
      --md-filled-button-focus-container-elevation-shadow,
      none
    );
    --_focus-container-elevation-overlay-opacity: var(
      --md-filled-button-focus-container-elevation-overlay-opacity,
      0
    );
    --_hover-container-elevation-shadow: var(
      --md-filled-button-hover-container-elevation-shadow,
      0px 1px 2px 0px rgb(var(--md-sys-color-shadow-rgb, 0, 0, 0), 0.3),
      0px 1px 3px 1px rgb(var(--md-sys-color-shadow-rgb, 0, 0, 0), 0.15)
    );
    --_hover-container-elevation-overlay-opacity: var(
      --md-filled-button-hover-container-elevation-overlay-opacity,
      0.05
    );
    --_pressed-container-elevation-shadow: var(
      --md-filled-button-pressed-container-elevation-shadow,
      none
    );
    --_pressed-container-elevation-overlay-opacity: var(
      --md-filled-button-pressed-container-elevation-overlay-opacity,
      0
    );
  }
`;
