/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Equivalent of Lit stories entrypoint */

export * from './knobs.js';
export * from './story.js';

// This file is resolved by base.json
import './components/stories-renderer.js';
