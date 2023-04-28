/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../slider.js';

import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {SliderHarness} from '../harness.js';

/** Creates slider test cases based on provided templates. */
export function createSliderTestCases(
    env: ScubaEnvironment, templates: TemplateBuilder<SliderHarness, string>,
    {table}: {table?: ReturnType<typeof literal>} = {
      table: literal`md-test-table`
    }) {
  it('default', async () => {
    renderTest('Default');

    expect(await env.diffRoot('default')).toHavePassed();
  });

  it('default_dark', async () => {
    renderDarkTest('Default Dark');

    expect(await env.diffRoot('default_dark')).toHavePassed();
  });

  it('ranged', async () => {
    renderTest('Ranged', {value: [2, 3]});

    expect(await env.diffRootWithRtl('ranged')).toHaveAllPassed();
  });

  it('ranged_dark', async () => {
    renderDarkTest('Ranged Dark', {value: [2, 3]});

    expect(await env.diffRoot('ranged_dark')).toHavePassed();
  });

  it('with_tickmarks', async () => {
    renderTest('Tickmarks', {withTickMarks: true});

    expect(await env.diffRootWithRtl('with_tickmarks')).toHaveAllPassed();
  });

  it('with_tickmarks_dark', async () => {
    renderDarkTest('Tickmarks Dark', {withTickMarks: true});

    expect(await env.diffRoot('with_tickmarks_dark')).toHavePassed();
  });

  it('with_label', async () => {
    renderTest('Label', {withLabel: true});

    expect(await env.diffRootWithRtl('with_label')).toHaveAllPassed();
  });

  it('with_label_dark', async () => {
    renderDarkTest('Label Dark', {withLabel: true});

    expect(await env.diffRoot('with_label_dark')).toHavePassed();
  });

  it('ranged_with_label_tickmarks', async () => {
    renderTest(
        'Ranged:Label:Tickmarks',
        {withLabel: true, withTickMarks: true, value: [2, 3]});

    expect(await env.diffRootWithRtl('ranged_with_label_tickmarks'))
        .toHaveAllPassed();
  });

  it('ranged_with_label_tickmarks_dark', async () => {
    renderDarkTest(
        'Ranged:Label:Tickmarks Dark',
        {withLabel: true, withTickMarks: true, value: [2, 3]});

    expect(await env.diffRoot('ranged_with_label_tickmarks_dark'))
        .toHavePassed();
  });

  function renderTest(title: string, props: TemplateProps<SliderHarness> = {}) {
    const testTemplates = templates.all(props);
    return env.render(html`
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
      title: string, props: TemplateProps<SliderHarness> = {}) {
    const testTemplates = templates.all(props);
    return env.render(html`
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
