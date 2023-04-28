/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';

import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {IconButtonHarness} from '../harness.js';

/** Creates test cases for icon button. */
export function createIconButtonTestCases(
    env: ScubaEnvironment,
    templates: TemplateBuilder<IconButtonHarness, string>,
    {testName, table}: {testName: string, table?: ReturnType<typeof literal>}) {
  table = table ?? literal`md-test-table`;
  const testTemplates = templates.all();

  it(testName, async () => {
    env.render(html`
      <${table}
        title="States"
        .states=${[State.DEFAULT, State.HOVER, State.FOCUS, State.DISABLED]}
        .templates=${testTemplates}
      ></{$table}>`);
    expect(await env.diffRootWithRtl(testName)).toHaveAllPassed();

    if (!env.isHighContrastMode) {
      env.render(html`
        <${table}
          dark
          class="dark"
          title="States"
          .states=${[State.DEFAULT, State.HOVER, State.FOCUS, State.DISABLED]}
          .templates=${testTemplates}
        ></${table}>`);
      expect(await env.diffRoot(`${testName}_dark`)).toHavePassed();
    }
  });
}
