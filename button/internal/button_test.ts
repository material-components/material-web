/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../text-button.js';

import {html, render} from 'lit';

describe('Button', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  it('renders inner button', async () => {
    render(html`
      <md-text-button></md-text-button>
    `, root);

    const button = root.querySelector('md-text-button')!;
    await button.updateComplete;

    const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

    expect(buttonEl.tagName).toBe('BUTTON');
    expect(buttonEl.classList.contains('button--icon-leading')).toBeFalse();
    expect(buttonEl.classList.contains('button--icon-trailing')).toBeFalse();
    expect(buttonEl.hasAttribute('disabled')).toBeFalse();
    expect(buttonEl.hasAttribute('aria-label')).toBeFalse();
    expect(buttonEl.hasAttribute('aria-haspopup')).toBeFalse();
    expect(buttonEl.hasAttribute('aria-expanded')).toBeFalse();
    expect(buttonEl.hasAttribute('href')).toBeFalse();
    expect(buttonEl.hasAttribute('target')).toBeFalse();
  });

  describe('disabled', () => {
    it('reflects to internal button', async () => {
      render(html`
        <md-text-button disabled></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      expect(buttonEl.hasAttribute('disabled')).toBeTrue();

      button.disabled = false;
      await button.updateComplete;

      expect(buttonEl.hasAttribute('disabled')).toBeFalse();
    });
  });

  describe('href', () => {
    it('renders <a> if set', async () => {
      render(html`
        <md-text-button href="/"></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;
      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      expect(buttonEl.tagName).toBe('A');
      expect(buttonEl.getAttribute('href')).toBe('/');
    });

    it('ignores disabled flag if set', async () => {
      render(html`
        <md-text-button href="/" disabled></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;
      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      expect(buttonEl.hasAttribute('disabled')).toBeFalse();
    });
  });

  describe('target', () => {
    it('reflects to internal button', async () => {
      render(html`
        <md-text-button target="_blank" href="/"></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;
      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      expect(buttonEl.getAttribute('target')).toBe('_blank');
    });
  });

  describe('trailingIcon', () => {
    it('renders icon at end of button if set', async () => {
      render(html`
        <md-text-button trailing-icon>
        </md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'icon');
      button.appendChild(icon);

      // Wait for the `queryAssignedelements` to do its thing
      await button.updateComplete;

      // Wait for `handleSlotChange` to happen
      await button.updateComplete;

      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      // Specifically look for an icon slot _after_ the label
      const iconEl = button.shadowRoot!.querySelector<HTMLElement>(
        '.button__label + slot[name="icon"]'
      );

      expect(buttonEl.classList.contains('button--icon-trailing')).toBeTrue();
      expect(iconEl).not.toBeNull();
    });
  });

  describe('hasIcon', () => {
    it('reflects whether there is an icon or not', async () => {
      render(html`
        <md-text-button>
          <span slot="icon">boop</span>
        </md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      expect(button.hasIcon).toBeTrue();
    });
  });

  describe('name', () => {
    it('gets the name attribute', async () => {
      render(html`
        <md-text-button></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      button.name = 'some name';
      expect(button.getAttribute('name')).toBe('some name');
    });

    it('sets the name attribute', async () => {
      render(html`
        <md-text-button name="some name"></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      expect(button.name).toBe('some name');
    });
  });

  describe('focus', () => {
    it('delegates to inner button', async () => {
      render(html`
        <md-text-button></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      expect(button.shadowRoot!.activeElement).toBeNull();

      button.focus();

      expect(button.shadowRoot!.activeElement).toBe(buttonEl);
    });
  });

  describe('blur', () => {
    it('delegates to inner button', async () => {
      render(html`
        <md-text-button></md-text-button>
      `, root);

      const button = root.querySelector('md-text-button')!;
      await button.updateComplete;

      const buttonEl = button.shadowRoot!.querySelector<HTMLElement>('.button')!;

      buttonEl.focus();

      expect(button.shadowRoot!.activeElement).toBe(buttonEl);

      button.blur();

      expect(button.shadowRoot!.activeElement).toBeNull();
    });
  });
});
