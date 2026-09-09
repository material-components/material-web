/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';

import {createClassMapDirective} from '../shared/directives.js';

/** App Bar size configuration types. */
export type AppBarSize = 'sm' | 'md' | 'lg';

/** App Bar size configurations. */
export const APP_BAR_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

/** App Bar variant configuration types. */
export type AppBarVariant = 'standard' | 'search';

/** App Bar variant configurations. */
export const APP_BAR_VARIANTS = {
  standard: 'standard',
  search: 'search',
} as const;

/** App Bar classes. */
export const APP_BAR_CLASSES = {
  appBar: 'app-bar',
  appBarSm: 'app-bar-sm',
  appBarMd: 'app-bar-md',
  appBarLg: 'app-bar-lg',
  appBarWithSubtitle: 'app-bar-with-subtitle',
  appBarSearch: 'app-bar-search',
  appBarScrolled: 'app-bar-scrolled',
} as const;

/** The state provided to the `appBarClasses()` function. */
export interface AppBarClassesState {
  /** The size of the app bar (`sm`, `md`, `lg`). */
  size?: AppBarSize;
  /** Whether the app bar has a subtitle. */
  withSubtitle?: boolean;
  /** The behavior variant (`standard` or `search`). */
  variant?: AppBarVariant;
  /** Whether the app bar is in a scrolled or docked state (`.app-bar-scrolled`). */
  scrolled?: boolean;
}

/**
 * Returns the app bar classes to apply to an element based on the given state.
 *
 * @param state The state of the app bar.
 * @return An object of class names and truthy values if they apply.
 */
export function appBarClasses({
  size = 'sm',
  withSubtitle = false,
  variant = 'standard',
  scrolled = false,
}: AppBarClassesState = {}): ClassInfo {
  return {
    [APP_BAR_CLASSES.appBar]: true,
    [APP_BAR_CLASSES.appBarSm]: size === APP_BAR_SIZES.sm || !size,
    [APP_BAR_CLASSES.appBarMd]: size === APP_BAR_SIZES.md,
    [APP_BAR_CLASSES.appBarLg]: size === APP_BAR_SIZES.lg,
    [APP_BAR_CLASSES.appBarWithSubtitle]: withSubtitle,
    [APP_BAR_CLASSES.appBarSearch]: variant === APP_BAR_VARIANTS.search,
    [APP_BAR_CLASSES.appBarScrolled]: scrolled,
  };
}

/**
 * Sets up optional scroll target tracking for the given app bar element when an explicit `scrollTarget` is provided.
 *
 * @param appBar The element on which to set up app bar functionality.
 * @param opts Setup options, containing an explicit `scrollTarget` and optional cleanup `signal`.
 */
export function setupAppBar(
  appBar: HTMLElement,
  opts?: {signal?: AbortSignal; scrollTarget?: HTMLElement | Window},
): void {
  if (!opts?.scrollTarget) {
    return;
  }
  const target = opts.scrollTarget;
  const signal = opts.signal;

  const onScroll = () => {
    if (signal?.aborted) return;
    let scrollTop = 0;
    if (target instanceof Window) {
      scrollTop = target.scrollY || target.document.documentElement.scrollTop;
    } else if (target instanceof HTMLElement) {
      scrollTop = target.scrollTop;
    }
    const isScrolled = scrollTop > 0;
    const wasScrolled = appBar.classList.contains(
      APP_BAR_CLASSES.appBarScrolled,
    );
    if (isScrolled !== wasScrolled) {
      appBar.classList.toggle(APP_BAR_CLASSES.appBarScrolled, isScrolled);
      appBar.dispatchEvent(
        new CustomEvent('scrollstatechange', {
          bubbles: true,
          composed: true,
          detail: {scrolled: isScrolled},
        }),
      );
    }
  };

  target.addEventListener('scroll', onScroll, {passive: true, signal});
  onScroll();
}

/**
 * A Lit directive that adds app bar styling and optional scroll tracking functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${appBar({size: 'md', scrolled: true})}">
 *   <div class="app-bar-top-row">...</div>
 *   <div class="app-bar-bottom-row">...</div>
 * </div>`;
 * ```
 */
export const appBar = createClassMapDirective({
  getClasses: appBarClasses,
  setupElement: setupAppBar,
});
