/**
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

const getInteractionNode = (element: Ripple) =>
    (element as any).interactionNode as HTMLElement;
const setInteractionNode = (ripple: Ripple, element: HTMLElement) => {
  (ripple as any).interactionNode = element;
};

suite('mwc-ripple', () => {
  let element: Ripple, container;
  suite('baisc', () => {
    setup(() => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('mwc-ripple');
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
      const interactionNode = getInteractionNode(element);

      assert(interactionNode == container);
    });
  });

  suite('nested', () => {
    test('respects interactionNode', async () => {
      container = document.createElement('div');
      document.body.appendChild(container);

      element = document.createElement('mwc-ripple');
      setInteractionNode(element, document.body);

      container.appendChild(element);

      await element.updateComplete;
      const interactionNode = getInteractionNode(element);

      assert(interactionNode == document.body);

      document.body.removeChild(container);
    });
  });
});
