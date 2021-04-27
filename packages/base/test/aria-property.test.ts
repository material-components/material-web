/**
 * @license
 * Copyright 2021 Google Inc. All Rights Reserved.
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

import {ariaProperty} from '@material/mwc-base/aria-property';
import {customElement, LitElement, property} from 'lit-element';
import {html} from 'lit-html';
import {ifDefined} from 'lit-html/directives/if-defined';

import {fixture, TestFixture} from '../../../test/src/util/helpers';


@customElement('test-aria-element')
class TestElement extends LitElement {
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  ariaLabel?: string;

  protected internalAriaChecked: 'true'|'false'|'mixed'|undefined = undefined;

  @ariaProperty
  @property({attribute: 'aria-checked'})
  set ariaChecked(value: 'true'|'false'|'mixed'|undefined) {
    if (value === 'mixed') {
      this.internalAriaChecked = value;
    } else {
      this.internalAriaChecked = undefined;
    }
    this.requestUpdate();
  }

  get ariaChecked() {
    return this.internalAriaChecked;
  }

  @property({attribute: 'aria-owns'}) @ariaProperty ariaOwns?: string;

  render() {
    return html`<input aria-label="${
        ifDefined(this.ariaLabel)}" aria-checked="${
        ifDefined(this.ariaChecked)}" aria-owns="${ifDefined(this.ariaOwns)}">`;
  }
}

const imperative = html`<test-aria-element></test-aria-element>`;
const declarative =
    html`<test-aria-element aria-label="foo" aria-checked="mixed" aria-owns="baz"></test-aria-element>`;

suite('aria-property:', () => {
  suite('imperative', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLInputElement|null;

    setup(async () => {
      fixt = await fixture(imperative);
      component = fixt.root.querySelector('test-aria-element');

      if (component?.shadowRoot) {
        shadowTargetElement = component.shadowRoot.querySelector('input');
      }
    });

    test('property sets with @property()', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaLabel, undefined);
      component.ariaLabel = 'foo';
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-label'));
      assert.equal(component.ariaLabel, 'foo');
      assert.equal(shadowTargetElement.getAttribute('aria-label'), 'foo');
    });

    test('property sets with a getter and setter', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaChecked, undefined);
      component.ariaChecked = 'mixed';
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-checked'));
      assert.equal(component.ariaChecked, 'mixed');
      assert.equal(shadowTargetElement.getAttribute('aria-checked'), 'mixed');
    });

    test('property sets with alternate order', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaOwns, undefined);
      component.ariaOwns = 'baz';
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-owns'));
      assert.equal(component.ariaOwns, 'baz');
      assert.equal(shadowTargetElement.getAttribute('aria-owns'), 'baz');
    });

    test('attribute sets with @property()', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaLabel, undefined);
      component.setAttribute('aria-label', 'foo');
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-label'));
      assert.equal(component.ariaLabel, 'foo');
      assert.equal(shadowTargetElement.getAttribute('aria-label'), 'foo');
    });

    test('attribute sets with a getter and setter', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaChecked, undefined);
      component.setAttribute('aria-checked', 'mixed');
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-checked'));
      assert.equal(component.ariaChecked, 'mixed');
      assert.equal(shadowTargetElement?.getAttribute('aria-checked'), 'mixed');
    });

    test('attribute sets with alternate order', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      assert.equal(component.ariaOwns, undefined);
      component.setAttribute('aria-owns', 'baz');
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-owns'));
      assert.equal(component.ariaOwns, 'baz');
      assert.equal(shadowTargetElement.getAttribute('aria-owns'), 'baz');
    });
  });

  suite('declarative', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLInputElement|null;

    setup(async () => {
      fixt = await fixture(declarative);
      component = fixt.root.querySelector('test-aria-element');

      if (component?.shadowRoot) {
        shadowTargetElement = component.shadowRoot.querySelector('input');
      }
    });

    test('removes attribute from @property', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-label'));
      assert.equal(component.ariaLabel, 'foo');
      assert.equal(shadowTargetElement?.getAttribute('aria-label'), 'foo');
    });

    test('removes attribute from getter and setter', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-checked'));
      assert.equal(component.ariaChecked, 'mixed');
      assert.equal(shadowTargetElement?.getAttribute('aria-checked'), 'mixed');
    });

    test('removes attribute from alternate order', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowTargetElement === null) {
        assert.isNotNull(shadowTargetElement);
        return;
      }
      await component.updateComplete;
      assert.isNull(component.getAttribute('aria-owns'));
      assert.equal(component.ariaOwns, 'baz');
      assert.equal(shadowTargetElement?.getAttribute('aria-owns'), 'baz');
    });
  });
});
