/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {ariaProperty} from '@material/mwc-base/aria-property';
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {fixture, TestFixture} from '../../../test/src/util/helpers';


@customElement('test-aria-element')
class TestElement extends LitElement {
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  protected internalAriaChecked?: string|null = null;

  @ariaProperty
  @property({attribute: 'aria-checked'})
  override set ariaChecked(value: string) {
    if (value === 'mixed') {
      this.internalAriaChecked = value;
    } else {
      this.internalAriaChecked = null;
    }
    this.requestUpdate();
  }

  override get ariaChecked(): string {
    return this.internalAriaChecked ?? '';
  }

  @property({attribute: 'aria-owns'}) @ariaProperty ariaOwns!: string;

  override render() {
    return html`<input aria-label="${
        ifDefined(this.ariaLabel)}" aria-checked="${
        ifDefined(this.ariaChecked)}" aria-owns="${ifDefined(this.ariaOwns)}">`;
  }
}

const imperative = html`<test-aria-element></test-aria-element>`;
const declarative =
    html`<test-aria-element aria-label="foo" aria-checked="mixed" aria-owns="baz"></test-aria-element>`;

describe('aria-property:', () => {
  describe('imperative', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLInputElement|null;

    beforeEach(async () => {
      fixt = await fixture(imperative);
      component = fixt.root.querySelector('test-aria-element');

      if (component?.shadowRoot) {
        shadowTargetElement = component.shadowRoot.querySelector('input');
      }
    });

    afterEach(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    it('property sets with @property()', async () => {
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
      expect(component.ariaLabel).toBeFalsy();
      component.ariaLabel = 'foo';
      await component.updateComplete;
      expect(component.getAttribute('aria-label')).toBeNull();
      expect(component.ariaLabel).toEqual('foo');
      expect(shadowTargetElement.getAttribute('aria-label')).toEqual('foo');
    });

    it('property sets with a getter and setter', async () => {
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
      expect(component.ariaChecked).toBeFalsy();
      ;
      component.ariaChecked = 'mixed';
      await component.updateComplete;
      expect(component.getAttribute('aria-checked')).toBeNull();
      expect(component.ariaChecked).toEqual('mixed');
      expect(shadowTargetElement.getAttribute('aria-checked')).toEqual('mixed');
    });

    it('property sets with alternate order', async () => {
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
      expect(component.ariaOwns).toBeFalsy();
      component.ariaOwns = 'baz';
      await component.updateComplete;
      expect(component.getAttribute('aria-owns')).toBeNull();
      expect(component.ariaOwns).toEqual('baz');
      expect(shadowTargetElement.getAttribute('aria-owns')).toEqual('baz');
    });

    it('attribute sets with @property()', async () => {
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
      expect(component.ariaLabel).toBeFalsy();
      component.setAttribute('aria-label', 'foo');
      await component.updateComplete;
      expect(component.getAttribute('aria-label')).toBeNull();
      expect(component.ariaLabel).toEqual('foo');
      expect(shadowTargetElement.getAttribute('aria-label')).toEqual('foo');
    });

    it('attribute sets with a getter and setter', async () => {
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
      expect(component.ariaChecked).toBeFalsy();
      component.setAttribute('aria-checked', 'mixed');
      await component.updateComplete;
      expect(component.getAttribute('aria-checked')).toBeNull();
      expect(component.ariaChecked).toEqual('mixed');
      expect(shadowTargetElement?.getAttribute('aria-checked'))
          .toEqual('mixed');
    });

    it('attribute sets with alternate order', async () => {
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
      expect(component.ariaOwns).toBeFalsy();
      component.setAttribute('aria-owns', 'baz');
      await component.updateComplete;
      expect(component.getAttribute('aria-owns')).toBeNull();
      expect(component.ariaOwns).toEqual('baz');
      expect(shadowTargetElement.getAttribute('aria-owns')).toEqual('baz');
    });
  });

  describe('declarative', () => {
    let fixt: TestFixture;
    let component: TestElement|null;
    let shadowTargetElement: HTMLInputElement|null;

    beforeEach(async () => {
      fixt = await fixture(declarative);
      component = fixt.root.querySelector('test-aria-element');

      if (component?.shadowRoot) {
        shadowTargetElement = component.shadowRoot.querySelector('input');
      }
    });

    afterEach(async () => {
      if (fixt) {
        fixt.remove();
      }
    });

    it('removes attribute from @property', async () => {
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
      await component.updateComplete;
      expect(component.getAttribute('aria-label')).toBeNull();
      expect(component.ariaLabel).toEqual('foo');
      expect(shadowTargetElement?.getAttribute('aria-label')).toEqual('foo');
    });

    it('removes attribute from getter and setter', async () => {
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
      await component.updateComplete;
      expect(component.getAttribute('aria-checked')).toBeNull();
      expect(component.ariaChecked).toEqual('mixed');
      expect(shadowTargetElement?.getAttribute('aria-checked'))
          .toEqual('mixed');
    });

    it('removes attribute from alternate order', async () => {
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
      await component.updateComplete;
      expect(component.getAttribute('aria-owns')).toBeNull();
      expect(component.ariaOwns).toEqual('baz');
      expect(shadowTargetElement?.getAttribute('aria-owns')).toEqual('baz');
    });
  });
});
