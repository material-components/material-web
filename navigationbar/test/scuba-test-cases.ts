/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';

import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {NavigationBarHarness} from '../harness.js';

/** Creates navigation bar test cases based on provided templates. */
export function createNavigationBarTestCases(
    env: ScubaEnvironment,
    templates: TemplateBuilder<NavigationBarHarness, string>,
    {table}: {table?: ReturnType<typeof literal>} = {
      table: literal`md-test-table`
    }) {
  it('default', async () => {
    renderTest('States');

    expect(await env.diffRootWithRtl('default')).toHaveAllPassed();
  });

  it('default dark', async () => {
    renderDarkTest('States');

    expect(await env.diffRoot('default_dark')).toHavePassed();
  });

  function renderTest(
      title: string, props: TemplateProps<NavigationBarHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <${table}
        title=${title}
        .states=${[State.DEFAULT, State.HOVER, State.FOCUS]}
        .templates=${testTemplates}
      ></${table}>
    `);
  }

  function renderDarkTest(
      title: string, props: TemplateProps<NavigationBarHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <${table}
        dark
        class="dark"
        title=${title}
        .states=${[State.DEFAULT, State.HOVER, State.FOCUS]}
        .templates=${testTemplates}
      ></${table}>
    `);
  }
}
