/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../radio.js';

import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {RadioHarness} from '../harness.js';

/** Creates radio test cases based on provided templates. */
export function createRadioTestCases(
    env: ScubaEnvironment, templates: TemplateBuilder<RadioHarness, string>,
    {table}: {table?: ReturnType<typeof literal>} = {
      table: literal`md-test-table`
    }) {
  it('unselected', async () => {
    renderTest('Unselected');

    expect(await env.diffRoot('unselected')).toHavePassed();
  });

  it('unselected_dark', async () => {
    renderDarkTest('Unselected Dark');

    expect(await env.diffRoot('unselected_dark')).toHavePassed();
  });

  it('selected', async () => {
    renderTest('Selected', {checked: true});

    expect(await env.diffRootWithRtl('selected')).toHaveAllPassed();
  });

  it('selected_dark', async () => {
    renderDarkTest('Selected Dark', {checked: true});

    expect(await env.diffRoot('selected_dark')).toHavePassed();
  });

  function renderTest(title: string, props: TemplateProps<RadioHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <${table}
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${testTemplates}
      ></${table}>
    `);
  }

  function renderDarkTest(
      title: string, props: TemplateProps<RadioHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <${table}
        dark
        class="dark"
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${testTemplates}
      ></${table}>
    `);
  }
}
