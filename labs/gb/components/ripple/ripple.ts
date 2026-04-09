/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {noChange} from 'lit';
import {
  Directive,
  directive,
  ElementPart,
  PartInfo,
  PartType,
} from 'lit/directive.js';
import {type ClassInfo} from 'lit/directives/class-map.js';

/** Ripple classes. */
export const RIPPLE_CLASSES = {
  ripple: 'ripple',
  rippleTarget: 'ripple-target',
  rippleHost: 'ripple-host',
  hover: PSEUDO_CLASSES.hover,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
};

/** The state provided to the `rippleClasses()` function. */
export interface RippleClassesState {
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the ripple classes to apply to an element based on the given state.
 *
 * @param state The state of the ripple.
 * @return An object of class names and truthy values if they apply.
 */
export function rippleClasses({
  hover = false,
  active = false,
  disabled = false,
}: RippleClassesState = {}): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [RIPPLE_CLASSES.hover]: hover,
    [RIPPLE_CLASSES.active]: active,
    [RIPPLE_CLASSES.disabled]: disabled,
  };
}

const MINIMUM_PRESS_MS = 225;
let ripplePropertiesRegistered = false;

/**
 * Sets up ripple functionality for the given element.
 *
 * @param ripple The element on which to set up ripple functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupRipple(
  ripple: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  if (!ripplePropertiesRegistered) {
    const properties = [
      ['--ripple-scale', '0%'],
      ['--ripple-hover-opacity', '0%'],
      ['--ripple-press-opacity', '0%'],
      ['--ripple-x', '50%'],
      ['--ripple-y', '50%'],
    ];

    try {
      for (const [property, value] of properties) {
        CSS.registerProperty({
          name: property,
          syntax: '<percentage>',
          inherits: false,
          initialValue: value,
        });
      }
    } finally {
      ripplePropertiesRegistered = true;
    }
  }

  let minimumPressTimeoutId: number | undefined;
  ripple.addEventListener(
    'pointerdown',
    (event: PointerEvent): void => {
      if (ripple.matches(':disabled,.disabled')) return;

      // Set ripple position to the pointer position.
      const rect = ripple.getBoundingClientRect();
      const x = (event.clientX - rect.x) / rect.width;
      const y = (event.clientY - rect.y) / rect.height;
      ripple.style.setProperty('--ripple-x', `${x * 100}%`);
      ripple.style.setProperty('--ripple-y', `${y * 100}%`);

      // If another pointerdown is received while the ripple is active, restart
      // the active press animation.
      if (ripple.classList.contains(RIPPLE_CLASSES.active)) {
        const pressAnimation = ripple
          .getAnimations()
          .find(
            (animation) =>
              (animation as Partial<CSSAnimation>).animationName ===
              'ripple-press',
          );
        pressAnimation?.cancel();
        pressAnimation?.play();
      }

      // Emulate the `:active` class for a minimum press duration to show the
      // ripple effect on short clicks.
      ripple.classList.add(RIPPLE_CLASSES.active);
      clearTimeout(minimumPressTimeoutId);
      minimumPressTimeoutId = setTimeout(() => {
        ripple.classList.remove(RIPPLE_CLASSES.active);
      }, MINIMUM_PRESS_MS);
    },
    opts,
  );

  ripple.addEventListener(
    'keydown',
    (event: KeyboardEvent): void => {
      // Reset ripple pointer position when a key is pressed.
      ripple.style.removeProperty('--ripple-x');
      ripple.style.removeProperty('--ripple-y');
    },
    opts,
  );
}

class RippleDirective extends Directive {
  private element?: HTMLElement;
  private cleanup?: AbortController;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `ripple` directive must be used on an element');
    }
  }
  render() {}
  override update({element}: ElementPart) {
    if (this.element !== element) {
      this.element = element as HTMLElement;
      this.cleanup?.abort();
      this.cleanup = new AbortController();
      setupRipple(this.element, {signal: this.cleanup.signal});
    }
    return noChange;
  }
}

/**
 * A Lit directive that adds updates the position of a ripple to match pointer
 * interactions. Use with the `.ripple` class.
 *
 * @example
 * ```ts
 * class Component extends LitElement {
 *   static styles = [rippleStyles, css`...`];
 *
 *   render() {
 *     return html`<button class="ripple" ${ripple()}>Ripple effect</button>`;
 *   }
 * }
 * ```
 *
 * Use the `.ripple-target` class if the interactive element is a parent or
 * child of the ripple element.
 *
 * The `ripple()` directive should be applied to the parent element, which may
 * be the `.ripple-target` instead of the `.ripple`.
 *
 * @example
 * ```ts
 * html`
 *   <div class="card ripple" ${ripple()}>
 *     Child interactive element
 *     <button class="ripple-target card-btn"></button>
 *   </div>
 *
 *   <button class="ripple-target" ${ripple()}>
 *     Parent interactive element
 *     <span class="ripple"></span>
 *   </button>
 * `;
 * ```
 */
export const ripple = directive(RippleDirective);
