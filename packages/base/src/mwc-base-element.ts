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

import {LitElement} from '@polymer/lit-element/lit-element.js';
import {TemplateResult} from 'lit-html';
export {TemplateResult};
export {html, property, customElement, query} from '@polymer/lit-element/lit-element.js';
export {classMap} from 'lit-html/directives/classMap.js';
export {observer} from './observer.js';

export abstract class MWCBaseElement extends LitElement {

  /**
   * Root element for MDC Foundation usage.
   *
   * Define in your component with the `@query` decorator
   */
  protected abstract mdcRoot: HTMLElement;

  /**
   * Return the foundation class for this component
   */
  protected abstract get mdcFoundationClass(): any;

  /**
   * An instance of the MDC Foundation class to attach to the root element
   */
  protected abstract mdcFoundation: any;

  /**
   * Create the adapter for the `mdcFoundation`.
   *
   * When overriding, use the following pattern:
   *
   * `createAdapter() {return {...super.createAdapter(), () => {}}}`
   *
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
      }
    }
  }

  /**
   * This function should be called in `render()` to add the styling for this
   * component.
   */
  abstract renderStyle(): TemplateResult;

  /**
   * Create and attach the MDC Foundation to the instance
   */
  protected createFoundation() {
    const foundationClass = this.mdcFoundationClass;
    this.mdcFoundation = new foundationClass(this.createAdapter());
    this.mdcFoundation.init();
  }

  firstUpdated() {
    this.createFoundation();
  }
}