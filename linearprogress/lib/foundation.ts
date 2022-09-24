/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {getCorrectPropertyName} from '../../motion/util.js';
import {MDCProgressIndicatorFoundation} from '../../progressindicator/foundation.js';

import {MDCLinearProgressAdapter} from './adapter.js';
import {animationDimensionPercentages as percents, cssClasses, strings} from './constants.js';
import {MDCResizeObserver} from './types.js';

/**
 * MDCLinearProgressFoundation provides a base abstract foundation for all
 * linear progress indicators
 */
export class MDCLinearProgressFoundation implements
    MDCProgressIndicatorFoundation {
  protected readonly adapter: MDCLinearProgressAdapter;

  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter(): MDCLinearProgressAdapter {
    return {
      addClass: () => undefined,
      attachResizeObserver: () => null,
      forceLayout: () => undefined,
      getWidth: () => 0,
      hasClass: () => false,
      setBufferBarStyle: () => null,
      setPrimaryBarStyle: () => null,
      setStyle: () => undefined,
      removeAttribute: () => undefined,
      removeClass: () => undefined,
      setAttribute: () => undefined,
    };
  }

  private determinate!: boolean;
  private progress!: number;
  private buffer!: number;
  private observer: MDCResizeObserver|null = null;

  constructor(adapter: Partial<MDCLinearProgressAdapter>) {
    this.adapter = {...MDCLinearProgressFoundation.defaultAdapter, ...adapter};
  }

  init() {
    this.determinate = !this.adapter.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.adapter.addClass(cssClasses.ANIMATION_READY_CLASS);
    this.progress = 0;
    this.buffer = 1;

    this.observer = this.adapter.attachResizeObserver((entries) => {
      if (this.determinate) {
        return;
      }

      for (const entry of entries) {
        if (entry.contentRect) {
          this.calculateAndSetDimensions(entry.contentRect.width);
        }
      }
    });

    if (!this.determinate && this.observer) {
      this.calculateAndSetDimensions(this.adapter.getWidth());
    }
  }

  setDeterminate(isDeterminate: boolean) {
    this.determinate = isDeterminate;

    if (this.determinate) {
      this.adapter.removeClass(cssClasses.INDETERMINATE_CLASS);
      this.adapter.setAttribute(
          strings.ARIA_VALUENOW, this.progress.toString());
      this.adapter.setAttribute(strings.ARIA_VALUEMAX, '1');
      this.adapter.setAttribute(strings.ARIA_VALUEMIN, '0');
      this.setPrimaryBarProgress(this.progress);
      this.setBufferBarProgress(this.buffer);

      return;
    }

    if (this.observer) {
      this.calculateAndSetDimensions(this.adapter.getWidth());
    }

    this.adapter.addClass(cssClasses.INDETERMINATE_CLASS);
    this.adapter.removeAttribute(strings.ARIA_VALUENOW);
    this.adapter.removeAttribute(strings.ARIA_VALUEMAX);
    this.adapter.removeAttribute(strings.ARIA_VALUEMIN);
    this.setPrimaryBarProgress(1);
    this.setBufferBarProgress(1);
  }

  isDeterminate() {
    return this.determinate;
  }

  setProgress(value: number) {
    this.progress = value;
    if (this.determinate) {
      this.setPrimaryBarProgress(value);
      this.adapter.setAttribute(strings.ARIA_VALUENOW, value.toString());
    }
  }

  getProgress() {
    return this.progress;
  }

  setBuffer(value: number) {
    this.buffer = value;
    if (this.determinate) {
      this.setBufferBarProgress(value);
    }
  }

  getBuffer() {
    return this.buffer;
  }

  open() {
    this.adapter.removeClass(cssClasses.CLOSED_CLASS);
    this.adapter.removeClass(cssClasses.CLOSED_ANIMATION_OFF_CLASS);
    this.adapter.removeAttribute(strings.ARIA_HIDDEN);
  }

  close() {
    this.adapter.addClass(cssClasses.CLOSED_CLASS);
    this.adapter.setAttribute(strings.ARIA_HIDDEN, 'true');
  }

  isClosed() {
    return this.adapter.hasClass(cssClasses.CLOSED_CLASS);
  }

  /**
   * Handles the transitionend event emitted after `close()` is called and the
   * opacity fades out. This is so that animations are removed only after the
   * progress indicator is completely hidden.
   */
  handleTransitionEnd() {
    if (this.adapter.hasClass(cssClasses.CLOSED_CLASS)) {
      this.adapter.addClass(cssClasses.CLOSED_ANIMATION_OFF_CLASS);
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  restartAnimation() {
    this.adapter.removeClass(cssClasses.ANIMATION_READY_CLASS);
    this.adapter.forceLayout();
    this.adapter.addClass(cssClasses.ANIMATION_READY_CLASS);
  }

  private setPrimaryBarProgress(progressValue: number) {
    const value = `scaleX(${progressValue})`;

    // Accessing `window` without a `typeof` check will throw on Node
    // environments.
    const transformProp = typeof window !== 'undefined' ?
        getCorrectPropertyName(window, 'transform') :
        'transform';
    this.adapter.setPrimaryBarStyle(transformProp, value);
  }

  private setBufferBarProgress(progressValue: number) {
    const value = `${progressValue * 100}%`;
    this.adapter.setBufferBarStyle(strings.FLEX_BASIS, value);
  }

  private calculateAndSetDimensions(width: number) {
    const primaryHalf = width * percents.PRIMARY_HALF;
    const primaryFull = width * percents.PRIMARY_FULL;
    const secondaryQuarter = width * percents.SECONDARY_QUARTER;
    const secondaryHalf = width * percents.SECONDARY_HALF;
    const secondaryFull = width * percents.SECONDARY_FULL;

    this.adapter.setStyle(
        '--md3-linear-progress-primary-half', `${primaryHalf}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-primary-half-neg', `${- primaryHalf}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-primary-full', `${primaryFull}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-primary-full-neg', `${- primaryFull}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-quarter', `${secondaryQuarter}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-quarter-neg',
        `${- secondaryQuarter}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-half', `${secondaryHalf}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-half-neg', `${- secondaryHalf}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-full', `${secondaryFull}px`);
    this.adapter.setStyle(
        '--md3-linear-progress-secondary-full-neg', `${- secondaryFull}px`);

    // need to restart animation for custom props to apply to keyframes
    this.restartAnimation();
  }
}
