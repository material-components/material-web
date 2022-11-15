/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { html, LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { queryParams } from "../utils/query-params.js";
import "./three-node.js";
import "./one-node.js";
import { mdElevationStyles as mdElevationStylesThreeNode } from "./three-node.js";
import { mdElevationStyles } from "./one-node.js";

// Settings
const { tag = "", count = 500 } = queryParams as { [index: string]: string };

const cardStyle = css`
  :host {
    --md-comp-elevation-level: 5;
    --md-comp-elevation-duration: 500ms;
    --md-comp-elevation-easing: ease-in-out;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    width: 64px;
    height: 64px;
    margin: 16px;
    position: relative;
  }
  .card > * {
    position: absolute !important;
    inset: 0;
  }
`;

@customElement("comp-three-node")
export class CompThreeNode extends LitElement {
  static override styles = [cardStyle];
  protected override render() {
    return html` <div class="card">5<three-node></three-node></div>`;
  }
}

@customElement("comp-one-node")
export class CompOneNode extends LitElement {
  static override styles = [cardStyle];
  protected override render() {
    return html` <div class="card">5<one-node></one-node></div>`;
  }
}

@customElement("css-one-node")
export class CssOneNode extends LitElement {
  static override styles = [cardStyle, mdElevationStyles];
  protected override render() {
    return html` <div class="card">
      5
      <div class="md-elevation"></div>
    </div>`;
  }
}

@customElement("css-three-node")
export class CssThreeNode extends LitElement {
  static override styles = [cardStyle, mdElevationStylesThreeNode];
  protected override render() {
    return html` <div class="card">
      5
      <span class="overlay"></span>
      <span class="key"></span>
      <span class="ambient"></span>
    </div>`;
  }
}

(async () => {
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

  await layout();

  // Log
  performance
    .getEntriesByType("measure")
    .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
