/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Toolbar color configuration types. */
export type ToolbarColor = 'standard' | 'vibrant';

/** Toolbar color configurations. */
export const TOOLBAR_COLORS = {
  standard: 'standard',
  vibrant: 'vibrant',
} as const;

/** Toolbar orientation configuration types. */
export type ToolbarOrientation = 'horizontal' | 'vertical';

/** Toolbar orientation configurations. */
export const TOOLBAR_ORIENTATIONS = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

/** Toolbar classes constants. */
export const TOOLBAR_CLASSES = {
  toolbar: 'toolbar',
  toolbarStandard: 'toolbar-standard',
  toolbarVibrant: 'toolbar-vibrant',
  toolbarHorizontal: 'toolbar-horizontal',
  toolbarVertical: 'toolbar-vertical',
  toolbarDocked: 'toolbar-docked',
  separator: 'toolbar-separator',
} as const;

/** The state provided to the `toolbarClasses()` function. */
export interface ToolbarClassesState {
  /** The color scheme of the toolbar. */
  color?: ToolbarColor;
  /** The layout orientation of the toolbar. */
  orientation?: ToolbarOrientation;
  /** Whether the toolbar is docked across the container width. */
  docked?: boolean;
}

/**
 * Returns toolbar classes to apply based on the given state.
 *
 * @param state The state of the toolbar.
 * @return An object of class names and truthy values if they apply.
 */
export function toolbarClasses({
  color = TOOLBAR_COLORS.standard,
  orientation = TOOLBAR_ORIENTATIONS.horizontal,
  docked = false,
}: ToolbarClassesState = {}): ClassInfo {
  return {
    [TOOLBAR_CLASSES.toolbar]: true,
    [TOOLBAR_CLASSES.toolbarStandard]:
      color === TOOLBAR_COLORS.standard || !color,
    [TOOLBAR_CLASSES.toolbarVibrant]: color === TOOLBAR_COLORS.vibrant,
    [TOOLBAR_CLASSES.toolbarHorizontal]:
      orientation === TOOLBAR_ORIENTATIONS.horizontal || !orientation,
    [TOOLBAR_CLASSES.toolbarVertical]:
      orientation === TOOLBAR_ORIENTATIONS.vertical,
    [TOOLBAR_CLASSES.toolbarDocked]: docked,
  };
}

/**
 * Lit directive for element class styling.
 *
 * @example
 * ```ts
 * html`<div class="${toolbar({color: 'vibrant'})}">
 *   <button class="toolbar-icon-btn"><md-icon>undo</md-icon></button>
 * </div>`;
 * ```
 */
export const toolbar = createClassMapDirective<ToolbarClassesState>({
  getClasses: toolbarClasses,
});
