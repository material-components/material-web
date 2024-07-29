/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import {createComponent} from '@lit/react';
import {MdOutlinedTextField} from '../outlined-text-field.js';
import {events} from './internal/events.js';
export type {MdOutlinedTextField} from '../outlined-text-field.js';

// tslint:disable-next-line
export const OutlinedTextField = createComponent({
  tagName: 'md-outlined-text-field',
  elementClass: MdOutlinedTextField,
  events,
  react: React,
});
