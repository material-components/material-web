/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {createAnimationSignal, EASING} from '../../motion/animation.js';

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards';

/**
 * A ripple component.
 */
export class Ripple extends LitElement {
  // TODO(https://bugs.webkit.org/show_bug.cgi?id=247546)
  // Remove Safari workaround that requires reflecting `unbounded` so
  // it can be styled against.
  /**
   * Sets the ripple to be an unbounded circle.
   */
  @property({type: Boolean, reflect: true}) unbounded = false;

  /**
   * Disables the ripple.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  @state() private hovered = false;
  @state() private focused = false;
  @state() private pressed = false;

  @query('.surface') private readonly mdRoot!: HTMLElement;
  private rippleSize = '';
  private rippleScale = '';
  private initialSize = 0;
  private readonly pressAnimationSignal = createAnimationSignal();
  private growAnimation: Animation|null = null;
  private delayedEndPressHandle?: number;

  beginHover(hoverEvent?: Event) {
    if ((hoverEvent as PointerEvent)?.pointerType !== 'touch') {
      this.hovered = true;
    }
  }

  endHover() {
    this.hovered = false;
  }

  beginFocus() {
    this.focused = true;
  }

  endFocus() {
    this.focused = false;
  }

  beginPress(positionEvent?: Event|null) {
    this.pressed = true;
    clearTimeout(this.delayedEndPressHandle);
    this.startPressAnimation(positionEvent);
  }

  endPress() {
    const pressAnimationPlayState = this.growAnimation?.currentTime ?? Infinity;
    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      this.pressed = false;
    } else {
      this.delayedEndPressHandle = setTimeout(() => {
        this.pressed = false;
      }, MINIMUM_PRESS_MS - pressAnimationPlayState);
    }
  }

  protected override render() {
    const classes = {
      'hovered': this.hovered,
      'focused': this.focused,
      'pressed': this.pressed,
      'unbounded': this.unbounded,
    };

    return html`<div class="surface ${classMap(classes)}"></div>`;
  }

  protected override update(changedProps: PropertyValues<this>) {
    if (changedProps.has('disabled') && this.disabled) {
      this.endHover();
      this.endFocus();
      this.endPress();
    }
    super.update(changedProps);
  }

  private getDimensions() {
    return (this.parentElement ?? this).getBoundingClientRect();
  }

  private determineRippleSize() {
    const {height, width} = this.getDimensions();
    const maxDim = Math.max(height, width);
    const softEdgeSize =
        Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);


    let maxRadius = maxDim;
    let initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    maxRadius = hypotenuse + PADDING;

    // ensure `initialSize` is even for unbounded
    if (this.unbounded) {
      initialSize = initialSize - (initialSize % 2);
    }

    this.initialSize = initialSize;
    this.rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
    this.rippleSize = `${this.initialSize}px`;
  }

  private getNormalizedPointerEventCoords(pointerEvent: PointerEvent):
      {x: number, y: number} {
    const {scrollX, scrollY} = window;
    const {left, top} = this.getDimensions();
    const documentX = scrollX + left;
    const documentY = scrollY + top;
    const {pageX, pageY} = pointerEvent;
    return {x: pageX - documentX, y: pageY - documentY};
  }

  private getTranslationCoordinates(positionEvent?: Event|null) {
    const {height, width} = this.getDimensions();
    // end in the center
    const endPoint = {
      x: (width - this.initialSize) / 2,
      y: (height - this.initialSize) / 2,
    };

    let startPoint;
    if (positionEvent instanceof PointerEvent) {
      startPoint = this.getNormalizedPointerEventCoords(positionEvent);
    } else {
      startPoint = {
        x: width / 2,
        y: height / 2,
      };
    }

    // center around start point
    startPoint = {
      x: startPoint.x - (this.initialSize / 2),
      y: startPoint.y - (this.initialSize / 2),
    };

    return {startPoint, endPoint};
  }

  private startPressAnimation(positionEvent?: Event|null) {
    this.determineRippleSize();
    const {startPoint, endPoint} =
        this.getTranslationCoordinates(positionEvent);
    const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
    const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

    const signal = this.pressAnimationSignal.start();

    const growAnimation = this.mdRoot.animate(
        {
          top: [0, 0],
          left: [0, 0],
          height: [this.rippleSize, this.rippleSize],
          width: [this.rippleSize, this.rippleSize],
          transform: [
            `translate(${translateStart}) scale(1)`,
            `translate(${translateEnd}) scale(${this.rippleScale})`
          ],
        },
        {
          pseudoElement: PRESS_PSEUDO,
          duration: PRESS_GROW_MS,
          easing: EASING.STANDARD,
          fill: ANIMATION_FILL
        });

    growAnimation.addEventListener('finish', () => {
      this.pressAnimationSignal.finish();
      this.growAnimation = null;
    });

    signal.addEventListener('abort', () => {
      growAnimation.cancel();
      this.growAnimation = null;
    });

    this.growAnimation = growAnimation;
  }
}
