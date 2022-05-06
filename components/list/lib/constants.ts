/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListItemState} from './state.js';

/**
 * ListItemInteractionEventDetail provides details for the interaction
 * event.
 */
export interface ListItemInteractionEventDetail {
  state: ListItemState;
}

/**
 * ListItemInteractionEvent is the custom event for the interaction event.
 */
export type ListItemInteractionEvent =
    CustomEvent<ListItemInteractionEventDetail>;
