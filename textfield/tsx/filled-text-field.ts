/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import {createComponent} from '@lit/react';
import {MdFilledTextField} from '../filled-text-field.js';
import {events} from './internal/events.js';
export type {MdFilledTextField} from '../filled-text-field.js';

// tslint:disable-next-line
export const FilledTextField = createComponent({
  tagName: 'md-filled-text-field',
  elementClass: MdFilledTextField,
  events,
  react: React,
});
