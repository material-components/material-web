/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../dialog.js';
import '../../icon/icon.js';
import '../../button/text-button.js';
import '../../button/tonal-button.js';
import '../../iconbutton/standard-icon-button.js';

import {css, LitElement, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {StyleInfo} from 'lit/directives/style-map.js';
import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {DialogHarness} from '../harness.js';

/**
 * Dialog properties, including properties for slot content
 */
export type DialogExtendedProperties = TemplateProps<DialogHarness>&{
  header?: TemplateResult|string|null|undefined;
  headlinePrefix?: TemplateResult|string|null|undefined;
  headline?: TemplateResult|string|null|undefined;
  headlineSuffix?: TemplateResult|string|null|undefined;
  content?: TemplateResult|string|null|undefined;
  footer?: TemplateResult|string|null|undefined;
  styleInfo?: StyleInfo;
};

/**
 * Test element that shows a focus state visually.
 */
@customElement('visual-focus')
export class VisualFocus extends LitElement {
  static override styles = css`
  :host {
    display: block;
    height: 48px;
    background: lightgray;
    border-radius: 4px;
  }

  :host(:focus) {
    outline: 4px solid black;
    outline-offset: -6px;
  }`;
}

/** Creates dialog test cases based on provided templates. */
export function createDialogTestCases(
    env: ScubaEnvironment, templates: TemplateBuilder<DialogHarness, string>,
    {table}: {table?: ReturnType<typeof literal>} = {
      table: literal`md-test-table`
    }) {
  // close dialogs after test to avoid flakiness.
  afterEach(() => {
    const roots = document.querySelectorAll('#root');
    for (const root of roots) {
      root.querySelector('md-dialog')?.close();
    }
  });

  it('rendered open', async () => {
    renderTest('open', {open: true});
    await env.waitForStability();
    expect(await env.diffPage('open')).toHavePassed();
  });

  it('show', async () => {
    const root = renderTest('show');
    await env.waitForStability();
    const dialog = root.querySelector('md-dialog')!;
    dialog.show();
    await env.waitForStability();
    expect(await env.diffPage('show')).toHavePassed();
  });

  it('show-modeless', async () => {
    const root = renderTest('show-modeless', {modeless: true});
    await env.waitForStability();
    const dialog = root.querySelector('md-dialog')!;
    dialog.show();
    await env.waitForStability();
    expect(await env.diffPage('show-modeless')).toHavePassed();
  });

  it('size-and-position', async () => {
    renderTest('size-and-position', {
      open: true,
      styleInfo: {
        '--md-dialog-container-min-inline-size': '300px',
        '--md-dialog-container-min-block-size': '300px',
        '--md-dialog-container-inset-inline-end': '0',
        '--md-dialog-container-inset-block-start': '0',
      },
    });
    await env.waitForStability();
    expect(await env.diffPage('size-and-position')).toHavePassed();
  });

  it('basic', async () => {
    renderTest('basic', {
      open: true,
      header: html`<div slot="header">Dialog</div>`,
      content: html`<div>Content</div>`,
      footer: html`
          <md-text-button slot="footer" dialogAction="cancel">Cancel</md-text-button>
          <md-tonal-button slot="footer" dialogAction="ok">OK</md-tonal-button>
          `,
    });
    await env.waitForStability();
    expect(await env.diffPage('basic')).toHavePassed();
  });

  it('stacked', async () => {
    renderTest('stacked', {
      open: true,
      stacked: true,
      header: html`<div slot="header">Dialog</div>`,
      content: html`<div>Content</div>`,
      footer: html`
          <md-text-button slot="footer"
          dialogAction="cancel">Cancel</md-text-button> <md-tonal-button
          slot="footer" dialogAction="ok">OK</md-tonal-button>
          `,
    });
    await env.waitForStability();
    expect(await env.diffPage('stacked')).toHavePassed();
  });

  it('footerHidden', async () => {
    renderTest('footerHidden', {
      open: true,
      footerHidden: true,
      header: html`<div slot="header">Dialog</div>`,
      content: html`<div>Content</div>`,
      footer: html`
          <md-text-button slot="footer"
          dialogAction="cancel">Cancel</md-text-button> <md-tonal-button
          slot="footer" dialogAction="ok">OK</md-tonal-button>
          `,
    });
    await env.waitForStability();
    expect(await env.diffPage('footerHidden')).toHavePassed();
  });

  it('headline', async () => {
    renderTest('headline', {
      open: true,
      headlinePrefix: html`<md-icon slot="headline-prefix">polymer</md-icon>`,
      headline: html`<div slot="headline">Dialog</div>`,
      content: html`<div>Content</div>`
    });
    await env.waitForStability();
    expect(await env.diffPage('headline')).toHavePassed();
  });

  it('scrolling', async () => {
    renderTest('scrolling', {
      open: true,
      styleInfo: {
        '--md-dialog-container-max-block-size': '300px',
      },
      header: html`<div slot="header">Dialog</div>`,
      content: html`<div style="background: linear-gradient(to bottom, darkgray,
          white); height: 500px;"></div>`,
      footer: html`
          <md-text-button slot="footer"
          dialogAction="cancel">Cancel</md-text-button> <md-tonal-button
          slot="footer" dialogAction="ok">OK</md-tonal-button>
          `,
    });
    await env.waitForStability();
    expect(await env.diffPage('scrolling')).toHavePassed();
  });

  it('focus', async () => {
    renderTest('focus', {
      open: true,
      header: html`<div slot="header">Dialog</div>`,
      content: html`<div>
        <p>Hello!</p>
        <visual-focus tabIndex="0" dialogFocus></visual-focus>
      </div>`,
      footer: html`
          <md-text-button slot="footer"
          dialogAction="cancel">Cancel</md-text-button> <md-tonal-button
          slot="footer" dialogAction="ok">OK</md-tonal-button>
          `,
    });
    await env.waitForStability();
    expect(await env.diffPage('focus')).toHavePassed();
  });

  it('fullscreen', async () => {
    renderTest('fullscreen', {
      open: true,
      fullscreen: true,
      fullscreenBreakpoint: '(min-width: 400px)',
      headline: html`<div slot="headline">Dialog</div>`,
      headlineSuffix: html`<md-standard-icon-button slot="headline-suffix"
          dialogAction="close">close</md-standard-icon-button>`,
      content: html`<div>Content</div>`,
    });
    await env.waitForStability();
    expect(await env.diffPage('fullscreen')).toHavePassed();
  });

  function renderTest(title: string, props: DialogExtendedProperties = {}) {
    const testTemplates = templates.all(props);
    return env.render(html`${testTemplates.map(({render}) => render(title))}`);
  }
}
