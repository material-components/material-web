/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {focusRingClasses} from '@material/web/labs/gb/components/focus/focus-ring.js';
import {
  rippleClasses,
  setupRipple,
} from '@material/web/labs/gb/components/ripple/ripple.js';
import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {
  AsyncDirective,
  AttributePart,
  directive,
  DirectiveParameters,
} from 'lit/async-directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/** Fab color configuration types. */
export type FabColor =
  | 'primary'
  | 'primary-container'
  | 'secondary'
  | 'secondary-container'
  | 'tertiary'
  | 'tertiary-container';

/** Fab size configuration types. */
export type FabSize = 'default' | 'md' | 'lg';

/** Fab color configurations. */
export const FAB_COLORS = {
  primary: 'primary',
  primaryContainer: 'primary-container',
  secondary: 'secondary',
  secondaryContainer: 'secondary-container',
  tertiary: 'tertiary',
  tertiaryContainer: 'tertiary-container',
} as const;

/** Fab size configurations. */
export const FAB_SIZES = {
  default: 'default',
  md: 'md',
  lg: 'lg',
} as const;

/** Fab classes. */
export const FAB_CLASSES = {
  fab: 'fab',
  fabPrimary: 'fab-primary',
  fabPrimaryContainer: 'fab-primary-container',
  fabSecondary: 'fab-secondary',
  fabSecondaryContainer: 'fab-secondary-container',
  fabTertiary: 'fab-tertiary',
  fabTertiaryContainer: 'fab-tertiary-container',
  fabMd: 'fab-md',
  fabLg: 'fab-lg',
  hover: PSEUDO_CLASSES.hover,
  active: PSEUDO_CLASSES.active,
} as const;

/** The state provided to the `fabClasses()` function. */
export interface FabClassesState {
  /** The color of the fab. */
  color?: FabColor;
  /** The size of the fab. */
  size?: FabSize;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
}

/**
 * Returns the fab classes to apply to an element based on the given state.
 *
 * @param state The state of the fab.
 * @return An object of class names and truthy values if they apply.
 */
export function fabClasses({
  color,
  size,
  hover = false,
  active = false,
}: FabClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [FAB_CLASSES.fab]: true,
    [FAB_CLASSES.fabPrimary]: color === FAB_COLORS.primary,
    [FAB_CLASSES.fabPrimaryContainer]:
      color === FAB_COLORS.primaryContainer || !color,
    [FAB_CLASSES.fabSecondary]: color === FAB_COLORS.secondary,
    [FAB_CLASSES.fabSecondaryContainer]:
      color === FAB_COLORS.secondaryContainer,
    [FAB_CLASSES.fabTertiary]: color === FAB_COLORS.tertiary,
    [FAB_CLASSES.fabTertiaryContainer]: color === FAB_COLORS.tertiaryContainer,
    [FAB_CLASSES.fabMd]: size === FAB_SIZES.md,
    [FAB_CLASSES.fabLg]: size === FAB_SIZES.lg,
    [FAB_CLASSES.hover]: hover,
    [FAB_CLASSES.active]: active,
  };
}

/**
 * Sets up fab functionality for the given element.
 *
 * @param fab The element on which to set up fab functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupFab(
  fab: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(fab, opts);
}

/** The state provided to the `fab()` directive. */
export interface FabDirectiveState extends FabClassesState {
  /** Additional classes to apply to the element. */
  classes?: ClassInfo;
}

class FabDirective extends AsyncDirective {
  private element?: HTMLElement;
  private cleanup?: AbortController;

  render(state: FabDirectiveState = {}) {
    return classMap({
      ...(state.classes || {}),
      ...fabClasses(state),
    });
  }

  override update(
    {element}: AttributePart,
    [state]: DirectiveParameters<this>,
  ) {
    if (this.isConnected && element !== this.element) {
      this.element = element as HTMLElement;
      this.disconnected();
      this.reconnected();
    }

    return this.render(state);
  }

  protected override disconnected() {
    this.cleanup?.abort();
  }

  protected override reconnected() {
    if (this.element) {
      this.cleanup = new AbortController();
      setupFab(this.element, {signal: this.cleanup.signal});
    }
  }
}

/**
 * A Lit directive that adds fab styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <button class="${fab()}">
 *     <md-icon>add</md-icon>
 *   </button>
 *
 *   <button class="${fab()}">
 *     <md-icon>add</md-icon>
 *     Extended
 *   </button>
 * `;
 * ```
 */
export const fab = directive(FabDirective);
