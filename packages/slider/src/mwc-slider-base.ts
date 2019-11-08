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
import {applyPassive} from '@material/dom/events.js';
import {addHasRemoveClass, EventType, FormElement, observer, SpecificEventListener} from '@material/mwc-base/form-element.js';
import {MDCSliderAdapter} from '@material/slider/adapter.js';
import MDCSliderFoundation from '@material/slider/foundation.js';
import {eventOptions, html, property, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {styleMap} from 'lit-html/directives/style-map';

const INPUT_EVENT = 'input';
const CHANGE_EVENT = 'change';

export class SliderBase extends FormElement {
  protected mdcFoundation!: MDCSliderFoundation;

  protected readonly mdcFoundationClass = MDCSliderFoundation;

  @query('.mdc-slider') protected mdcRoot!: HTMLElement;

  @query('.mdc-slider') protected formElement!: HTMLElement;

  @query('.mdc-slider__thumb-container') protected thumbContainer!: HTMLElement;

  @query('.mdc-slider__pin-value-marker') protected pinMarker!: HTMLElement;

  @property({type: Number})
  @observer(function(this: SliderBase, value: number) {
    this.mdcFoundation.setValue(value);
  })
  value = 0;

  @property({type: Number})
  @observer(function(this: SliderBase, value: number) {
    this.mdcFoundation.setMin(value);
  })
  min = 0;

  @property({type: Number})
  @observer(function(this: SliderBase, value: number) {
    this.mdcFoundation.setMax(value);
  })
  max = 100;

  @property({type: Number})
  @observer(function(this: SliderBase, value: number) {
    this.mdcFoundation.setStep(value);
  })
  step = 0;

  @property({type: Boolean, reflect: true})
  @observer(function(this: SliderBase, value: boolean) {
    this.mdcFoundation.setDisabled(value);
  })
  disabled = false;

  @property({type: Boolean, reflect: true}) discrete = false;

  @property({type: Boolean, reflect: true})
  @observer(function(this: SliderBase) {
    this.mdcFoundation.setupTrackMarker();
  })
  markers = false;

  @property({type: String}) protected pinMarkerText = '';
  @property({type: Object}) protected trackMarkerContainerStyles = {};
  @property({type: Object}) protected thumbContainerStyles = {};
  @property({type: Object}) protected trackStyles = {};

  protected isFoundationDestroyed = false;

  // TODO(sorvell) #css: needs a default width
  protected render() {
    const hostClassInfo = {
      'mdc-slider--discrete': this.discrete,
      'mdc-slider--display-markers': this.markers && this.discrete,
    };

    let markersTemplate: TemplateResult|string = '';

    if (this.discrete && this.markers) {
      markersTemplate = html`
        <div
            class="mdc-slider__track-marker-container"
            style="${styleMap(this.trackMarkerContainerStyles)}">
        </div>`;
    }

    let pin: TemplateResult|string = '';

    if (this.discrete) {
      pin = html`
      <div class="mdc-slider__pin">
        <span class="mdc-slider__pin-value-marker">${this.pinMarkerText}</span>
      </div>`;
    }

    return html`
      <div class="mdc-slider ${classMap(hostClassInfo)}"
           tabindex="0" role="slider"
           aria-valuemin="${this.min}" aria-valuemax="${this.max}"
           aria-valuenow="${this.value}" aria-disabled="${this.disabled}"
           data-step="${this.step}"
           @mousedown=${this.layout}
           @touchstart=${this.layout}>
        <div class="mdc-slider__track-container">
          <div
              class="mdc-slider__track"
              style="${styleMap(this.trackStyles)}">
          </div>
          ${markersTemplate}
        </div>
        <div
            class="mdc-slider__thumb-container"
            style="${styleMap(this.thumbContainerStyles)}">
          <!-- TODO: use cache() directive -->
          ${pin}
          <svg class="mdc-slider__thumb" width="21" height="21">
            <circle cx="10.5" cy="10.5" r="7.875"></circle>
          </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.mdcRoot && this.isFoundationDestroyed) {
      this.isFoundationDestroyed = false;
      this.mdcFoundation.init();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.isFoundationDestroyed = true;
    this.mdcFoundation.destroy();
  }

  protected createAdapter(): MDCSliderAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      getAttribute: (name: string) => this.mdcRoot.getAttribute(name),
      setAttribute: (name: string, value: string) =>
          this.mdcRoot.setAttribute(name, value),
      removeAttribute: (name: string) => this.mdcRoot.removeAttribute(name),
      computeBoundingRect: () => {
        const rect = this.mdcRoot.getBoundingClientRect();
        const myRect: ClientRect = {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left + window.pageXOffset,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        };

        return myRect;
      },
      getTabIndex: () => this.mdcRoot.tabIndex,
      registerInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            const init = type === 'touchstart' ? applyPassive() : undefined;
            this.mdcRoot.addEventListener(type, handler, init);
          },
      deregisterInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
              this.mdcRoot.removeEventListener(type, handler),
      registerThumbContainerInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) => {
            const init = type === 'touchstart' ? applyPassive() : undefined;
            this.thumbContainer.addEventListener(type, handler, init);
          },
      deregisterThumbContainerInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
              this.thumbContainer.removeEventListener(type, handler),
      registerBodyInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
              document.body.addEventListener(type, handler),
      deregisterBodyInteractionHandler:
          <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
              document.body.removeEventListener(type, handler),
      registerResizeHandler: (handler: SpecificEventListener<'resize'>) =>
          window.addEventListener('resize', handler, applyPassive()),
      deregisterResizeHandler: (handler: SpecificEventListener<'resize'>) =>
          window.removeEventListener('resize', handler),
      notifyInput: () => {
        const value = this.mdcFoundation.getValue();
        if (value !== this.value) {
          this.value = value;
          this.dispatchEvent(new CustomEvent(
              INPUT_EVENT,
              {detail: this, composed: true, bubbles: true, cancelable: true}));
        }
      },
      notifyChange: () => {
        this.dispatchEvent(new CustomEvent(
            CHANGE_EVENT,
            {detail: this, composed: true, bubbles: true, cancelable: true}));
      },
      setThumbContainerStyleProperty: (propertyName: string, value: string) => {
        this.thumbContainerStyles[propertyName] = value;
        this.requestUpdate();
      },
      setTrackStyleProperty: (propertyName: string, value: string) => {
        this.trackStyles[propertyName] = value;
        this.requestUpdate();
      },
      setMarkerValue: (value: number) => this.pinMarkerText = value.toString(),
      setTrackMarkers: (step, max, min) => {
        // calculates the CSS for the notches on the slider. Taken from
        // https://github.com/material-components/material-components-web/blob/8f851d9ed2f75dc8b8956d15b3bb2619e59fa8a9/packages/mdc-slider/component.ts#L122
        const stepStr = step.toLocaleString();
        const maxStr = max.toLocaleString();
        const minStr = min.toLocaleString();
        // keep calculation in css for better rounding/subpixel behavior
        const markerAmount = `((${maxStr} - ${minStr}) / ${stepStr})`;
        const markerWidth = '2px';
        const markerBkgdImage = `linear-gradient(to right, currentColor ${
            markerWidth}, transparent 0)`;
        const markerBkgdLayout = `0 center / calc((100% - ${markerWidth}) / ${
            markerAmount}) 100% repeat-x`;
        const markerBkgdShorthand = `${markerBkgdImage} ${markerBkgdLayout}`;

        this.trackMarkerContainerStyles['background'] = markerBkgdShorthand;
        this.requestUpdate();
      },
      isRTL: () => getComputedStyle(this.mdcRoot).direction === 'rtl',
    };
  }

  @eventOptions({capture: true, passive: true})
  layout() {
    this.mdcFoundation.layout();
  }
}
