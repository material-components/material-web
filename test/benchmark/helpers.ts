import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult, render } from 'lit-html';

declare global {
  interface Window {
    tachometerResult: undefined|number;
  }
}

@customElement('test-fixture')
export class TestFixture extends LitElement {
  @property({ type: Boolean })
  shouldAttachContents = true;

  @property({ type: Object })
  template: TemplateResult = html``;

  remove(): boolean {
    const parent = this.parentNode;
    if (parent) {
      parent.removeChild(this);
      return true;
    }

    return false;
  }

  get root(): ShadowRoot {
    return this.shadowRoot!;
  }

  attachContents(options = {awaitRender: false}) {
    this.shouldAttachContents = true;

    if (options.awaitRender) {
      const rendered = new Promise(res => {
        requestAnimationFrame(res);
      });

      return rendered;
    } else {
      return this.updateComplete;
    }
  }

  detachContents(options = {awaitRender: false}) {
    this.shouldAttachContents = false;

    if (options.awaitRender) {
      const rendered = new Promise(res => {
        requestAnimationFrame(res);
      });

      return rendered;
    } else {
      return this.updateComplete;
    }
  }

  render() {
    return html`
      ${this.shouldAttachContents ? this.template : ''}
    `;
  }
}

const defaultOpts = {
  shouldAttachContents: true,
  document: document
};

interface FixtureOptions {
  shouldAttachContents: boolean;
  document: Document;
}

export const fixture = (
  template: TemplateResult,
  options?: Partial<FixtureOptions>
) => {
  const opts: FixtureOptions = { ...defaultOpts, ...options };
  const tf = opts.document.createElement('test-fixture') as TestFixture;
  tf.shouldAttachContents = opts.shouldAttachContents;
  tf.template = template;

  opts.document.body.appendChild(tf);

  return tf;
};

export const measureFixtureCreation = async (
    template: TemplateResult,
    afterRender?: (fixture: ShadowRoot) => Promise<unknown>,
    numRenders = 100) => {
  const templates = new Array<TemplateResult>(numRenders).fill(template);
  const renderContainer = document.createElement('div');
  const renderTargetRoot = renderContainer.attachShadow({mode: 'open'});

  document.body.appendChild(renderContainer);
  const start = performance.now();
  render(templates, renderTargetRoot);
  const firstChild = renderTargetRoot.firstElementChild;

  if (firstChild && 'updateComplete' in firstChild) {
    await (firstChild as LitElement).updateComplete;
    document.body.offsetWidth;
  } else {
    await new Promise(res => requestAnimationFrame(() => res));
  }

  if (afterRender) {
    afterRender(renderTargetRoot);
  }

  const end = performance.now();
  window.tachometerResult = end - start;
  return window.tachometerResult;
}