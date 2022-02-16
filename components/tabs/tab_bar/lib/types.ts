/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MDCTabBarActivatedEventDetail {
  index: number;
}

// Note: CustomEvent<T> is not supported by Closure Compiler.

export interface MDCTabBarActivatedEvent extends Event {
  readonly detail: MDCTabBarActivatedEventDetail;
}
