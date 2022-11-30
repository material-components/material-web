/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {playwrightLauncher} from '@web/test-runner-playwright';
import {jasmineTestRunnerConfig} from 'web-test-runner-jasmine';

export default {
  ...jasmineTestRunnerConfig(),
  nodeResolve: true,
  files: ['**/*_test.js', '!node_modules/', '!.wireit/'],
  browsers: [playwrightLauncher({product: 'chromium'})],
};
