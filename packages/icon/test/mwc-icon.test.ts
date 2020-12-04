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

  test('sets icon color', () => {
    element.style.color = "blue";
    let icon_color = element.style.color;
    assert.equal(icon_color, "blue");
  });
  
  test('sets icon size', () => {
    element.style.fontSize = "200px";
    let icon_size = element.style.fontSize;
    assert.equal(icon_size, "200px");
  });
});
