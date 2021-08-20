/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {MDCFoundation} from '@material/base';
import {LitElement} from 'lit-element';

import {Constructor} from './utils';

export {CustomEventListener, EventType, SpecificEventListener} from '@material/base/types';
export {addHasRemoveClass} from './utils';

/** @soyCompatible */
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
  protected abstract readonly mdcFoundationClass?: Constructor<MDCFoundation>;

  /**
   * An instance of the MDC Foundation class to attach to the root element
   */
  protected abstract mdcFoundation?: MDCFoundation;

  /**
   * Create the adapter for the `mdcFoundation`.
   *
   * Override and return an object with the Adapter's functions implemented:
   *
   *    {
   *      addClass: () => {},
   *      removeClass: () => {},
   *      ...
   *    }
   */
  protected abstract createAdapter(): unknown;

  override click() {
    if (this.mdcRoot) {
      this.mdcRoot.focus();
      this.mdcRoot.click();
      return;
    }

    super.click();
  }

  /**
   * Create and attach the MDC Foundation to the instance
   */
  protected createFoundation() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    if (this.mdcFoundationClass) {
      this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
      this.mdcFoundation.init();
    }
  }

  protected override firstUpdated() {
    this.createFoundation();
  }
}
