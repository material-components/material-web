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

import {LitElement} from 'lit-element';
export * from 'lit-element';
export {classMap} from 'lit-html/directives/class-map.js';
export {observer} from './observer.js';

export interface Adapter {
  [name: string]: Function
};

/** Extend this Foundation with the functions you use */
export interface Foundation {
  init(): void;
  destroy(): void;
}

export declare var Foundation: {
  prototype: Foundation;
  new(adapter: Adapter): Foundation;
}

export abstract class BaseElement extends LitElement {

  /**
   * Root element for MDC Foundation usage.
   *
   * Define in your component with the `@query` decorator
   */
  protected abstract mdcRoot: HTMLElement;

  /**
   * Return the foundation class for this component
   */
  protected abstract readonly mdcFoundationClass: typeof Foundation;

  /**
   * An instance of the MDC Foundation class to attach to the root element
   */
  protected abstract mdcFoundation: Foundation;

  /**
   * Create the adapter for the `mdcFoundation`.
   *
   * To extend, spread the super class version into you class:
   * `{...super.createAdapter(), foo() => {}}`
   */
  protected createAdapter(): Adapter {
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
    };
  }

  /**
   * Create and attach the MDC Foundation to the instance
   */
  protected createFoundation() {
    if (this.mdcFoundation) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
    this.mdcFoundation.init();
  }

  firstUpdated() {
    this.createFoundation();
  }
}