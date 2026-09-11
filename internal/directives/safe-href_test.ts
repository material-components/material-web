/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, nothing, render} from 'lit';
import {safeHref} from './safe-href.js';

describe('safeHref() directive', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('valid URLs', () => {
    it('renders http URLs', () => {
      // Arrange
      const url = 'http://example.com';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should be populated with the valid http URL',
        )
        .toBe(url);
    });

    it('renders https URLs', () => {
      // Arrange
      const url = 'https://example.com/foo?bar=1#baz';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should be populated with the valid https URL including query and hash',
        )
        .toBe(url);
    });

    it('renders relative URLs', () => {
      // Arrange
      const renderAnchor = (href: unknown) =>
        render(
          html`<a
            href=${safeHref(href as Parameters<typeof safeHref>[0])}></a>`,
          container,
        );

      // Act & Assert: Root-relative path
      renderAnchor('/path/to/page');
      expect(container.querySelector('a')!.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered root-relative path',
        )
        .toBe('/path/to/page');

      // Act & Assert: Hash fragment URL
      renderAnchor('#anchor');
      expect(container.querySelector('a')!.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered hash fragment URL',
        )
        .toBe('#anchor');

      // Act & Assert: Document-relative path
      renderAnchor('./relative/path');
      expect(container.querySelector('a')!.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered document-relative path',
        )
        .toBe('./relative/path');
    });

    it('renders mailto URLs', () => {
      // Arrange
      const url = 'mailto:user@example.com';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered mailto URL to preserve email links',
        )
        .toBe(url);
    });

    it('renders tel URLs', () => {
      // Arrange
      const url = 'tel:+1234567890';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered tel URL to preserve phone links',
        )
        .toBe(url);
    });

    it('renders sms URLs', () => {
      // Arrange
      const url = 'sms:+1234567890';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered sms URL to preserve SMS links',
        )
        .toBe(url);
    });

    it('renders extension URLs', () => {
      // Arrange
      const url = 'chrome-extension://abcdefghijklmnop/main.html';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered chrome-extension URL for extension assets',
        )
        .toBe(url);
    });

    it('renders intent URLs', () => {
      // Arrange
      const url = 'intent://example.com#Intent;scheme=https;end';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered intent URL for Android app intents',
        )
        .toBe(url);
    });

    it('renders ftp URLs', () => {
      // Arrange
      const url = 'ftp://example.com/file.txt';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'href attribute should match the rendered ftp URL for FTP resources',
        )
        .toBe(url);
    });

    it('renders data URLs', () => {
      // Arrange
      const url = 'data:text/plain;charset=utf-8,hello';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext('href attribute should match the rendered safe data URL')
        .toBe(url);
    });
  });

  describe('hostile and blocked payloads', () => {
    it('blocks javascript:alert(1)', () => {
      // Arrange
      const url = 'javascript:alert(1)';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext(
          'href attribute must be removed to prevent XSS from standard javascript: URLs',
        )
        .toBeFalse();
    });

    it('blocks javascript: URLs with mixed casing and whitespace', () => {
      // Arrange
      const url = '  JAVASCRIPT:evil()';

      // Act
      render(html`<a href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext(
          'href attribute must be removed when javascript: URL contains leading whitespace or uppercase characters',
        )
        .toBeFalse();
    });

    it('removes href attribute when updating from valid URL to javascript: URL', () => {
      // Arrange
      const renderAnchor = (href: unknown) =>
        render(
          html`<a
            href=${safeHref(href as Parameters<typeof safeHref>[0])}></a>`,
          container,
        );

      // Act 1: Render initial valid URL
      renderAnchor('https://example.com');
      const anchor = container.querySelector('a')!;

      // Assert 1: Valid URL rendered
      expect(anchor.getAttribute('href'))
        .withContext('href attribute should initially be set to the valid URL')
        .toBe('https://example.com');

      // Act 2: Update with hostile URL using the same template instance
      renderAnchor('javascript:alert(1)');

      // Assert 2: Attribute removed
      expect(anchor.hasAttribute('href'))
        .withContext(
          'href attribute must be removed when re-rendered with a hostile javascript: URL',
        )
        .toBeFalse();
    });
  });

  describe('empty and sentinel values', () => {
    it('removes attribute on empty string', () => {
      // Arrange
      const emptyUrl = '';

      // Act
      render(html`<a href=${safeHref(emptyUrl)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext(
          'href attribute should be removed when passed an empty string',
        )
        .toBeFalse();
    });

    it('removes attribute on null', () => {
      // Arrange
      // Act
      render(html`<a href=${safeHref(null)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext('href attribute should be removed when passed null')
        .toBeFalse();
    });

    it('removes attribute on undefined', () => {
      // Arrange
      // Act
      render(html`<a href=${safeHref(undefined)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext('href attribute should be removed when passed undefined')
        .toBeFalse();
    });

    it('removes attribute on nothing', () => {
      // Arrange
      const sentinel: typeof nothing = nothing;

      // Act
      render(html`<a href=${safeHref(sentinel)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.hasAttribute('href'))
        .withContext(
          'href attribute should be removed when passed the lit nothing sentinel',
        )
        .toBeFalse();
    });
  });

  describe('part type and binding validation', () => {
    it('throws when used on a child part', () => {
      // Arrange
      const renderChildPart = () => {
        render(html`<div>${safeHref('https://example.com')}</div>`, container);
      };

      // Act & Assert
      expect(renderChildPart)
        .withContext(
          'safeHref must throw when bound as a child part rather than an attribute or property binding',
        )
        .toThrowError(
          /safeHref can only be used on attribute or property bindings/,
        );
    });

    it('throws when used on a non-href attribute', () => {
      // Arrange
      const renderNonHrefAttribute = () => {
        render(html`<img src=${safeHref('https://example.com')} />`, container);
      };

      // Act & Assert
      expect(renderNonHrefAttribute)
        .withContext(
          'safeHref must throw when bound to a non-href attribute name',
        )
        .toThrowError(
          /safeHref\(\) directive can only be used on "href" attribute or property bindings\./,
        );
    });

    it('throws when used on a non-href property', () => {
      // Arrange
      const renderNonHrefProperty = () => {
        render(
          html`<input .value=${safeHref('https://example.com')} />`,
          container,
        );
      };

      // Act & Assert
      expect(renderNonHrefProperty)
        .withContext(
          'safeHref must throw when bound to a non-href property name',
        )
        .toThrowError(
          /safeHref\(\) directive can only be used on "href" attribute or property bindings\./,
        );
    });

    it('renders on .href property binding', () => {
      // Arrange
      const url = 'https://example.com';

      // Act
      render(html`<a .href=${safeHref(url)}></a>`, container);
      const anchor = container.querySelector('a')!;

      // Assert
      expect(anchor.getAttribute('href'))
        .withContext(
          'safeHref should successfully bind and populate href when used on a .href property binding',
        )
        .toBe(url);
    });
  });
});
