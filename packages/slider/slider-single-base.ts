/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '@material/mwc-ripple/mwc-ripple';

import {deepActiveElementPath} from '@material/mwc-base/utils';
import {MDCSliderAdapter} from '@material/slider/adapter';
import {Thumb, TickMark} from '@material/slider/types';
import {html, property} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';

import {SliderBase} from './slider-base';

export {Thumb} from '@material/slider/types';


export class SliderSingleBase extends SliderBase {
  @property({type: Number})
  get value(): number {
    return this.valueEnd;
  }

  set value(newVal: number) {
    this.valueEnd = newVal;
  }

  protected renderTrack() {
    const trackStyles = styleMap({
      'transform-origin': this.trackTransformOriginStyle,
      'left': this.trackLeftStyle,
      'right': this.trackRightStyle,
      '-webkit-transform':
          `scaleX(${(this.valueEnd - this.min) / (this.max - this.min)})`,
      'transform':
          `scaleX(${(this.valueEnd - this.min) / (this.max - this.min)})`,
      '-webkit-transition': this.trackTransitionStyle,
      'transition': this.trackTransitionStyle,
    });

    return html`
      <div class="mdc-slider__track">
        <div class="mdc-slider__track--inactive"></div>
        <div class="mdc-slider__track--active">
          <div
              class="mdc-slider__track--active_fill"
              style=${trackStyles}>
          </div>
        </div>
      </div>`;
  }

  protected createAdapter(): MDCSliderAdapter {
    return {
      addClass: (className) => {
        switch (className) {
          case 'mdc-slider--disabled':
            this.disabled = true;
            break;
        }
      },
      removeClass: (className) => {
        switch (className) {
          case 'mdc-slider--disabled':
            this.disabled = false;
            break;
        }
      },
      hasClass: (className) => {
        switch (className) {
          case 'mdc-slider--disabled':
            return this.disabled;
          case 'mdc-slider--discrete':
            return this.discrete;
          default:
            return false;
        }
      },
      addThumbClass: (className, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        switch (className) {
          case 'mdc-slider__thumb--with-indicator':
            this.endThumbWithIndicator = true;
            break;
        }
      },
      removeThumbClass: (className, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        switch (className) {
          case 'mdc-slider__thumb--with-indicator':
            this.endThumbWithIndicator = false;
            break;
        }
      },
      registerEventHandler: () => {
        // handled in bindings
      },
      deregisterEventHandler: () => {
        // handled in bindings
      },
      registerBodyEventHandler: (eventName, handler) => {
        document.body.addEventListener(eventName, handler);
      },
      deregisterBodyEventHandler: (eventName, handler) => {
        document.body.removeEventListener(eventName, handler);
      },
      registerInputEventHandler: (thumb, eventName, handler) => {
        if (thumb === Thumb.START) {
          return;
        }

        this.formElement.addEventListener(eventName, handler);
      },
      deregisterInputEventHandler: (thumb, eventName, handler) => {
        if (thumb === Thumb.START) {
          return;
        }

        this.formElement.removeEventListener(eventName, handler);
      },
      registerThumbEventHandler: () => {
        // handled by bindings
      },
      deregisterThumbEventHandler: () => {
        // handled by bindings
      },
      registerWindowEventHandler: (eventName, handler) => {
        window.addEventListener(eventName, handler);
      },
      deregisterWindowEventHandler: (eventName, handler) => {
        window.addEventListener(eventName, handler);
      },
      emitChangeEvent: (value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        const event = new CustomEvent(
            'change', {bubbles: true, composed: true, detail: {value, thumb}});
        this.dispatchEvent(event)
      },
      emitDragEndEvent: (_value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }
        // Emitting event is not yet implemented. See issue:
        // https://github.com/material-components/material-components-web/issues/6448

        this.endRippleHandlers.endPress();
      },
      emitDragStartEvent: (_value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }
        // Emitting event is not yet implemented. See issue:
        // https://github.com/material-components/material-components-web/issues/6448

        this.endRippleHandlers.startPress();
      },
      emitInputEvent: (value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        const event = new CustomEvent(
            'input', {bubbles: true, composed: true, detail: {value, thumb}});
        this.dispatchEvent(event)
      },
      focusInput: (thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        this.formElement.focus();
      },
      getAttribute: () => {
        // never seems to actually be used
        return '';
      },
      getBoundingClientRect: () => {
        return this.mdcRoot.getBoundingClientRect();
      },
      getInputAttribute: (attrName, thumb) => {
        if (thumb === Thumb.START) {
          return null;
        }

        switch (attrName) {
          case 'min':
            return this.min.toString();
          case 'max':
            return this.max.toString();
          case 'value':
            return this.valueEnd.toString();
          case 'step':
            return this.step.toString();
          default:
            return null;
        }
      },
      getInputValue: (thumb) => {
        if (thumb === Thumb.START) {
          return '';
        }

        return this.valueEnd.toString();
      },
      getThumbBoundingClientRect: (thumb) => {
        if (thumb === Thumb.START) {
          return this.getBoundingClientRect();
        }

        return this.endThumb.getBoundingClientRect();
      },
      getThumbKnobWidth: (thumb) => {
        if (thumb === Thumb.START) {
          return 0;
        }

        return this.endThumbKnob.getBoundingClientRect().width;
      },
      getValueToValueIndicatorTextFn: () => {
        return this.valueToValueIndicatorTransform;
      },
      getValueToAriaValueTextFn: () => {
        return this.valueToAriaTextTransform
      },
      isInputFocused: (thumb) => {
        if (thumb === Thumb.START) {
          return false;
        }

        const activeElements = deepActiveElementPath();
        return activeElements[activeElements.length - 1] === this.formElement;
      },
      isRTL: () => {
        return getComputedStyle(this).direction === 'rtl';
      },
      setInputAttribute: (attribute, _value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        switch (attribute) {
          case 'disabled':
          case 'value':
          case 'aria-valuetext':
            // handled by bindings
            break;
        }
      },
      removeInputAttribute: (attribute) => {
        switch (attribute) {
          case 'disabled':
            // handled by bindings
            break;
        }
      },
      setThumbStyleProperty: (name, value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        switch (name) {
          case 'transform':
          case '-webkit-transform':
            this.endThumbTransformStyle = value;
            break;
          case 'transition':
          case '-webkit-transition':
            this.endThumbTransitionStyle = value;
            break;
        }
      },
      removeThumbStyleProperty: (name, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        switch (name) {
          case 'left':
          case 'right':
            // handled by bindings
            break;
          case 'transition':
          case '-webkit-transition':
            this.endThumbTransitionStyle = '';
            break;
        }
      },
      setTrackActiveStyleProperty: (name, value) => {
        switch (name) {
          case 'transform-origin':
            this.trackTransformOriginStyle = value;
            break;
          case 'left':
            this.trackLeftStyle = value;
            break;
          case 'right':
            this.trackRightStyle = value;
            break;
          case 'transform':
          case '-webkit-transform':
            // handled by bindings
            break;
          case 'transition':
          case '-webkit-transition':
            this.trackTransitionStyle = value;
            break;
        }
      },
      removeTrackActiveStyleProperty: (name) => {
        switch (name) {
          case 'transition':
          case '-webkit-transition':
            this.trackTransitionStyle = '';
            break;
        }
      },
      setInputValue: (value, thumb) => {
        if (thumb === Thumb.START) {
          return;
        }

        this.valueEnd = Number(value);
      },
      setPointerCapture: (pointerId) => {
        this.mdcRoot.setPointerCapture(pointerId);
      },
      setValueIndicatorText: (value, thumb) => {
        switch (thumb) {
          case Thumb.END:
            this.valueIndicatorTextEnd = value;
            break;
          default:
            break;
        }
      },
      updateTickMarks: (tickMarks: TickMark[]) => {
        this.tickMarks = tickMarks;
      },
    };
  }
}
