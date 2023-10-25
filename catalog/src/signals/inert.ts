/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {signal} from './signal-element.js';

/**
 * Whether or not the site content should be inert (sidebar is still
 * interactive).
 */
export const inertContentSignal = signal(false);

/**
 * Whether or not the sidebar should be inert.
 */
export const inertSidebarSignal = signal(false);
