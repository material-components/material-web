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
export {html} from '@polymer/lit-element/lit-element.js';
export {MDCWebComponentMixin} from './mdc-web-component.js';

export class ComponentElement extends LitElement {
  static get ComponentClass() {
    throw new Error('Must provide component class');
  }

  static get componentSelector() {
    throw new Error('Must provide component selector');
  }

  constructor() {
    super();
    this._asyncComponent = false;
  }

  async firstUpdated() {
    if (this._asyncComponent) {
      await this.renderComplete;
    }
    this._makeComponent();
  }

  _makeComponent() {
    this._componentRoot = this.shadowRoot.querySelector(this.constructor.componentSelector);
    this._component = new (this.constructor.ComponentClass)(this._componentRoot);
    if (this._resolveComponentPromise) {
      this._resolveComponentPromise(this._component);
    }
  }

  componentReady() {
    if (!this._componentPromise) {
      this._componentPromise = new Promise((resolve) => {
        this._resolveComponentPromise = resolve;
      });
      if (this._component) {
        this._resolveComponentPromise(this._component);
      }
    }
    return this._componentPromise;
  }
}
