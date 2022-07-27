/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCChipActionAttributes, MDCChipActionEvents} from './constants';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCChipActionAdapter {
  emitEvent<D extends object>(name: MDCChipActionEvents, detail: D): void;

  focus(): void;

  getAttribute(attr: MDCChipActionAttributes): string|null;

  getElementID(): string;

  removeAttribute(attr: MDCChipActionAttributes): void;

  setAttribute(attr: MDCChipActionAttributes, value: string): void;
}
