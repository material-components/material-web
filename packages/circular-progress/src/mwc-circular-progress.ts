/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { query, property, LitElement, customElement, html, svg } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { observer } from '@material/mwc-base/observer';
import { cssClasses } from './constants';
import MDCCircularProgressFoundation from './foundation';

import { style } from './mwc-circular-progress-css';

export const getRelativeValue = (value, min, max) => {
  const clampedValue = Math.min(Math.max(min, value), max);
  return (clampedValue - min) / (max - min);
}

export const easeOut = t => {
  t = getRelativeValue(t, 0, 1);
  // https://gist.github.com/gre/1650294
  t = (t -= 1) * t * t + 1;

  return t;
}

export const easeIn = t => {
  return t * t;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-circular-progress': CircularProgress;
  }
}

@customElement('mwc-circular-progress' as any)
export class CircularProgress extends LitElement {
  protected mdcFoundation!: MDCCircularProgressFoundation;
  protected SIZE = 44;

  @query('.mwc-circular-progress')
  protected mdcRoot!: HTMLElement

  @query('.mdc-circular-progress__bar')
  protected bar!: HTMLElement

  @property({ type: String })
  @observer(function (this: CircularProgress, value: String) {
    this.mdcFoundation.setColor(value);
  })
  color;

  @property({ type: Boolean })
  secondary = false;

  @property({ type: Number })
  size = 40;

  @property({ type: Number })
  thickness = 3.6;

  @property({ type: Boolean })
  fixed = false;

  @property({ type: Boolean })
  disableShrink = false;

  @property({ type: Boolean, reflect: true })
  @observer(function (this: CircularProgress, value: boolean) {
    this.mdcFoundation.setDeterminate(value || this.fixed);
  })
  determinate = false;

  @property({ type: Number })
  @observer(function (this: CircularProgress, value: number) {
    this.mdcFoundation.setProgress(value);

    if (this.determinate) {
      this.setAttribute('aria-valuenow', Math.round(value).toString());
    }
  })
  progress = 0;

  @property({ type: Boolean, reflect: true })
  @observer(function (this: CircularProgress, value: boolean) {
    if (value) {
      this.mdcFoundation.close();
    } else {
      this.mdcFoundation.open();
    }
  })
  closed = false;

  static styles = style;

  render() {
    const { fixed, determinate, closed, SIZE, thickness, disableShrink } = this;

    const classes = {
      'mwc-circular-progress': true,
      [cssClasses.FIXED_CLASS]: fixed,
      [cssClasses.DETERMINATE_CLASS]: determinate && !fixed,
      [cssClasses.INDETERMINATE_CLASS]: !determinate && !fixed,
      [cssClasses.DISABLE_SHRINK_CLASS]: disableShrink,
      [cssClasses.CLOSED_CLASS]: closed,
      'mwc-circular-progress--primary': !this.secondary && !this.color,
      'mwc-circular-progress--secondary': this.secondary && !this.color,
    };

    return html`
      ${this.getCircleStyle()}
      <div role="progressbar" class="${classMap(classes)}">
        ${svg`
          <svg viewBox="${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}">
            <circle cx="${SIZE}" cy="${SIZE}" r="${(SIZE - thickness) / 2}" fill="none" stroke-width="${thickness}" />
          </svg>
        `}
      </div>`;
  }

  /**
   * Create the adapter for the `mdcFoundation`.
   *
   * To extend, spread the super class version into you class:
   * `{...super.createAdapter(), foo() => {}}`
   */
  protected createAdapter() {
    return {
      addClass: (className: string) => {
        this.mdcRoot.classList.add(className);
      },
      removeClass: (className: string) => {
        this.mdcRoot.classList.remove(className);
      },
      hasClass: (className: string) => {
        return this.mdcRoot.classList.contains(className);
      },
      setStyle: (el: HTMLElement, property: string, value: string) => {
        if (el) {
          el.style[property] = value;
        }
      },
      getElement: () => {
        return this.mdcRoot
      },
      getColor: () => {
        return this.color
      }
    };
  }

  /**
   * Create and attach the MDC Foundation to the instance
   */
  protected createFoundation() {
    if (this.mdcFoundation) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new MDCCircularProgressFoundation(this.createAdapter());
    this.mdcFoundation.init();
  }

  getCircleStyle() {
    const { fixed, determinate, SIZE, size, thickness, progress } = this;

    if (determinate || fixed) {
      const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
      const strokeDasharray = circumference.toFixed(3);
      const strokeDashoffset = fixed
        ? `${(((100 - progress) / 100) * circumference).toFixed(3)}px`
        : `${(easeIn((100 - progress) / 100) * circumference).toFixed(3)}px`
      const transform = fixed
        ? 'rotate(-90deg)'
        : `rotate(${(easeOut(progress / 70) * 270).toFixed(3)}deg)`;

      return html`
        <style>
          .mwc-circular-progress {
            transform: ${transform};
            width: ${size}px;
            height: ${size}px;
          }

          .mwc-circular-progress circle {
            stroke-dasharray: ${strokeDasharray};
            stroke-dashoffset: ${strokeDashoffset};
          }
        </style>
      `;
    }

    return html`
      <style>
        .mwc-circular-progress {
          width: ${size}px;
          height: ${size}px;
        }
      </style>
    `;
  }

  firstUpdated() {
    this.createFoundation();
  }

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }
}
