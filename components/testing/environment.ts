/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {ReactiveElement, render as litRender, TemplateResult} from 'lit';

/**
 * Test environment setup for screenshot tests.
 */
export class Environment {
  /**
   * The root container for rendering screenshot test elements.
   */
  readonly root = document.createElement('div');

  constructor() {
    beforeAll(() => {
      this.root.id = 'root';
      this.root.style.display = 'inline-flex';
      document.body.appendChild(this.root);
    });

    afterAll(() => {
      document.body.removeChild(this.root);
    });
  }

  /**
   * Waits for stability on the page to prevent flaky-ness tests. Use this if
   * waiting for an API that uses `requestAnimationFrame()` or when waiting for
   * a Lit element to render.
   */
  async waitForStability() {
    await this.waitForLitRender(this.root);
  }

  /**
   * Waits for all Lit `ReactiveElement` children of the given parent node to
   * finish rendering.
   *
   * @param root a parent node to wait for rendering on.
   */
  private async waitForLitRender(root: ParentNode) {
    for (const element of root.querySelectorAll('*')) {
      if (this.isReactiveElement(element)) {
        await element.updateComplete;
        await this.waitForLitRender(element.renderRoot);
      }
    }
  }

  /**
   * Tests if an element is a Lit `ReactiveElement`.
   *
   * @param element the element to test.
   * @return true if the element is a `ReactiveElement`.
   */
  private isReactiveElement(element: Element): element is ReactiveElement {
    return Boolean((element as ReactiveElement).updateComplete);
  }

  /**
   * Render a Lit template in the environment's root container.
   *
   * @param template a Lit `TemplateResult` to render.
   */
  render(template: TemplateResult) {
    litRender(template, this.root);
  }
}
