/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Event properties used by the adapter and foundation.
 */
export interface MDCMenuItemEventDetail {
  index: number;
}

/**
 * Event properties specific to the default component implementation.
 */
export interface MDCMenuItemComponentEventDetail
  extends MDCMenuItemEventDetail {
  item: Element;
}

// Note: CustomEvent<T> is not supported by Closure Compiler.

export interface MDCMenuItemEvent extends Event {
  readonly detail: MDCMenuItemEventDetail;
}

export interface MDCMenuItemComponentEvent extends Event {
  readonly detail: MDCMenuItemComponentEventDetail;
}
/**
 * The following comment is used to pin this file to prettier version 3.6.2
 * Please do not remove this comment block and ensure it remains at the end of the file.
 * See go/prettier_upgrade_pinning for more details.
 */
// g3-format-v_3_6_2
