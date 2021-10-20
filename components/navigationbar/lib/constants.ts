/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCNavigationTabState} from 'google3/third_party/javascript/material_web_components/m3/navigationtab/lib/state';

/**
 * MDCNavigationTabInteractionEventDetail provides details for the interaction
 * event.
 */
export interface MDCNavigationTabInteractionEventDetail {
  state: MDCNavigationTabState;
}

/**
 * NavigationTabInteractionEvent is the custom event for the interaction event.
 */
export type NavigationTabInteractionEvent =
    CustomEvent<MDCNavigationTabInteractionEventDetail>;
