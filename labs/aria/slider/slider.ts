/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  LitElement,
  PropertyValues,
  css,
  html,
  isServer,
} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {redispatchEvent} from '../../../internal/events/redispatch-event.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {mixinElementInternals} from '../../behaviors/element-internals.js';

const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement, number>;
}

/**
 * An element implementing the proposed `<md-aria-slider>` primitive.
 *
 * It coordinates slotted light-DOM `<input type="range">` elements for both
 * single-thumb and range (dual-thumb) sliders, computing and publishing unitless
 * fractions (`--md-aria-slider-start-fraction` and `--md-aria-slider-end-fraction`)
 * to inline styles on the host.
 *
 * ARIA-in-HTML ownership trade-off:
 * - In range mode, the component manages `startInput.ariaValueMax` and
 *   `endInput.ariaValueMin` via the IDL to fulfill the WAI-ARIA Slider pattern
 *   for multi-thumb sliders.
 * - In single-thumb mode, consumer-authored ARIA attributes (such as
 *   `aria-valuemin` / `aria-valuemax`) are strictly preserved and never cleared.
 *
 * Known limitations:
 * - TODO(b/561802692): form.reset() leaves fractions stale (fires no event; host
 *   has no formResetCallback since host is not form-associated).
 * - TODO(b/561802692): Imperative `input.valueAsNumber = x` without a dispatched
 *   event is unobservable; consumers must dispatch an `input` event.
 * - TODO(b/561802692): In Firefox, real-pointer-drag flips may deliver a clamped
 *   `input` after `pointerup`; the synthetic `change` event can then carry a stale
 *   value while the slider values remain correct.
 *
 * @slot start - The first thumb in range mode.
 * @slot - The default slot, holding the single thumb or the second thumb in range mode.
 * @cssprop [--md-aria-slider-start-fraction=0] - The normalized fraction (0 to 1) of the start thumb.
 * @cssprop [--md-aria-slider-end-fraction=0] - The normalized fraction (0 to 1) of the end thumb.
 * @cssstate dragging - True when the slider thumb is being dragged or keyed.
 * @fires input - Dispatched when the slider value changes via user interaction.
 * @fires change - Dispatched when the slider interaction completes.
 */
export class AriaSliderElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none;
      }

      :host([range]) {
        position: relative;
        --_midpoint: calc(
          100% *
            (
              var(--md-aria-slider-start-fraction, 0) +
                (
                  var(--md-aria-slider-end-fraction, 0) - var(
                      --md-aria-slider-start-fraction,
                      0
                    )
                ) /
                2
            )
        );
      }

      :host([range]) slot[name='start']::slotted(input[type='range']) {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        inline-size: 100%;
        block-size: 100%;
        margin: 0;
        clip-path: var(
          --_start-clip,
          inset(0 calc(100% - var(--_midpoint)) 0 0)
        );
      }

      :host([range]:dir(rtl)) slot[name='start']::slotted(input[type='range']) {
        clip-path: var(
          --_start-clip,
          inset(0 0 0 calc(100% - var(--_midpoint)))
        );
      }

      :host([range]) slot:not([name])::slotted(input[type='range']) {
        display: block;
        box-sizing: border-box;
        inline-size: 100%;
        block-size: 100%;
        margin: 0;
        clip-path: var(--_end-clip, inset(0 0 0 var(--_midpoint)));
      }

      :host([range]:dir(rtl)) slot:not([name])::slotted(input[type='range']) {
        clip-path: var(--_end-clip, inset(0 var(--_midpoint) 0 0));
      }
    `,
  ];

  @queryAssignedElements({slot: 'start', flatten: true, selector: 'input'})
  private readonly startSlotInputs!: HTMLInputElement[];

  @queryAssignedElements({flatten: true, selector: 'input'})
  private readonly defaultSlotInputs!: HTMLInputElement[];

  @property({type: Boolean, reflect: true}) range = false;

  private action?: Action;
  private isRedispatching = false;
  private readonly lastNotifiedValues = new WeakMap<HTMLInputElement, number>();
  private hasSetStartAriaValueMax = false;
  private hasSetEndAriaValueMin = false;
  private readonly observedInputs = new Set<HTMLInputElement>();

  private readonly inputObserver = isServer
    ? null
    : new MutationObserver(() => {
        this.syncSlider();
      });

  protected get startInput(): HTMLInputElement | null {
    if (!this.range) return null;
    return this.startSlotInputs.find((i) => i.type === 'range') ?? null;
  }

  protected get endInput(): HTMLInputElement | null {
    return this.defaultSlotInputs.find((i) => i.type === 'range') ?? null;
  }

  constructor() {
    super();
    if (isServer) return;
    setupDispatchHooks(this, 'pointerdown', 'keydown');
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
    this.addEventListener(
      'lostpointercapture',
      this.handleLostPointerCapture.bind(this),
      true,
    );
    this.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.addEventListener('input', this.handleInput.bind(this), true);
    this.addEventListener('change', this.handleChange.bind(this), true);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.observeInputs();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.inputObserver?.disconnect();
    this.observedInputs.clear();
  }

  protected override render() {
    return html`<slot name="start" @slotchange=${this.handleSlotChange}></slot
      ><slot @slotchange=${this.handleSlotChange}></slot>`;
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    this.observeInputs();
    this.syncSlider();
  }

  protected handleSlotChange() {
    this.observeInputs();
    this.syncSlider();
  }

  override focus(options?: FocusOptions) {
    const target = [this.startInput, this.endInput].find(
      (input): input is HTMLInputElement => Boolean(input && !input.disabled),
    );
    if (target) {
      target.focus(options);
    } else {
      super.focus(options);
    }
  }

  private observeInputs() {
    if (!this.inputObserver) return;
    const currentInputs = [...this.startSlotInputs, ...this.defaultSlotInputs];
    const isSame =
      currentInputs.length === this.observedInputs.size &&
      currentInputs.every((input) => this.observedInputs.has(input));
    if (isSame) return;

    this.inputObserver.disconnect();
    this.observedInputs.clear();
    for (const input of currentInputs) {
      this.observedInputs.add(input);
      // Note: We observe 'value' attribute (which reflects defaultValue), not IDL value.
      // We do NOT observe aria-* attributes to avoid infinite loops when syncSlider writes ariaValueMin/Max.
      this.inputObserver.observe(input, {
        attributeFilter: ['min', 'max', 'step', 'value'],
      });
    }
  }

  private handlePointerDown(event: PointerEvent) {
    const target = event
      .composedPath()
      .find(
        (el): el is HTMLInputElement =>
          el === this.startInput || el === this.endInput,
      );
    if (!target) return;

    afterDispatch(event, () => {
      if (event.defaultPrevented) return;
      this.startAction(target, event);
    });
  }

  private handleKeyDown(event: KeyboardEvent) {
    const target = event
      .composedPath()
      .find(
        (el): el is HTMLInputElement =>
          el === this.startInput || el === this.endInput,
      );
    if (!target) return;

    afterDispatch(event, () => {
      if (event.defaultPrevented) return;
      this.startAction(target, event);
    });
  }

  private handleKeyUp(event: KeyboardEvent) {
    const target = event
      .composedPath()
      .find(
        (el): el is HTMLInputElement =>
          el === this.startInput || el === this.endInput,
      );
    if (!target) return;
    this.endInteraction();
  }

  private handlePointerUp(event: PointerEvent) {
    if (!this.action) {
      this.endInteraction();
      return;
    }
    const {target, values, flipped} = this.action;
    // TODO(b/561802692): Firefox may deliver a clamped input after pointerup;
    // the synthetic flip change can then carry a stale value.
    if (flipped) {
      target.focus();
      if (target.valueAsNumber !== values.get(target)) {
        target.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
    this.endInteraction();
  }

  private handlePointerCancel() {
    this.endInteraction();
  }

  private handleLostPointerCapture() {
    this.endInteraction();
  }

  private startAction(target: HTMLInputElement, event: Event) {
    this[toggleState]('dragging', true);
    this.lastNotifiedValues.set(target, target.valueAsNumber);
    if (this.startInput) {
      this.lastNotifiedValues.set(
        this.startInput,
        this.startInput.valueAsNumber,
      );
    }
    if (this.endInput) {
      this.lastNotifiedValues.set(this.endInput, this.endInput.valueAsNumber);
    }

    if (!this.range || !this.startInput || !this.endInput) return;

    const fixed = target === this.startInput ? this.endInput : this.startInput;
    this.action = {
      canFlip: event.type === 'pointerdown',
      flipped: false,
      target,
      fixed,
      values: new Map([
        [target, target.valueAsNumber],
        [fixed, fixed.valueAsNumber],
      ]),
    };
  }

  private finishAction() {
    this.action = undefined;
  }

  private endInteraction() {
    this.finishAction();
    this[toggleState]('dragging', false);
  }

  private needsClamping(target: HTMLInputElement): boolean {
    if (!this.range || !this.startInput || !this.endInput) {
      return false;
    }
    if (target === this.startInput) {
      return this.startInput.valueAsNumber > this.endInput.valueAsNumber;
    }
    if (target === this.endInput) {
      return this.endInput.valueAsNumber < this.startInput.valueAsNumber;
    }
    return false;
  }

  private clampAction(target: HTMLInputElement): boolean {
    if (!this.needsClamping(target)) {
      return false;
    }
    if (target === this.startInput && this.endInput) {
      this.startInput.valueAsNumber = this.endInput.valueAsNumber;
      if (this.startInput.valueAsNumber > this.endInput.valueAsNumber) {
        try {
          this.startInput.stepDown();
        } catch {}
      }
      if (this.startInput.valueAsNumber > this.endInput.valueAsNumber) {
        try {
          this.endInput.stepUp();
        } catch {}
      }
      return true;
    }
    if (target === this.endInput && this.startInput) {
      this.endInput.valueAsNumber = this.startInput.valueAsNumber;
      if (this.endInput.valueAsNumber < this.startInput.valueAsNumber) {
        try {
          this.endInput.stepUp();
        } catch {}
      }
      if (this.endInput.valueAsNumber < this.startInput.valueAsNumber) {
        try {
          this.startInput.stepDown();
        } catch {}
      }
      return true;
    }
    return false;
  }

  private isActionFlipped(): boolean {
    const {action} = this;
    if (!action) return false;

    const {target, fixed, values} = action;
    if (action.canFlip) {
      const coincident = values.get(target) === values.get(fixed);
      if (coincident && this.needsClamping(target)) {
        action.canFlip = false;
        action.flipped = true;
        action.target = fixed;
        action.fixed = target;
      }
    }
    return action.flipped;
  }

  private flipAction(): boolean {
    if (!this.action) return false;
    const {target, fixed, values} = this.action;
    const changed = target.valueAsNumber !== fixed.valueAsNumber;
    target.valueAsNumber = fixed.valueAsNumber;
    fixed.valueAsNumber = values.get(fixed)!;
    return changed;
  }

  private handleInput(event: Event) {
    if (this.isRedispatching) return;

    const target = event.target as HTMLElement;
    if (target !== this.startInput && target !== this.endInput) {
      return;
    }

    const inputTarget = target as HTMLInputElement;
    let stopPropagation = false;
    let redispatch = false;

    if (this.range && this.startInput && this.endInput) {
      if (this.isActionFlipped()) {
        stopPropagation = true;
        redispatch = this.flipAction();
      }
      const clampTarget = this.action?.target ?? inputTarget;
      if (this.clampAction(clampTarget)) {
        const lastNotified = this.lastNotifiedValues.get(clampTarget);
        if (clampTarget.valueAsNumber === lastNotified) {
          stopPropagation = true;
          redispatch = false;
        } else {
          if (!redispatch) {
            stopPropagation = false;
          }
        }
      }
    }

    this.syncSlider();

    if (stopPropagation) {
      event.stopPropagation();
    } else if (!redispatch) {
      const activeTarget = this.action?.target ?? inputTarget;
      this.lastNotifiedValues.set(activeTarget, activeTarget.valueAsNumber);
    }

    if (redispatch && this.action) {
      this.lastNotifiedValues.set(
        this.action.target,
        this.action.target.valueAsNumber,
      );
      this.isRedispatching = true;
      try {
        redispatchEvent(this.action.target, event);
      } finally {
        this.isRedispatching = false;
      }
    }
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLElement;
    if (target !== this.startInput && target !== this.endInput) {
      return;
    }

    const input = target as HTMLInputElement;
    const action = this.action;
    const squelch =
      action &&
      action.target === input &&
      input.valueAsNumber === action.values.get(input);

    if (squelch) {
      event.stopPropagation();
    }
    this.finishAction();
  }

  private getFraction(input: HTMLInputElement): number {
    const min =
      Number.isFinite(Number(input.min)) && input.min !== ''
        ? Number(input.min)
        : 0;
    const max =
      Number.isFinite(Number(input.max)) && input.max !== ''
        ? Number(input.max)
        : 100;
    const span = max - min;
    if (!Number.isFinite(span) || span <= 0) {
      return 0;
    }
    const val = input.valueAsNumber;
    if (!Number.isFinite(val)) {
      return 0;
    }
    return Math.min(1, Math.max(0, (val - min) / span));
  }

  protected syncSlider() {
    const {endInput, startInput, range} = this;
    if (!endInput) {
      this.style.removeProperty('--md-aria-slider-start-fraction');
      this.style.removeProperty('--md-aria-slider-end-fraction');
      this.style.removeProperty('--_start-clip');
      this.style.removeProperty('--_end-clip');
      return;
    }

    if (
      !isServer &&
      range &&
      !startInput &&
      this.defaultSlotInputs.filter((i) => i.type === 'range').length > 1
    ) {
      console.warn(
        '<md-aria-slider range> requires the first input to have slot="start". ' +
          'Multiple range inputs were found in the default slot.',
      );
    }

    const endFraction = this.getFraction(endInput);
    this.style.setProperty(
      '--md-aria-slider-end-fraction',
      String(endFraction),
    );
    if (!this.lastNotifiedValues.has(endInput)) {
      this.lastNotifiedValues.set(endInput, endInput.valueAsNumber);
    }

    if (range && startInput) {
      this.style.removeProperty('--_start-clip');
      this.style.removeProperty('--_end-clip');
      const startFraction = this.getFraction(startInput);
      this.style.setProperty(
        '--md-aria-slider-start-fraction',
        String(startFraction),
      );
      if (!this.lastNotifiedValues.has(startInput)) {
        this.lastNotifiedValues.set(startInput, startInput.valueAsNumber);
      }
      startInput.ariaValueMax = String(endInput.valueAsNumber);
      this.hasSetStartAriaValueMax = true;
      endInput.ariaValueMin = String(startInput.valueAsNumber);
      this.hasSetEndAriaValueMin = true;
    } else {
      this.style.setProperty('--md-aria-slider-start-fraction', '0');
      if (range && !startInput) {
        this.style.setProperty('--_start-clip', 'none');
        this.style.setProperty('--_end-clip', 'none');
      } else {
        this.style.removeProperty('--_start-clip');
        this.style.removeProperty('--_end-clip');
      }
      if (startInput && this.hasSetStartAriaValueMax) {
        startInput.ariaValueMax = null;
        this.hasSetStartAriaValueMax = false;
      }
      if (this.hasSetEndAriaValueMin) {
        endInput.ariaValueMin = null;
        this.hasSetEndAriaValueMin = false;
      }
    }
  }
}
