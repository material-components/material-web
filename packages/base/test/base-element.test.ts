/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {BaseElement} from '@material/mwc-base/base-element';
import {customElement, query} from 'lit-element';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';


@customElement('test-element')
class TestElement extends BaseElement {
  @query('#root') protected mdcRoot!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }

  render() {
    return html`
      <input type="text" id="root"></input>
    `;
  }
}

@customElement('custom-click-element')
class CustomClickElement extends BaseElement {
  @query('#root') protected mdcRoot!: HTMLElement;
  @query('#indirect') protected indirectRoot!: HTMLElement;

  protected mdcFoundation = undefined;
  protected mdcFoundationClass = undefined;
  protected createAdapter() {
    return {};
  }

  click() {
    if (this.indirectRoot) {
      this.indirectRoot.click();
    }
  }

  render() {
    return html`
      <input type="text" id="root"></input>
      <input type="text" id="indirect"></input>
    `;
  }
}

const testElement = html`
  <test-element></test-element>
`;

const testClickElement = html`
  <custom-click-element></custom-click-element>
`;

describe('base-element:', () => {
  describe('test-element', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLElement|null;

    beforeEach(async () => {
      fixt = await fixture(testElement);
      component = fixt.root.querySelector('test-element');

      if (component !== null && component.shadowRoot !== null) {
        shadowTargetElement = component.shadowRoot.querySelector('#root');
      }
    });

    afterEach(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    it('is an instance of base-element', () => {
      assert.instanceOf(component, BaseElement);
    });

    it('shadowRoot focuses on #root after click', async () => {
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

      component.click();
      await component.updateComplete;

      assert.equal(component.shadowRoot.activeElement, shadowTargetElement);
    });
  });

  describe('custom-click-element', () => {
    let fixt: TestFixture;
    let component: CustomClickElement|null;
    let shadowRootElement: HTMLElement|null;
    let shadowIndirectElement: HTMLElement|null;

    beforeEach(async () => {
      fixt = await fixture(testClickElement);
      component = fixt.root.querySelector('custom-click-element');

      if (component !== null && component.shadowRoot !== null) {
        shadowRootElement = component.shadowRoot.querySelector('#root');
        shadowIndirectElement = component.shadowRoot.querySelector('#indirect');
      }
    });

    afterEach(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    it('an instance of BaseElement', () => {
      assert.instanceOf(component, BaseElement);
    });

    it('shadowRoot should not focus on #indirect after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowIndirectElement === null) {
        assert.isNotNull(shadowIndirectElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(
          component.shadowRoot.activeElement, shadowIndirectElement);
    });

    it('shadowRoot should not focus on #root after click', async () => {
      if (component === null) {
        assert.isNotNull(component);
        return;
      }
      if (component.shadowRoot === null) {
        assert.isNotNull(component.shadowRoot);
        return;
      }
      if (shadowRootElement === null) {
        assert.isNotNull(shadowRootElement);
        return;
      }

      component.click();
      await component.updateComplete;

      assert.notEqual(component.shadowRoot.activeElement, shadowRootElement);
    });
  });
});
