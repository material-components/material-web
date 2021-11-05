/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Legacy stateful foundation class for components.
 */
export class Foundation<Adapter extends object> {
  constructor(protected adapter: Adapter) {
    this.init();
  }

  protected init() {
    // Subclasses should override this method to perform initialization routines
  }
}

/**
 * The constructor for a foundation.
 */
export interface FoundationConstructor<Adapter extends object> {
  new(adapter: Adapter): Foundation<Adapter>;
  readonly prototype: Foundation<Adapter>;
}

/**
 * Retrieves the adapter type from the provided foundation type.
 */
export type AdapterOf<FoundationType> =
    FoundationType extends Foundation<infer A>? A : never;
