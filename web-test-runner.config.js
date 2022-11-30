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
  files: ['**/*test.js', '!node_modules/', '!.wireit/'],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      // TODO Firefox errors with "Touch is not defined"
      // product: 'firefox',
      // TODO Webkit errors with "Unknown error"
      // product: 'webkit',
    }),
  ],
};
