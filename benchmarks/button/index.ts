/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { html, LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { queryParams } from "../utils/query-params.js";

// Settings
const {
  tag = "md-filled-button",
  path = "button/filled-button.js",
  count = 500,
  benchmark = "render",
} = queryParams as { [index: string]: string };

@customElement("baseline-el")
export class BaselineEl extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;
  protected override render() {
    return html` <button>
      <span></span>
      <span><slot></slot></span>
      <span></span>
    </button>`;
  }
}

(async () => {
  await import(`../../${path}`);

  const container = document.createElement("div");
  document.body.appendChild(container);

  const create = () => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      fragment.appendChild(document.createElement(tag));
    }
    return container.appendChild(fragment);
  };

  const destroy = () => {
    container.innerHTML = "";
  };

  const updateComplete = () => new Promise((r) => requestAnimationFrame(r));

  const getTestStartName = (name: string) => `${name}-start`;

  const test = "benchmark";
  const start = getTestStartName(test);

  // Initial Render
  const render = async () => {
    performance.mark(start);
    create();
    await updateComplete();
    performance.measure(test, start);
    destroy();
  };

  // Initial Render + layout
  const layout = async () => {
    performance.mark(start);
    create();
    await updateComplete();
    // force layout
    document.body.offsetWidth;
    performance.measure(test, start);
    destroy();
  };

  switch (benchmark) {
    case "layout":
      await layout();
      break;
    default:
      await render();
      break;
  }

  // Log
  performance
    .getEntriesByType("measure")
    .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
