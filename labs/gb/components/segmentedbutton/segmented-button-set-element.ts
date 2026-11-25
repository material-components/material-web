/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  type CSSResultOrNative,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {updateClassList} from '../shared/update-class-list.js';

import {
  normalizeDensity,
  normalizeSegmentSelection,
  type SegmentedButtonDensity,
  type SegmentedButtonSelection,
  segmentedButtonSetClasses,
} from './segmented-button.js';
import {
  SegmentedButtonElement,
  segmentGroupDisabled,
  segmentOwner,
  type SegmentOwner,
  segmentPosInSet,
  segmentSelected,
  segmentSelectionMode,
  segmentSetSize,
} from './segmented-button-element.js';
import segmentedButtonStyles from './segmented-button.css' with {type: 'css'}; // github-only
// import segmentedButtonStyles from './segmented-button.cssresult.js'; // google3-only

const baseClass = mixinElementInternals(LitElement);

// LINT.IfChange
/**
 * A Material Design segmented button set component.
 *
 * Authors should set `aria-label` or `aria-labelledby` on the set.
 *
 * @slot - Default slot for segmented buttons.
 * @fires {InputEvent} input - Fired when the selected segment changes. --bubbles --composed
 * @fires {Event} change - Fired when the selected segment changes. --bubbles
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --touch-target-size
 */
// LINT.ThenChange(_segmented-button-tokens.scss)
export class SegmentedButtonSetElement
  extends baseClass
  implements SegmentOwner
{
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    segmentedButtonStyles,
    css`
      :host {
        display: inline-grid;
      }
      :host([hidden]) {
        display: none !important;
      }
    `,
  ];

  /** The selection mode ('single' or 'multiple'). */
  @property({reflect: true}) selection: SegmentedButtonSelection = 'single';

  /** The visual density scale (0, -1, -2, -3). */
  @property({type: Number, reflect: true}) density: SegmentedButtonDensity = 0;

  /** Whether the entire segmented button set is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  @queryAssignedElements({flatten: true})
  private readonly assignedElementsList!: HTMLElement[];

  private prevSegments: SegmentedButtonElement[] = [];

  constructor() {
    super();
    this[internals].role = 'radiogroup';

    // Capture on the host runs before any bubble listener on it, including
    // listeners added before upgrade. The one-shot listener on the segment runs
    // after the segment's own listeners, then contains and re-dispatches.
    const relay = (event: Event): void => {
      if (event.target === this) return;
      const path = event.composedPath();
      const child = this.segments.find((s) => path.includes(s));
      if (!child) return;

      child.addEventListener(
        event.type,
        (atTarget) => {
          if (atTarget !== event) return;
          event.stopPropagation();
          this.dispatchEvent(
            event.type === 'input'
              ? new InputEvent('input', {bubbles: true, composed: true})
              : new Event('change', {bubbles: true}),
          );
        },
        {once: true},
      );
    };

    this.addEventListener('input', relay, {capture: true});
    this.addEventListener('change', relay, {capture: true});
  }

  /** The effective selection mode; unknown values behave as 'single'. */
  private get mode(): SegmentedButtonSelection {
    return this.selection === 'multiple' ? 'multiple' : 'single';
  }

  /** Returns all child `md-gb-segmented-button` elements. */
  get segments(): SegmentedButtonElement[] {
    // Before the first render there is no <slot>; read light-DOM children so
    // `value` bound before first render still applies.
    const nodes = this.hasUpdated
      ? (this.assignedElementsList ?? [])
      : Array.from(this.children).filter(
          (child) => !child.hasAttribute('slot'),
        );
    return nodes.filter(
      (node): node is SegmentedButtonElement =>
        node instanceof SegmentedButtonElement,
    );
  }

  /** Returns currently selected segments. */
  get selectedSegments(): SegmentedButtonElement[] {
    return this.segments.filter((s) => s.selected);
  }

  /** Returns the index of the first selected segment, or -1 if none. */
  get selectedIndex(): number {
    return this.segments.findIndex((s) => s.selected);
  }

  /** Returns indices of all selected segments. */
  get selectedIndices(): number[] {
    const indices: number[] = [];
    const segments = this.segments;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].selected) {
        indices.push(i);
      }
    }
    return indices;
  }

  /** Value of the currently selected segment (or first selected). */
  get value(): string {
    return this.selectedSegments[0]?.value ?? '';
  }

  /** Sets selected segment by value in single-select mode. */
  set value(val: string) {
    if (this.mode !== 'single') return;
    for (const segment of this.segments) {
      segment.selected = segment.value === val;
    }
  }

  /** Values of all currently selected segments. */
  get values(): string[] {
    return this.selectedSegments.map((s) => s.value);
  }

  // Exclusivity is enforced synchronously from the segment's `selected` setter
  // instead of a MutationObserver (cf. ButtonGroup): the set owns its segments,
  // so there is never a transient double selection and programmatic changes
  // stay silent and deterministic.
  [segmentSelected](segment: SegmentedButtonElement): void {
    // Fast path: a non-member resolves to preferred -1, which would not change the selection.
    if (this.mode !== 'single' || !this.segments.includes(segment)) return;
    this.normalizeSelection(segment);
  }

  // Toggling `hidden` does not fire `slotchange` but changes posinset/setsize.
  private readonly hiddenObserver = new MutationObserver(() => {
    this.syncChildren();
  });
  private hasAwaitedSegmentDefinition = false;

  override connectedCallback(): void {
    super.connectedCallback();
    adoptStyles(this, segmentedButtonStyles);
    this.updateClasses();
    this.hiddenObserver.observe(this, {
      attributes: true,
      attributeFilter: ['hidden'],
      subtree: true,
    });
    // Assumes the standard custom element tag 'md-gb-segmented-button'.
    // Segments upgraded after the set connects do not fire `slotchange`.
    // Waiting for definition ensures child segments upgrade and sync their
    // positions, selection mode, and disabled state once defined.
    if (customElements.get('md-gb-segmented-button')) {
      this.handleSlotChange();
    } else if (!this.hasAwaitedSegmentDefinition) {
      this.hasAwaitedSegmentDefinition = true;
      void customElements.whenDefined('md-gb-segmented-button').then(() => {
        if (this.isConnected) this.handleSlotChange();
      });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.hiddenObserver.disconnect();
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('density') || changedProperties.has('disabled')) {
      this.updateClasses();
    }

    if (
      changedProperties.has('selection') ||
      changedProperties.has('disabled')
    ) {
      this[internals].role = this.mode === 'multiple' ? 'group' : 'radiogroup';
      this.syncChildren();
      this.normalizeSelection();
    }

    if (changedProperties.has('disabled')) {
      this[internals].ariaDisabled = this.disabled ? 'true' : null;
    }
  }

  private normalizeSelection(preferred?: SegmentedButtonElement): void {
    const segments = this.segments;
    const isSetDisabled = this.disabled;
    const next = normalizeSegmentSelection(
      segments.map((s) => !isSetDisabled && !s.disabled && s.selected),
      {
        selection: this.mode,
        preferred:
          preferred && !isSetDisabled && !preferred.disabled
            ? segments.indexOf(preferred)
            : undefined,
      },
    );
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isSelected = !isSetDisabled && !segment.disabled && next[i];
      segment.selected = isSelected;
    }
  }

  private updateClasses(): void {
    updateClassList(
      this,
      segmentedButtonSetClasses({
        density: normalizeDensity(this.density),
        disabled: this.disabled,
      }),
    );
  }

  private syncChildren(): void {
    const segments = this.segments;
    const mode = this.mode;
    const visible = segments.filter((s) => !s.hidden);
    for (const segment of segments) {
      segment[segmentOwner] = this;
      segment[segmentSelectionMode] = mode;
      segment[segmentGroupDisabled] = this.disabled;
      const pos = mode === 'single' ? visible.indexOf(segment) + 1 : 0;
      segment[segmentPosInSet] = pos;
      segment[segmentSetSize] = pos > 0 ? visible.length : 0;
    }
  }

  protected handleSlotChange(): void {
    const currentSegments = this.segments;
    for (const segment of this.prevSegments) {
      if (
        !currentSegments.includes(segment) &&
        segment[segmentOwner] === this
      ) {
        segment[segmentOwner] = null;
        segment[segmentGroupDisabled] = false;
        segment[segmentSelectionMode] = 'single';
        segment[segmentPosInSet] = 0;
        segment[segmentSetSize] = 0;
      }
    }
    const addedSegments = currentSegments.filter(
      (s) => !this.prevSegments.includes(s),
    );
    this.prevSegments = [...currentSegments];

    this.syncChildren();

    const addedSelected = addedSegments.filter((s) => s.selected);
    this.normalizeSelection(addedSelected[addedSelected.length - 1]);
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }
}
