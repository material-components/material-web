/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { html, LitElement, css, TemplateResult } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { queryParams } from "../utils/query-params.js";

import { switchProps } from "./switch-props.js";
import { filledButtonProps } from "./filled-button-props.js";
import { genProps } from "./gen-props.js";

// Settings
const {
  tag = `custom-props`,
  selector = `:host`,
  count = 1000,
  benchmark,
} = queryParams as { [index: string]: string };

@customElement("custom-props")
export class CustomProps extends LitElement {
  static override styles = [
    css`
      :host {
        position: relative;
        display: block;
        margin: 8px;
        padding: 8px;
        border: 1px solid darkgray;
        border-radius: 4px;
        height: 100px;
      }

      .containers {
        overflow: auto;
        display: inline-block;
        height: 100%;
      }

      .container {
        display: inline-block;
        border: 1px dashed black;
        padding: 2px;
        border-radius: 8px;
        line-height: var(--md-sys-typescale-title-small-line-height);
      }

      header {
        text-align: center;
        padding: 4px;
      }

      .info {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--_container-color);
      }
    `,
  ];

  @property({ type: Number })
  depth = 100;

  @state()
  renderTime = "";

  renderContainers(d = this.depth): TemplateResult {
    return d >= 0
      ? html`<div
          class="container"
          style="background: hsl(0 0% ${(d / this.depth) *
          100}%); color: hsl(0 0% ${((this.depth - d) / this.depth) * 100}%);"
        >
          <header class="header">${d}</header>
          ${this.renderContainers(--d)}
        </div>`
      : html``;
  }

  override render() {
    return html`
      <div class="containers">${this.renderContainers()}</div>
      <div class="info">${this.localName}: ${this.renderTime}</div>
    `;
  }

  override firstUpdated() {
    const d = performance.now();
    // Measure lots of stuff...
    this.offsetHeight;
    getComputedStyle(this);
    this.getBoundingClientRect();
    const e = this.shadowRoot!.querySelector<HTMLElement>(
      ".containers > .container"
    )!;
    e.offsetHeight;
    getComputedStyle(e);
    e.getBoundingClientRect();
    this.renderTime = `${(performance.now() - d).toFixed(2)}ms`;
  }
}

@customElement("switch-props")
export class SwitchProps extends CustomProps {
  static override styles = [switchProps(selector), ...CustomProps.styles];
}

@customElement("button-props")
export class ButtonProps extends CustomProps {
  static override styles = [filledButtonProps(selector), ...CustomProps.styles];
}

@customElement("switch-button-props")
export class SwitchButtonProps extends CustomProps {
  static override styles = [
    switchProps(selector),
    filledButtonProps(selector),
    ...CustomProps.styles,
  ];
}

@customElement("synth-props")
export class SynthProps extends CustomProps {
  static override styles = [
    genProps(selector, Number(count)),
    ...CustomProps.styles,
  ];
}

(async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const create = () => {
    const el = document.createElement(tag);
    return container.appendChild(el);
  };

  const destroy = () => {
    container.innerHTML = "";
  };

  const updateComplete = () => new Promise((r) => requestAnimationFrame(r));

  const getTestStartName = (name: string) => `${name}-start`;

  // Initial Render
  const render = async () => {
    const test = "render";
    if (benchmark === test || !benchmark) {
      const start = getTestStartName(test);
      performance.mark(start);
      create();
      await updateComplete();
      performance.measure(test, start);
      destroy();
    }
  };
  await render();

  // Log
  performance
    .getEntriesByType("measure")
    .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
})();
