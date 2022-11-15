import {css, unsafeCSS} from 'lit';

export const switchProps = (selector = `:host`) => css`
  ${unsafeCSS(selector)} {
    --_handle-shape-start-start: var(
      --md-switch-handle-shape-start-start,
      9999px
    );
    --_handle-shape-start-end: var(--md-switch-handle-shape-start-end, 9999px);
    --_handle-shape-end-end: var(--md-switch-handle-shape-end-end, 9999px);
    --_handle-shape-end-start: var(--md-switch-handle-shape-end-start, 9999px);
    --_track-shape-start-start: var(
      --md-switch-track-shape-start-start,
      9999px
    );
    --_track-shape-start-end: var(--md-switch-track-shape-start-end, 9999px);
    --_track-shape-end-end: var(--md-switch-track-shape-end-end, 9999px);
    --_track-shape-end-start: var(--md-switch-track-shape-end-start, 9999px);
    --_disabled-handle-elevation: var(--md-switch-disabled-handle-elevation, 0);
    --_disabled-handle-opacity: var(--md-switch-disabled-handle-opacity, 0.38);
    --_disabled-selected-handle-color: var(
      --md-switch-disabled-selected-handle-color,
      rgb(var(--md-sys-color-surface-rgb, 255, 251, 254), 1)
    );
    --_disabled-selected-handle-opacity: var(
      --md-switch-disabled-selected-handle-opacity,
      1
    );
    --_disabled-selected-icon-color: var(
      --md-switch-disabled-selected-icon-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.38)
    );
    --_disabled-selected-icon-opacity: var(
      --md-switch-disabled-selected-icon-opacity,
      0.38
    );
    --_disabled-selected-track-color: var(
      --md-switch-disabled-selected-track-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.12)
    );
    --_disabled-track-opacity: var(--md-switch-disabled-track-opacity, 0.12);
    --_disabled-unselected-handle-color: var(
      --md-switch-disabled-unselected-handle-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.38)
    );
    --_disabled-unselected-handle-opacity: var(
      --md-switch-disabled-unselected-handle-opacity,
      0.38
    );
    --_disabled-unselected-icon-color: var(
      --md-switch-disabled-unselected-icon-color,
      rgb(var(--md-sys-color-surface-variant-rgb, 231, 224, 236), 0.38)
    );
    --_disabled-unselected-icon-opacity: var(
      --md-switch-disabled-unselected-icon-opacity,
      0.38
    );
    --_disabled-unselected-track-color: var(
      --md-switch-disabled-unselected-track-color,
      rgb(var(--md-sys-color-surface-variant-rgb, 231, 224, 236), 0.12)
    );
    --_disabled-unselected-track-outline-color: var(
      --md-switch-disabled-unselected-track-outline-color,
      rgb(var(--md-sys-color-on-surface-rgb, 28, 27, 31), 0.12)
    );
    --_handle-elevation: var(--md-switch-handle-elevation, 1);
    --_handle-height: var(--md-switch-handle-height, 20px);
    --_handle-shadow-color: var(
      --md-switch-handle-shadow-color,
      var(--md-sys-color-shadow, #000)
    );
    --_handle-width: var(--md-switch-handle-width, 20px);
    --_pressed-handle-height: var(--md-switch-pressed-handle-height, 28px);
    --_pressed-handle-width: var(--md-switch-pressed-handle-width, 28px);
    --_selected-focus-handle-color: var(
      --md-switch-selected-focus-handle-color,
      var(--md-sys-color-primary-container, #eaddff)
    );
    --_selected-focus-icon-color: var(
      --md-switch-selected-focus-icon-color,
      var(--md-sys-color-on-primary-container, #21005d)
    );
    --_selected-focus-state-layer-color: var(
      --md-switch-selected-focus-state-layer-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-focus-state-layer-opacity: var(
      --md-switch-selected-focus-state-layer-opacity,
      0.12
    );
    --_selected-focus-track-color: var(
      --md-switch-selected-focus-track-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-handle-color: var(
      --md-switch-selected-handle-color,
      var(--md-sys-color-on-primary, #fff)
    );
    --_selected-handle-height: var(--md-switch-selected-handle-height, 24px);
    --_selected-handle-width: var(--md-switch-selected-handle-width, 24px);
    --_selected-hover-handle-color: var(
      --md-switch-selected-hover-handle-color,
      var(--md-sys-color-primary-container, #eaddff)
    );
    --_selected-hover-icon-color: var(
      --md-switch-selected-hover-icon-color,
      var(--md-sys-color-on-primary-container, #21005d)
    );
    --_selected-hover-state-layer-color: var(
      --md-switch-selected-hover-state-layer-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-hover-state-layer-opacity: var(
      --md-switch-selected-hover-state-layer-opacity,
      0.08
    );
    --_selected-hover-track-color: var(
      --md-switch-selected-hover-track-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-icon-color: var(
      --md-switch-selected-icon-color,
      var(--md-sys-color-on-primary-container, #21005d)
    );
    --_selected-icon-size: var(--md-switch-selected-icon-size, 16px);
    --_selected-pressed-handle-color: var(
      --md-switch-selected-pressed-handle-color,
      var(--md-sys-color-primary-container, #eaddff)
    );
    --_selected-pressed-icon-color: var(
      --md-switch-selected-pressed-icon-color,
      var(--md-sys-color-on-primary-container, #21005d)
    );
    --_selected-pressed-state-layer-color: var(
      --md-switch-selected-pressed-state-layer-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-pressed-state-layer-opacity: var(
      --md-switch-selected-pressed-state-layer-opacity,
      0.12
    );
    --_selected-pressed-track-color: var(
      --md-switch-selected-pressed-track-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_selected-track-color: var(
      --md-switch-selected-track-color,
      var(--md-sys-color-primary, #6750a4)
    );
    --_state-layer-shape: var(--md-switch-state-layer-shape, 9999px);
    --_state-layer-size: var(--md-switch-state-layer-size, 40px);
    --_track-height: var(--md-switch-track-height, 32px);
    --_track-outline-width: var(--md-switch-track-outline-width, 2px);
    --_track-width: var(--md-switch-track-width, 52px);
    --_unselected-focus-handle-color: var(
      --md-switch-unselected-focus-handle-color,
      var(--md-sys-color-on-surface-variant, #49454f)
    );
    --_unselected-focus-icon-color: var(
      --md-switch-unselected-focus-icon-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-focus-state-layer-color: var(
      --md-switch-unselected-focus-state-layer-color,
      var(--md-sys-color-on-surface, #1c1b1f)
    );
    --_unselected-focus-state-layer-opacity: var(
      --md-switch-unselected-focus-state-layer-opacity,
      0.12
    );
    --_unselected-focus-track-color: var(
      --md-switch-unselected-focus-track-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-focus-track-outline-color: var(
      --md-switch-unselected-focus-track-outline-color,
      var(--md-sys-color-outline, #79747e)
    );
    --_unselected-handle-color: var(
      --md-switch-unselected-handle-color,
      var(--md-sys-color-outline, #79747e)
    );
    --_unselected-handle-height: var(
      --md-switch-unselected-handle-height,
      16px
    );
    --_unselected-handle-width: var(--md-switch-unselected-handle-width, 16px);
    --_unselected-hover-handle-color: var(
      --md-switch-unselected-hover-handle-color,
      var(--md-sys-color-on-surface-variant, #49454f)
    );
    --_unselected-hover-icon-color: var(
      --md-switch-unselected-hover-icon-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-hover-state-layer-color: var(
      --md-switch-unselected-hover-state-layer-color,
      var(--md-sys-color-on-surface, #1c1b1f)
    );
    --_unselected-hover-state-layer-opacity: var(
      --md-switch-unselected-hover-state-layer-opacity,
      0.08
    );
    --_unselected-hover-track-color: var(
      --md-switch-unselected-hover-track-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-hover-track-outline-color: var(
      --md-switch-unselected-hover-track-outline-color,
      var(--md-sys-color-outline, #79747e)
    );
    --_unselected-icon-color: var(
      --md-switch-unselected-icon-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-icon-size: var(--md-switch-unselected-icon-size, 16px);
    --_unselected-pressed-handle-color: var(
      --md-switch-unselected-pressed-handle-color,
      var(--md-sys-color-on-surface-variant, #49454f)
    );
    --_unselected-pressed-icon-color: var(
      --md-switch-unselected-pressed-icon-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-pressed-state-layer-color: var(
      --md-switch-unselected-pressed-state-layer-color,
      var(--md-sys-color-on-surface, #1c1b1f)
    );
    --_unselected-pressed-state-layer-opacity: var(
      --md-switch-unselected-pressed-state-layer-opacity,
      0.12
    );
    --_unselected-pressed-track-color: var(
      --md-switch-unselected-pressed-track-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_unselected-pressed-track-outline-color: var(
      --md-switch-unselected-pressed-track-outline-color,
      var(--md-sys-color-outline, #79747e)
    );
    --_unselected-track-color: var(
      --md-switch-unselected-track-color,
      var(--md-sys-color-surface-variant, #e7e0ec)
    );
    --_with-icon-handle-height: var(--md-switch-with-icon-handle-height, 24px);
    --_with-icon-handle-width: var(--md-switch-with-icon-handle-width, 24px);
    --_unselected-track-outline-color: var(
      --md-switch-unselected-track-outline-color,
      var(--md-sys-color-outline, #79747e)
    );
  }
`;
