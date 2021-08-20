/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


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

  override render() {
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

  override click() {
    if (this.indirectRoot) {
      this.indirectRoot.click();
    }
  }

  override render() {
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
      expect(component).toBeInstanceOf(BaseElement);
    });

    it('shadowRoot focuses on #root after click', async () => {
      if (component === null) {
        expect(component).not.toBeNull();
        return;
      }
      if (component.shadowRoot === null) {
        expect(component.shadowRoot).not.toBeNull();
        return;
      }
      if (shadowTargetElement === null) {
        expect(shadowTargetElement).not.toBeNull();
        return;
      }

      component.click();
      await component.updateComplete;

      expect(component.shadowRoot.activeElement).toEqual(shadowTargetElement);
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
      expect(component).toBeInstanceOf(BaseElement);
    });

    it('shadowRoot should not focus on #indirect after click', async () => {
      if (component === null) {
        expect(component).not.toBeNull();
        return;
      }
      if (component.shadowRoot === null) {
        expect(component.shadowRoot).not.toBeNull();
        return;
      }
      if (shadowIndirectElement === null) {
        expect(shadowIndirectElement).not.toBeNull();
        return;
      }

      component.click();
      await component.updateComplete;

      expect(component.shadowRoot.activeElement)
          .not.toEqual(shadowIndirectElement);
    });

    it('shadowRoot should not focus on #root after click', async () => {
      if (component === null) {
        expect(component).not.toBeNull();
        return;
      }
      if (component.shadowRoot === null) {
        expect(component.shadowRoot).not.toBeNull();
        return;
      }
      if (shadowRootElement === null) {
        expect(shadowRootElement).not.toBeNull();
        return;
      }

      component.click();
      await component.updateComplete;

      expect(component.shadowRoot.activeElement).not.toEqual(shadowRootElement);
    });
  });
});
