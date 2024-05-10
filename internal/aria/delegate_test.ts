/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {customElement, property, queryAsync} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {ARIAMixinStrict} from './aria.js';
import {mixinDelegatesAria} from './delegate.js';

declare global {
  interface HTMLElementTagNameMap {
    'test-delegates-aria': DelegatesAriaElement;
  }
}

// Separate variable needed for closure.
const delegatesAriaElementBaseClass = mixinDelegatesAria(LitElement);

@customElement('test-delegates-aria')
class DelegatesAriaElement extends delegatesAriaElementBaseClass {
  @queryAsync('button') readonly delegate!: Promise<HTMLElement | null>;
  @property({attribute: 'lit-attribute'}) litAttribute = '';

  protected override render() {
    return html`<button
      role=${(this as ARIAMixinStrict).role || nothing}
      aria-label=${this.ariaLabel || nothing}
      aria-haspopup=${(this as ARIAMixinStrict).ariaHasPopup || nothing}
      lit-attribute=${this.litAttribute}>
      Label
    </button>`;
  }
}

describe('mixinDelegatesAria()', () => {
  const env = new Environment();

  // `mixinDelegatesAria()` patches `element.getAttribute()`, which makes it
  // unreliable when testing what the screen reader sees. This function returns
  // the "real" attribute value as read from the element's `outerHTML`,
  // bypassing any patched methods or properties.
  function getOuterHTMLAttribute(
    element: Element,
    attribute: string,
  ): string | null {
    const match = element.outerHTML.match(
      new RegExp(`\\s${attribute}="([^"]*)"`),
    );
    return match ? match[1] : null;
  }

  async function setupTest(templateWithTestAriaDelegate: TemplateResult) {
    const root = env.render(templateWithTestAriaDelegate);
    const host = root.querySelector('test-delegates-aria');
    if (!host) {
      throw new Error('Could not query rendered <test-delegates-aria>.');
    }

    await host.updateComplete;
    const delegate = await host.delegate;
    if (!delegate) {
      throw new Error(
        "Could not query <test-delegates-aria>'s rendered delegate element.",
      );
    }

    return {host, delegate};
  }

  // We test two attributes: 'aria-label' and 'role'. We explicitly test 'role'
  // to include test cases that are not prefixed with 'aria-'.

  describe('sets and does not repeat aria attributes when: ', () => {
    it('rendering aria-label attribute', async () => {
      // Arrange
      // Act
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
      );

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBe('foo');
    });

    it('rendering role attribute', async () => {
      // Arrange
      // Act
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria role="link"></test-delegates-aria>`,
      );

      // Assert
      expect(getOuterHTMLAttribute(host, 'role'))
        .withContext('host role')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'role'))
        .withContext('delegate role')
        .toBe('link');
    });

    // Test rendering multiple attributes to stress test the logic in
    // attributeChangedCallback, which may be called out of order while shifting
    // attributes.
    it('rendering aria and non-aria attributes at the same time', async () => {
      // Arrange
      // Act
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria
          aria-label="foo"
          lit-attribute="bar"></test-delegates-aria>`,
      );

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBe('foo');
      expect(getOuterHTMLAttribute(delegate, 'lit-attribute'))
        .withContext('delegate lit-attribute')
        .toBe('bar');
    });

    it('rendering multiple aria attributes at the same time', async () => {
      // Arrange
      // Act
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria
          aria-label="foo"
          aria-haspopup="true"></test-delegates-aria>`,
      );

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(host, 'aria-haspopup'))
        .withContext('host aria-haspopup')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBe('foo');
      expect(getOuterHTMLAttribute(delegate, 'aria-haspopup'))
        .withContext('delegate aria-haspopup')
        .toBe('true');
    });

    it("calling host.setAttribute('aria-label')", async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria></test-delegates-aria>`,
      );

      // Act
      host.setAttribute('aria-label', 'foo');
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBe('foo');
    });

    it("calling host.setAttribute('role')", async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria></test-delegates-aria>`,
      );

      // Act
      host.setAttribute('role', 'link');
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'role'))
        .withContext('host role')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'role'))
        .withContext('delegate role')
        .toBe('link');
    });

    it('setting host.ariaLabel to a string', async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria></test-delegates-aria>`,
      );

      // Act
      host.ariaLabel = 'foo';
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBe('foo');
    });

    it('setting host.role to a string', async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria></test-delegates-aria>`,
      );

      // Act
      host.role = 'link';
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'role'))
        .withContext('host role')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'role'))
        .withContext('delegate role')
        .toBe('link');
    });
  });

  describe('returns the correct aria attribute value when: ', () => {
    it('calling host.getAttribute("aria-label")', async () => {
      // Arrange
      const {host} = await setupTest(
        html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
      );

      // Act
      const getAttributeResult = host.getAttribute('aria-label');

      // Assert
      expect(getAttributeResult)
        .withContext('host.getAttribute() value')
        .toEqual('foo');
    });

    it('calling host.getAttribute("role")', async () => {
      // Arrange
      const {host} = await setupTest(
        html`<test-delegates-aria role="link"></test-delegates-aria>`,
      );

      // Act
      const getAttributeResult = host.getAttribute('role');

      // Assert
      expect(getAttributeResult)
        .withContext('host.getAttribute() value')
        .toEqual('link');
    });

    it('getting host.ariaLabel', async () => {
      // Arrange
      const {host} = await setupTest(
        html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
      );

      // Act
      const hostAriaLabel = host.ariaLabel;

      // Assert
      expect(hostAriaLabel).withContext('host.ariaLabel value').toEqual('foo');
    });

    it('getting host.role', async () => {
      // Arrange
      const {host} = await setupTest(
        html`<test-delegates-aria role="link"></test-delegates-aria>`,
      );

      // Act
      const hostRole = host.role;

      // Assert
      expect(hostRole).withContext('host.role value').toEqual('link');
    });
  });

  describe('removes the delegated aria attribute when: ', () => {
    it("calling host.removeAttribute('aria-label')", async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
      );

      // Act
      host.removeAttribute('aria-label');
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBeNull();
    });

    it("calling host.removeAttribute('role')", async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria role="link"></test-delegates-aria>`,
      );

      // Act
      host.removeAttribute('role');
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'role'))
        .withContext('host role')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'role'))
        .withContext('delegate role')
        .toBeNull();
    });

    it('setting host.ariaLabel to null', async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
      );

      // Act
      host.ariaLabel = null;
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'aria-label'))
        .withContext('host aria-label')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'aria-label'))
        .withContext('delegate aria-label')
        .toBeNull();
    });

    it('setting host.role to null', async () => {
      // Arrange
      const {host, delegate} = await setupTest(
        html`<test-delegates-aria role="link"></test-delegates-aria>`,
      );

      // Act
      host.role = null;
      await host.updateComplete;

      // Assert
      expect(getOuterHTMLAttribute(host, 'role'))
        .withContext('host role')
        .toBeNull();
      expect(getOuterHTMLAttribute(delegate, 'role'))
        .withContext('delegate role')
        .toBeNull();
    });
  });

  it('does not change behavior of setting non-aria attributes', async () => {
    // Arrange
    const {host} = await setupTest(
      html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
    );

    // Act
    host.setAttribute('foo', 'bar');

    // Assert
    const realFooAttribute = getOuterHTMLAttribute(host, 'foo');
    expect(realFooAttribute)
      .withContext('real "foo" attribute as read from outerHTML')
      .toEqual('bar');
    expect(host.getAttribute('foo'))
      .withContext("host.getAttribute('foo')")
      .toEqual(realFooAttribute);
  });

  it('does not change behavior of LitElement @property() attributes', async () => {
    // Arrange
    const {host, delegate} = await setupTest(
      html`<test-delegates-aria aria-label="foo"></test-delegates-aria>`,
    );

    // Act
    host.setAttribute('lit-attribute', 'bar');
    await host.updateComplete;

    // Assert
    expect(host.litAttribute)
      .withContext('host.litAttribute property updates from attribute change')
      .toEqual('bar');
    expect(getOuterHTMLAttribute(host, 'lit-attribute'))
      .withContext('host has "lit-attribute" as read from outerHTML')
      .toEqual('bar');
    expect(getOuterHTMLAttribute(delegate, 'lit-attribute'))
      .withContext('LitElement updated "lit-attribute" in the template')
      .toEqual('bar');
  });
});
