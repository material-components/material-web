/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TabBarActivatedEventDetail {
  index: number;
}

export type TabBarActivatedEvent = CustomEvent<TabBarActivatedEventDetail>;
