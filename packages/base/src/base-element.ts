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

import {LitElement} from '@polymer/lit-element';
import {TemplateResult} from 'lit-html';
export {TemplateResult};
export * from '@polymer/lit-element';
export {classMap} from 'lit-html/directives/classMap';
export {observer} from './observer';

/**
 * Base Adapter class for components.
 *
 * For your component extend this component,
 * put the new element type in the constructor,
 * and add additional adapters as needed.
 */
export class BaseAdapter {
  constructor(readonly element: BaseElement) {}
  addClass(className: string) {
    this.element.mdcRoot.classList.add(className);
  }
  removeClass(className: string) {
    this.element.mdcRoot.classList.remove(className);
  }
  hasClass(className: string) {
    return this.element.mdcRoot.classList.contains(className);
  }
}

export abstract class BaseElement extends LitElement {

  /**
   * Root element for MDC Foundation usage.
   *
   * Define in your component with the `@query` decorator
   */
  abstract mdcRoot: HTMLElement;

  /**
   * Return the foundation class for this component
   */
  protected abstract get mdcFoundationClass(): any;

  /**
   * An instance of the MDC Foundation class to attach to the root element
   */
  protected abstract mdcFoundation: any;

  /**
   * Adapter class for use by `createAdapter`
   *
   * In your component, extend `BaseAdapter` and attach it here.
   */
  protected static readonly AdapterClass = BaseAdapter;

  /**
   * Create the adapter for the `mdcFoundation`.
   *
   */
  protected createAdapter() {
    return new (this.constructor as typeof BaseElement).AdapterClass(this);
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