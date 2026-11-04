/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, type TemplateResult} from 'lit';
import {type ClassInfo} from 'lit/directives/class-map.js';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../../internal/events/dispatch-hooks.js';
import {focusRingClasses} from '../focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {isDisabled, PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Segmented Button selection modes. */
export const SEGMENTED_BUTTON_SELECTIONS = {
  single: 'single',
  multiple: 'multiple',
} as const;

/** Segmented Button selection mode type. */
export type SegmentedButtonSelection =
  (typeof SEGMENTED_BUTTON_SELECTIONS)[keyof typeof SEGMENTED_BUTTON_SELECTIONS];

/** Segmented Button density scale. */
export const SEGMENTED_BUTTON_DENSITIES = [0, -1, -2, -3] as const;

/** Segmented Button density type. */
export type SegmentedButtonDensity =
  (typeof SEGMENTED_BUTTON_DENSITIES)[number];

/** Normalizes a number to a valid SegmentedButtonDensity. */
export function normalizeDensity(density?: number): SegmentedButtonDensity {
  if (density === undefined || Number.isNaN(density)) {
    return 0;
  }
  const rounded = Math.round(density);
  if (rounded <= -3) return -3;
  if (rounded >= 0) return 0;
  return rounded as SegmentedButtonDensity;
}

/**
 * Segmented Button Set classes.
 *
 * For a disabled plain-markup set, also set `aria-disabled="true"` on the set,
 * or `disabled` on each segment.
 */
export const SEGMENTED_BUTTON_SET_CLASSES = {
  segmentedBtnSet: 'segmented-btn-set',
  segmentedBtnSetDense1: 'segmented-btn-set-dense-1',
  segmentedBtnSetDense2: 'segmented-btn-set-dense-2',
  segmentedBtnSetDense3: 'segmented-btn-set-dense-3',
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** Segmented Button classes. */
export const SEGMENTED_BUTTON_CLASSES = {
  segmentedBtn: 'segmented-btn',
  segmentedBtnSelected: 'segmented-btn-selected',
  segmentedBtnWithIcon: 'segmented-btn-with-icon',
  segmentedBtnIconOnly: 'segmented-btn-icon-only',
  segmentedBtnGraphic: 'segmented-btn-graphic',
  segmentedBtnCheckmark: 'segmented-btn-checkmark',
  segmentedBtnIcon: 'segmented-btn-icon',
  segmentedBtnLabel: 'segmented-btn-label',
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The options provided to `segmentedButtonSetClasses()`. */
export interface SegmentedButtonSetClassOptions {
  density?: SegmentedButtonDensity;
  disabled?: boolean;
}

/**
 * Returns the segmented button set classes based on state.
 */
export function segmentedButtonSetClasses({
  density = 0,
  disabled = false,
}: SegmentedButtonSetClassOptions = {}): ClassInfo {
  return {
    [SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSet]: true,
    [SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense1]: density === -1,
    [SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense2]: density === -2,
    [SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense3]: density === -3,
    [SEGMENTED_BUTTON_SET_CLASSES.disabled]: disabled,
  };
}

/** The options provided to `segmentedButtonClasses()`. */
export interface SegmentedButtonClassOptions {
  selected?: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  iconOnly?: boolean;
}

/**
 * Returns the segmented button classes based on state.
 */
export function segmentedButtonClasses({
  selected = false,
  disabled = false,
  withIcon = false,
  iconOnly = false,
}: SegmentedButtonClassOptions = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [SEGMENTED_BUTTON_CLASSES.segmentedBtn]: true,
    [SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected]: selected,
    [SEGMENTED_BUTTON_CLASSES.disabled]: disabled,
    [SEGMENTED_BUTTON_CLASSES.segmentedBtnWithIcon]: withIcon,
    [SEGMENTED_BUTTON_CLASSES.segmentedBtnIconOnly]: iconOnly,
  };
}

/**
 * Normalizes an array of selection states according to the selection mode.
 *
 * @param selected Array of selection states.
 * @param opts Selection options with optional preferred index.
 * @return Normalized array of selection states.
 */
export function normalizeSegmentSelection(
  selected: readonly boolean[],
  opts: {selection: SegmentedButtonSelection; preferred?: number},
): boolean[] {
  if (opts.selection === 'multiple') {
    return [...selected];
  }

  if (
    opts.preferred !== undefined &&
    opts.preferred >= 0 &&
    opts.preferred < selected.length &&
    selected[opts.preferred]
  ) {
    const result = new Array<boolean>(selected.length).fill(false);
    result[opts.preferred] = true;
    return result;
  }

  const lastSelectedIndex = selected.lastIndexOf(true);
  if (lastSelectedIndex === -1) {
    return new Array<boolean>(selected.length).fill(false);
  }

  const result = new Array<boolean>(selected.length).fill(false);
  result[lastSelectedIndex] = true;
  return result;
}

/**
 * Sets up segmented button functionality on a single button element.
 *
 * Segmented buttons are set-only and must be used within a segmented button set
 * container.
 */
export function setupSegmentedButton(
  button: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupDispatchHooks(button, 'click');
  setupRipple(button, opts);

  button.addEventListener(
    'click',
    (event) => {
      if (isDisabled(button)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

      afterDispatch(event, () => {
        if (event.defaultPrevented) {
          return;
        }

        const role = button.getAttribute('role');
        const isRadio = role === 'radio';
        const isChecked = button.getAttribute('aria-checked') === 'true';

        if (isRadio && isChecked) {
          return;
        }

        const nextChecked = isRadio ? true : !isChecked;
        button.setAttribute('aria-checked', String(nextChecked));
        if (nextChecked) {
          button.classList.add(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected);
        } else {
          button.classList.remove(
            SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected,
          );
        }

        button.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        button.dispatchEvent(
          new Event('change', {bubbles: true, composed: false}),
        );
      });
    },
    {...opts, capture: true},
  );
}

/**
 * Sets up segmented button set functionality on a container element.
 *
 * For a disabled plain-markup set, also set `aria-disabled="true"` on the set,
 * or `disabled` on each segment.
 */
export function setupSegmentedButtonSet(
  set: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const isDirectSegment = (el: Element): boolean => {
    return (
      el.parentElement === set &&
      el.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtn)
    );
  };

  const blockActivation = (event: Event): void => {
    if (isDisabled(set)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  };
  set.addEventListener('click', blockActivation, {
    capture: true,
    signal: opts?.signal,
  });

  const setIsDisabled = isDisabled(set);
  const directSegments = Array.from(set.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && isDirectSegment(el),
  );
  for (const segment of directSegments) {
    if (setIsDisabled || isDisabled(segment)) {
      segment.setAttribute('aria-checked', 'false');
      segment.classList.remove(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected);
    }
  }

  const radios = directSegments.filter(
    (el) => el.getAttribute('role') === 'radio',
  );
  const next = normalizeSegmentSelection(
    radios.map(
      (r) =>
        !setIsDisabled &&
        !isDisabled(r) &&
        r.getAttribute('aria-checked') === 'true',
    ),
    {selection: 'single'},
  );
  for (let i = 0; i < radios.length; i++) {
    const radio = radios[i];
    const isSelected = !setIsDisabled && !isDisabled(radio) && next[i];
    radio.setAttribute('aria-checked', String(isSelected));
    radio.classList.toggle(
      SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected,
      isSelected,
    );
  }

  const deselectCheckedRadioSiblings = (child: HTMLElement): void => {
    if (
      child.getAttribute('role') === 'radio' &&
      child.getAttribute('aria-checked') === 'true' &&
      !isDisabled(child) &&
      !isDisabled(set)
    ) {
      const directRadios = Array.from(set.children).filter(
        (el): el is HTMLElement =>
          el instanceof HTMLElement &&
          isDirectSegment(el) &&
          el.getAttribute('role') === 'radio',
      );
      const nextSelection = normalizeSegmentSelection(
        directRadios.map(
          (r) => !isDisabled(r) && r.getAttribute('aria-checked') === 'true',
        ),
        {selection: 'single', preferred: directRadios.indexOf(child)},
      );
      for (let i = 0; i < directRadios.length; i++) {
        const radio = directRadios[i];
        const isSelected = !isDisabled(radio) && nextSelection[i];
        radio.setAttribute('aria-checked', String(isSelected));
        radio.classList.toggle(
          SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected,
          isSelected,
        );
      }
    }
  };

  const relay = (event: Event): void => {
    if (event.target === set) return;
    const child = event
      .composedPath()
      .find(
        (node): node is HTMLElement =>
          node instanceof HTMLElement && isDirectSegment(node),
      );
    if (!child) return;

    // Added during capture: runs at target after the segment's own listeners,
    // before the event can bubble to any listener on `set`.
    child.addEventListener(
      event.type,
      (atTarget) => {
        if (atTarget !== event) return;
        event.stopPropagation();
        if (event.type === 'input') {
          deselectCheckedRadioSiblings(child);
        }
        set.dispatchEvent(
          event.type === 'input'
            ? new InputEvent('input', {bubbles: true, composed: true})
            : new Event('change', {bubbles: true}),
        );
      },
      {once: true, signal: opts?.signal},
    );
  };

  set.addEventListener('input', relay, {capture: true, signal: opts?.signal});
  set.addEventListener('change', relay, {capture: true, signal: opts?.signal});
}

/**
 * A Lit directive that applies segmented button set classes and functionality.
 */
export const segmentedButtonSet =
  createClassMapDirective<SegmentedButtonSetClassOptions>({
    getClasses: segmentedButtonSetClasses,
    setupElement: setupSegmentedButtonSet,
  });

/**
 * A Lit directive that applies segmented button classes and functionality.
 *
 * Segmented buttons are set-only and must be used within a segmented button set
 * container.
 */
export const segmentedButton =
  createClassMapDirective<SegmentedButtonClassOptions>({
    getClasses: segmentedButtonClasses,
    setupElement: setupSegmentedButton,
  });

/**
 * SVG path data for the segmented button checkmark.
 * Centerline of the Material Symbols "check" glyph (24x24 viewBox).
 */
export const SEGMENTED_BUTTON_CHECKMARK_PATH =
  'M4.56 11.59 9.55 16.58 19.44 6.69';

/**
 * Renders the checkmark SVG for a segmented button.
 */
export function renderSegmentedButtonCheckmark(): TemplateResult {
  return html`<svg
    class="${SEGMENTED_BUTTON_CLASSES.segmentedBtnCheckmark}"
    aria-hidden="true"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid slice">
    <path
      d="${SEGMENTED_BUTTON_CHECKMARK_PATH}"
      fill="none"
      stroke="currentColor"
      pathLength="1" />
  </svg>`;
}
