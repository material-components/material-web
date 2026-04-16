/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {createClassMapDirective, createElementDirective} from './directives.js';

describe('directives', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('createClassMapDirective()', () => {
    it('calls setupElement when element is connected', () => {
      const setupElement = jasmine.createSpy('setupElement');
      const directive = createClassMapDirective({
        getClasses: () => ({}),
        setupElement,
      });

      render(html`<div class="${directive()}"></div>`, container);
      expect(setupElement)
        .withContext('setupElement()')
        .toHaveBeenCalledTimes(1);
    });

    it('calls setupElement when element is re-connected', () => {
      const setupElement = jasmine.createSpy('setupElement');
      const directive = createClassMapDirective({
        getClasses: () => ({}),
        setupElement,
      });
      const directiveResult = directive();

      render(html`<div class="${directiveResult}"></div>`, container);
      render(html`<span class="${directiveResult}"></span>`, container);
      expect(setupElement)
        .withContext('setupElement()')
        .toHaveBeenCalledTimes(2);
    });

    it('aborts cleanup signal when element is disconnected', () => {
      let cleanupSignal: AbortSignal | undefined;
      const directive = createClassMapDirective({
        getClasses: () => ({}),
        setupElement: (el, {signal}) => {
          cleanupSignal = signal;
        },
      });

      render(html`<div class="${directive()}"></div>`, container);
      expect(cleanupSignal?.aborted).toBeFalse();

      render(html``, container);
      expect(cleanupSignal?.aborted).toBeTrue();
    });

    it('renders classMap() result of getClasses()', () => {
      const directive = createClassMapDirective({
        getClasses: ({selected = false}: {selected?: boolean} = {}) => ({
          'selected': selected,
        }),
      });

      const templateSelected = (selected: boolean) =>
        html`<div class="${directive({selected})}"></div>`;

      render(templateSelected(true), container);
      const el = container.firstElementChild as HTMLElement;
      expect(el.classList.contains('selected'))
        .withContext('has .selected class')
        .toBeTrue();

      render(templateSelected(false), container);
      expect(el.classList.contains('selected'))
        .withContext('does not have .selected class')
        .toBeFalse();
    });

    it('renders additional classes to the element', () => {
      const directive = createClassMapDirective<{}>({
        getClasses: () => ({}),
      });

      render(
        html`<div class="${directive({classes: {'extra': true}})}"></div>`,
        container,
      );
      const el = container.firstElementChild as HTMLElement;
      expect(el.classList.contains('extra'))
        .withContext('has .extra class')
        .toBeTrue();
    });
  });

  describe('createElementDirective()', () => {
    it('calls setupElement when element is connected', () => {
      const setupElement = jasmine.createSpy('setupElement');
      const directive = createElementDirective(setupElement);

      render(html`<div ${directive()}></div>`, container);
      expect(setupElement)
        .withContext('setupElement()')
        .toHaveBeenCalledTimes(1);
    });

    it('calls setupElement when element is re-connected', () => {
      const setupElement = jasmine.createSpy('setupElement');
      const directive = createElementDirective(setupElement);
      const directiveResult = directive();

      render(html`<div ${directiveResult}></div>`, container);
      render(html`<span ${directiveResult}></span>`, container);
      expect(setupElement)
        .withContext('setupElement()')
        .toHaveBeenCalledTimes(2);
    });

    it('aborts cleanup signal when element is disconnected', () => {
      let cleanupSignal: AbortSignal | undefined;
      const directive = createElementDirective((el, {signal}) => {
        cleanupSignal = signal;
      });

      render(html`<div ${directive()}></div>`, container);
      expect(cleanupSignal?.aborted).toBeFalse();

      render(html``, container);
      expect(cleanupSignal?.aborted).toBeTrue();
    });
  });
});
