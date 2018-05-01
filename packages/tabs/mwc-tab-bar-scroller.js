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
import {MDCTabBarScroller} from '@material/tabs';
import {style} from './mwc-tab-bar-scroller-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import '@material/mwc-icon/mwc-icon-font.js';

// this element depends on `mwc-tab-bar` to be registered ahead of time
import './mwc-tab-bar.js';


class MDCWCTabBarScroller extends MDCWebComponentMixin(MDCTabBarScroller) {
  get tabBar() {
    return this.root_._host.querySelector('mwc-tab-bar')._mdcComponent;
  }

  // TODO(sorvell): hack to expose this
  get tabBarRoot() {
    return this.tabBar.root_;
  }

  initialize() {
    super.initialize((e) => this.tabBar);
    // TODO(sorvell): hack to get proper class on tabbar element.
    this.tabBarRoot.classList.add('mdc-tab-bar-scroller__scroll-frame__tabs');
  }

  createAdapter() {
    return {
      getOffsetWidthForTabBar: () => this.tabBarRoot.offsetWidth,
      setTransformStyleForTabBar: (value) => {
        this.tabBarRoot.style.setProperty('transform', value);
      },
    };
  }
}

export class TabBarScroller extends LitElement {
  static get properties() {
  }

  constructor() {
    super();
  }

  _renderStyle() {
    return style;
  }

  _render() {
    return html`
      ${this._renderStyle()}
      <div class="mdc-tab-bar-scroller">
        <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
          <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
            navigate_before
          </a>
        </div>
        <div class="mdc-tab-bar-scroller__scroll-frame">
          <slot></slot>
        </div>
        <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
          <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
            navigate_next
          </a>
        </div>
      </div>`;
  }

  async ready() {
    super.ready();
    // TODO(sorvell): hack push scroller creation after tabbar... could expose promise.
    await afterNextRender();
    await afterNextRender();
    this._makeComponent();
    this._requestRender();
  }

  _makeComponent() {
    const mdcRoot = this._root.querySelector('div');
    mdcRoot._host = this;
    this._mdcComponent = new MDCWCTabBarScroller(mdcRoot);
  }
}

customElements.define('mwc-tab-bar-scroller', TabBarScroller);
