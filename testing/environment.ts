/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {ReactiveElement, TemplateResult, render as litRender} from 'lit';

import {installSkipWebAnimations} from './skip-animations.js';

/**
 * Test environment setup for screenshot tests.
 */
export class Environment {
  /**
   * An array of root containers for rendering screenshot test elements.
   */
  private readonly roots: HTMLElement[] = [];

  constructor() {
    // Replace RAF with setTimeout, since setTimeout is overridden to be
    // synchronous in Jasmine clock installation.
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return setTimeout(callback, 1);
    };
    window.cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };

    beforeAll(() => {
      jasmine.clock().install();
    });

    afterAll(() => {
      jasmine.clock().uninstall();
      for (const root of this.roots) {
        document.body.appendChild(root);
      }
    });
  }

  /**
   * This marks the environment to run without web animations. This is useful
   * when the tested code calls `.animate`.
   */
  withoutWebAnimations() {
    installSkipWebAnimations();
    return this;
  }

  /**
   * Waits for stability on the page to prevent flaky-ness tests. Use this if
   * waiting for an API that uses `requestAnimationFrame()` or when waiting for
   * a Lit element to render.
   */
  async waitForStability() {
    // Move forward any `requestAnimationFrame()`s since they are replaced with
    // setTimeout(callback, 1) for jasmine clock support.
    jasmine.clock().tick(1);

    const currentRoot = this.getCurrentRoot();
    if (currentRoot) {
      await this.waitForLitRender(currentRoot);
    }
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
   * @return The root container the template was rendered to.
   */
  render(template: TemplateResult) {
    const root = this.createNewRoot();
    litRender(template, root);
    return root;
  }

  /**
   * Creates a new root container for screenshot rendering and adds it to the
   * body.
   *
   * Previous root containers will be hidden and displayed at the end of
   * testing for easier debugging.
   *
   * @return A new root container.
   */
  private createNewRoot() {
    const currentRoot = this.getCurrentRoot();
    if (currentRoot) {
      currentRoot.remove();
    }

    const root = document.createElement('div');
    root.id = 'root';
    root.style.display = 'inline-flex';
    document.body.appendChild(root);
    this.roots.push(root);
    return root;
  }

  /**
   * Get the current root container.
   *
   * @return The current root container or undefined is nothing as been rendered
   *     yet.
   */
  protected getCurrentRoot(): HTMLElement | undefined {
    return this.roots[this.roots.length - 1];
  }
}
