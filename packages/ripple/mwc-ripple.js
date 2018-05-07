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
import {LitElement, html, classString as c$} from '@polymer/lit-element/lit-element.js';
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {style} from './mwc-ripple-css.js';
import {MDCRipple} from '@material/ripple';
import {afterNextRender} from '@material/mwc-base/utils.js';

// TODO(sorvell): These are MDC utils. Would be nice to use em, but they don't appear to be easily
// exposed via the public builds.
let supportsPassive_;
function applyPassive(globalObj = window, forceRefresh = false) {
  if (supportsPassive_ === undefined || forceRefresh) {
    let isSupported = false;
    try {
      globalObj.document.addEventListener('test', null, {get passive() {
        isSupported = true;
      }});
    } catch (e) { }

    supportsPassive_ = isSupported;
  }

  return supportsPassive_ ? {passive: true} : false;
}

function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

const MATCHES = getMatchesProperty(HTMLElement.prototype);

export class MDCWCRipple extends MDCWebComponentMixin(MDCRipple) {}

export class MDCWCRippleContainer extends MDCWCRipple {
  createAdapter() {
    const container = this.host.parentNode || this.host;
    return {
      isSurfaceActive: () => container[MATCHES](':active'),
      isSurfaceDisabled: () => container.disabled,
      containsEventTarget: (target) => container.contains(target),
      registerInteractionHandler: (evtType, handler) => container.addEventListener(evtType, handler, applyPassive()),
      deregisterInteractionHandler: (evtType, handler) =>
        container.removeEventListener(evtType, handler, applyPassive()),
      computeBoundingRect: () => container.getBoundingClientRect(),
    };
  }
}

export class Ripple extends LitElement {
  static get properties() {
    return {
      primary: Boolean,
      accent: Boolean,
      unbounded: Boolean,
    };
  }

  constructor() {
    super();
    this.primary = false;
    this.accent = false;
    this.unbounded = false;
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: sizing.
  _render({primary, accent, unbounded}) {
    const classes = c$({
      'mdc-ripple-surface--primary': primary,
      'mdc-ripple-surface--accent': accent,
    });
    return html`
      ${this._renderStyle()}
      <div class$="mdc-ripple-surface ${classes}" data-mdc-ripple-is-unbounded?="${unbounded}"></div>`;
  }

  async ready() {
    super.ready();
    await afterNextRender();
    const surface = this._root.querySelector('.mdc-ripple-surface');
    const container = this.parentNode || this;
    // TODO(sorvell) #css: this might be bad since the container might be positioned.
    container.style.position = 'relative';
    this._ripple = new MDCWCRippleContainer(surface);
  }
}

customElements.define('mwc-ripple', Ripple);
