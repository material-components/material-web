/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Ripple} from '@material/mwc-ripple';

interface RippleInternals {
  interactionNode: HTMLElement;
}

suite('mwc-ripple', () => {
  let element: Ripple;
  let internals: RippleInternals;
  let container: HTMLDivElement;

  suite('basic', () => {
    setup(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('mwc-ripple');
      internals = element as unknown as RippleInternals;
      container.appendChild(element);
    });

    teardown(() => {
      document.body.removeChild(container);
    });

    test('initializes as an mwc-ripple', () => {
      assert.instanceOf(element, Ripple);
    });

    test('sets interactionNode to parent', async () => {
      await element.updateComplete;
      assert(internals.interactionNode == container);
    });
  });

  suite('interactionNode', () => {
    test('respects interactionNode', async () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      const element2 = document.createElement('mwc-ripple');
      const internals2 = element2 as unknown as RippleInternals;
      internals2.interactionNode = document.body;

      container.appendChild(element2);

      await element2.updateComplete;

      assert(internals2.interactionNode == document.body);

      document.body.removeChild(container);
    });

    test('ripple whose parent is shadowRoot selects host', async () => {
      container = document.createElement('div');
      const root = container.attachShadow({mode: 'open'});
      document.body.appendChild(container);

      const ripple = document.createElement('mwc-ripple');
      const internals = ripple as unknown as RippleInternals;

      root.appendChild(ripple);

      await ripple.updateComplete;

      assert.instanceOf(internals.interactionNode, HTMLElement);
      assert(internals.interactionNode === container);

      document.body.removeChild(container);
    });
  });
});
