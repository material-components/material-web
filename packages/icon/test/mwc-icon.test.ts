/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Icon} from '@material/mwc-icon';


suite('mwc-icon', () => {
  let element: Icon;

  setup(() => {
    element = document.createElement('mwc-icon');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-icon', () => {
    assert.instanceOf(element, Icon);
  });
});
