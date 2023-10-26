/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {
  ARIAProperty,
  ariaPropertyToAttribute,
  isAriaAttribute,
  polyfillARIAMixin,
  polyfillElementInternalsAria,
} from './aria.js';

describe('aria', () => {
  describe('isAriaAttribute()', () => {
    it('should return true for aria value attributes', () => {
      expect(isAriaAttribute('aria-label'))
        .withContext('aria-label input')
        .toBeTrue();
    });

    it('should return true for aria idref attributes', () => {
      expect(isAriaAttribute('aria-labelledby'))
        .withContext('aria-labelledby input')
        .toBeTrue();
    });

    it('should return false for role', () => {
      expect(isAriaAttribute('role')).withContext('role input').toBeFalse();
    });

    it('should return false for non-aria attributes', () => {
      expect(isAriaAttribute('label')).withContext('label input').toBeFalse();
    });
  });

  describe('ariaPropertyToAttribute()', () => {
    it('should convert aria value properties', () => {
      expect(ariaPropertyToAttribute('ariaLabel')).toBe('aria-label');
    });

    it('should convert aria idref properties', () => {
      expect(
        ariaPropertyToAttribute('ariaLabelledByElements' as ARIAProperty),
      ).toBe('aria-labelledby');
    });
  });

  describe('polyfillARIAMixin()', () => {
    @customElement('test-setup-aria-host')
    class TestElement extends LitElement {
      static {
        polyfillARIAMixin(TestElement);
      }

      override render() {
        return html`<slot></slot>`;
      }
    }

    it('should reflect ARIAMixin properties to attributes', async () => {
      const element = new TestElement();
      document.body.appendChild(element);
      element.role = 'button';
      element.ariaLabel = 'Foo';
      await element.updateComplete;
      expect(element.getAttribute('role'))
        .withContext('role attribute value')
        .toEqual('button');

      expect(element.getAttribute('aria-label'))
        .withContext('aria-label attribute value')
        .toEqual('Foo');
      element.remove();
    });
  });

  describe('polyfillElementInternalsAria()', () => {
    @customElement('test-polyfill-element-internals-aria')
    class TestElement extends LitElement {
      static {
        polyfillARIAMixin(TestElement);
      }

      internals = polyfillElementInternalsAria(this, this.attachInternals());

      constructor() {
        super();
        this.internals.role = 'button';
      }

      override render() {
        return html`<slot></slot>`;
      }
    }

    if ('role' in ElementInternals.prototype) {
      it('should not hydrate attributes when role set', () => {
        const element = new TestElement();
        document.body.appendChild(element);
        expect(element.hasAttribute('role'))
          .withContext('has role attribute')
          .toBeFalse();

        element.remove();
      });
    } else {
      it('should preserve role values when set before connected', () => {
        const element = new TestElement();
        // TestElement() sets role in constructor
        expect(element.internals.role)
          .withContext('ElementInternals.role')
          .toEqual('button');
      });

      it('should preserve aria values when set before connected', () => {
        const element = new TestElement();
        element.internals.ariaLabel = 'Foo';
        expect(element.internals.ariaLabel)
          .withContext('ElementInternals.ariaLabel')
          .toEqual('Foo');
      });

      it('should hydrate role attributes when set before connection', async () => {
        const element = new TestElement();
        // TestElement() sets role in constructor
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('role'))
          .withContext('role attribute value')
          .toEqual('button');

        element.remove();
      });

      it('should hydrate aria attributes when set before connection', async () => {
        const element = new TestElement();
        element.internals.ariaLabel = 'Foo';
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('aria-label'))
          .withContext('aria-label attribute value')
          .toEqual('Foo');

        element.remove();
      });

      it('should set aria attributes when set after connection', async () => {
        const element = new TestElement();
        document.body.appendChild(element);
        element.internals.ariaLabel = 'Value after construction';
        await element.updateComplete;
        expect(element.getAttribute('aria-label'))
          .withContext('aria-label attribute value')
          .toEqual('Value after construction');

        element.remove();
      });

      it('should not override aria attributes on host when set before connection', async () => {
        const element = new TestElement();
        element.setAttribute('aria-label', 'Value set by user');
        element.internals.ariaLabel = 'Value set on internals';
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('aria-label'))
          .withContext('aria-label attribute value on host')
          .toEqual('Value set by user');
        expect(element.internals.ariaLabel)
          .withContext('ariaLabel internals property still the same')
          .toEqual('Value set on internals');

        element.remove();
      });

      it('should not override aria properties on host when set before connection', async () => {
        const element = new TestElement();
        element.ariaLabel = 'Value set by user';
        element.internals.ariaLabel = 'Value set on internals';
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('aria-label'))
          .withContext('aria-label attribute value on host')
          .toEqual('Value set by user');
        expect(element.ariaLabel)
          .withContext('ariaLabel property value on host')
          .toEqual('Value set by user');
        expect(element.internals.ariaLabel)
          .withContext('ariaLabel internals property still the same')
          .toEqual('Value set on internals');

        element.remove();
      });

      it('should not override role attribute on host when set before connection', async () => {
        const element = new TestElement();
        element.setAttribute('role', 'Value set by user');
        element.internals.role = 'Value set on internals';
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('role'))
          .withContext('role attribute value on host')
          .toEqual('Value set by user');
        expect(element.internals.role)
          .withContext('role internals property still the same')
          .toEqual('Value set on internals');

        element.remove();
      });

      it('should not override role property on host when set before connection', async () => {
        const element = new TestElement();
        element.role = 'Value set by user';
        element.internals.role = 'Value set on internals';
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.getAttribute('role'))
          .withContext('role attribute value on host')
          .toEqual('Value set by user');
        expect(element.role)
          .withContext('role property value on host')
          .toEqual('Value set by user');
        expect(element.internals.role)
          .withContext('role internals property still the same')
          .toEqual('Value set on internals');

        element.remove();
      });

      it('should handle setting role multiple times before connection', async () => {
        const element = new TestElement();
        element.internals.role = 'button';
        element.internals.role = 'checkbox';

        expect(element.internals.role)
          .withContext('internals.role before connection')
          .toEqual('checkbox');
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.internals.role)
          .withContext('internals.role after connection')
          .toEqual('checkbox');

        element.remove();
      });

      it('should handle setting role multiple times before connection when property is set on host', async () => {
        const element = new TestElement();
        element.role = 'radio';
        element.internals.role = 'button';
        element.internals.role = 'checkbox';

        expect(element.internals.role)
          .withContext('internals.role before connection')
          .toEqual('checkbox');
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.internals.role)
          .withContext('internals.role after connection')
          .toEqual('checkbox');

        element.remove();
      });

      it('should handle setting aria properties multiple times before connection', async () => {
        const element = new TestElement();
        element.internals.ariaLabel = 'First';
        element.internals.ariaLabel = 'Second';

        expect(element.internals.ariaLabel)
          .withContext('internals.ariaLabel before connection')
          .toEqual('Second');
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.internals.ariaLabel)
          .withContext('internals.ariaLabel after connection')
          .toEqual('Second');

        element.remove();
      });

      it('should handle setting aria properties multiple times before connection when property is set on host', async () => {
        const element = new TestElement();
        element.ariaLabel = 'First';
        element.internals.ariaLabel = 'First';
        element.internals.ariaLabel = 'Second';

        expect(element.internals.ariaLabel)
          .withContext('internals.ariaLabel before connection')
          .toEqual('Second');
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.internals.ariaLabel)
          .withContext('internals.ariaLabel after connection')
          .toEqual('Second');

        element.remove();
      });

      it('should handle setting role after first connection while disconnected', async () => {
        const element = new TestElement();
        element.internals.role = 'button';
        document.body.appendChild(element);
        await element.updateComplete;

        element.remove();
        element.internals.role = 'checkbox';
        expect(element.internals.role)
          .withContext('internals.role after connected and disconnected')
          .toEqual('checkbox');
        document.body.appendChild(element);
        await element.updateComplete;
        expect(element.internals.role)
          .withContext('internals.role after reconnected')
          .toEqual('checkbox');

        element.remove();
      });
    }
  });
});
