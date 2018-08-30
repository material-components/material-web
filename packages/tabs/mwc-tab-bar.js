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
import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {MDCTabBar} from '@material/tabs';
import {style} from './mwc-tab-bar-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';

// this element depends on `mwc-tab` to be registered ahead of time
import './mwc-tab.js';


class MDCWCTabBar extends MDCWebComponentMixin(MDCTabBar) {
  // TODO(sorvell): adapt to changing list of tabs
  // (does not appear to be support in foundation for this)
  get tabs() {
    return Array.from(this.root_._host.querySelectorAll('mwc-tab'))
      .filter((e) => e._mdcComponent).map((e) => e._mdcComponent);
  }
}

export class TabBar extends LitElement {
  static get properties() {
    return {
      activeTabIndex: {type: Number},
    };
  }

  constructor() {
    super();
    this.activeTabIndex = 0;
  }

  renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: wrapping
  render() {
    return html`
      ${this.renderStyle()}
      <nav class="mdc-tab-bar">
        <slot></slot>
        <span class="mdc-tab-bar__indicator"></span>
      </nav>`;
  }

  updated(changedProps) {
    if (this._mdcComponent && (this.activeTabIndex !== changedProps.get('activeTabIndex'))) {
      this._mdcComponent.activeTabIndex = this.activeTabIndex;
    }
  }

  async firstUpdated() {
    await afterNextRender();
    this._makeComponent();
    this.requestUpdate();
  }

  _makeComponent() {
    const mdcRoot = this.shadowRoot.querySelector('nav');
    mdcRoot._host = this;
    this._mdcComponent = new MDCWCTabBar(mdcRoot);
  }
}

customElements.define('mwc-tab-bar', TabBar);
