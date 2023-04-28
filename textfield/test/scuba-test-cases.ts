/** @license Googler-authored internal-only code. */

import {html, literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TestTableTemplate} from '../../testing/table/test-table.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {TextFieldHarness} from '../harness.js';

export interface TextFieldTestOptions {
  env: ScubaEnvironment;
  filled: ReturnType<typeof literal>;
  outlined: ReturnType<typeof literal>;
  icon: ReturnType<typeof literal>;
  table: ReturnType<typeof literal>;
}

export function createTextFieldTests(
    {env, filled, outlined, icon, table}: TextFieldTestOptions) {
  const LEADING_ICON = html`<${icon} slot="leadingicon">search</${icon}>`;
  const TRAILING_ICON = html`<${icon} slot="trailingicon">event</${icon}>`;

  const templates =
      new TemplateBuilder().withHarness(TextFieldHarness).withVariants({
        'filled': {
          display: 'Filled',
          render: (directive, props, state) => html`
            <${filled}
              class="text-field"
              .label=${props.label}
              ?disabled=${state === State.DISABLED}
              .error=${props.error ?? false}
              .errorText=${props.errorText ?? false}
              .maxLength=${props.maxLength ?? -1}
              .placeholder=${props.placeholder ?? ''}
              .required=${props.required ?? false}
              .prefixText=${props.prefixText ?? ''}
              .suffixText=${props.suffixText ?? ''}
              .supportingText=${props.supportingText ?? ''}
              .textDirection=${props.textDirection ?? ''}
              ${directive}
            >
              ${props.content}
            </${filled}>
          `
        },
        'filledInput': {
          display: literal`Filled<br>(Input)`,
          render: (directive, props, state) => html`
            <${filled}
              class="text-field"
              .label=${props.label}
              ?disabled=${state === State.DISABLED}
              .error=${props.error ?? false}
              .errorText=${props.errorText ?? false}
              .maxLength=${props.maxLength ?? -1}
              .placeholder=${props.placeholder ?? ''}
              .required=${props.required ?? false}
              .prefixText=${props.prefixText ?? ''}
              .suffixText=${props.suffixText ?? ''}
              .supportingText=${props.supportingText ?? ''}
              .textDirection=${props.textDirection ?? ''}
              defaultValue="Input text"
              ${directive}
            >
              ${props.content}
            </${filled}>
          `
        },
        'outlined': {
          display: 'Outlined',
          render: (directive, props, state) => html`
            <${outlined}
              class="text-field"
              .label=${props.label}
              ?disabled=${state === State.DISABLED}
              .error=${props.error ?? false}
              .errorText=${props.errorText ?? false}
              .maxLength=${props.maxLength ?? -1}
              .placeholder=${props.placeholder ?? ''}
              .required=${props.required ?? false}
              .prefixText=${props.prefixText ?? ''}
              .suffixText=${props.suffixText ?? ''}
              .supportingText=${props.supportingText ?? ''}
              .textDirection=${props.textDirection ?? ''}
              ${directive}
            >
              ${props.content}
            </${outlined}>
          `
        },
        'outlinedInput': {
          display: literal`Outlined<br>(Input)`,
          render: (directive, props, state) => html`
            <${outlined}
              class="text-field"
              .label=${props.label}
              ?disabled=${state === State.DISABLED}
              .error=${props.error ?? false}
              .errorText=${props.errorText ?? false}
              .maxLength=${props.maxLength ?? -1}
              .placeholder=${props.placeholder ?? ''}
              .required=${props.required ?? false}
              .prefixText=${props.prefixText ?? ''}
              .suffixText=${props.suffixText ?? ''}
              .supportingText=${props.supportingText ?? ''}
              .textDirection=${props.textDirection ?? ''}
              defaultValue="Input text"
              ${directive}
            >
              ${props.content}
            </${outlined}>
          `
        },
      });

  interface TestScreenshotOptions {
    title: string;
    goldenName: string;
    templates: TestTableTemplate[];
    classes?: string;
  }

  async function testScreenshot(
      {title, goldenName, templates, classes}: TestScreenshotOptions) {
    const states = [State.DEFAULT, State.FOCUS, State.HOVER, State.DISABLED];

    env.render(html`
      <${table}
        class=${classes ?? ''}
        title=${title}
        .states=${states}
        .templates=${templates}
      ></${table}>
    `);

    expect(await env.diffRootWithRtl(goldenName)).toHaveAllPassed();

    if (!env.isHighContrastMode) {
      env.render(html`
        <${table}
          dark
          class="dark ${classes ?? ''}"
          title=${title}
          .states=${states}
          .templates=${templates}
        ></${table}>
      `);

      expect(await env.diffRoot(`${goldenName}+dark`)).toHavePassed();
    }
  }

  it('default', async () => {
    await testScreenshot({
      title: 'Default',
      goldenName: 'default',
      templates: templates.all({label: 'G Label'})
    });
  });

  it('no_label', async () => {
    await testScreenshot({
      title: 'No label',
      goldenName: 'no_label',
      templates: templates.all()
    });
  });

  it('error', async () => {
    await testScreenshot({
      title: 'Error',
      goldenName: 'error',
      templates: templates.all({error: true, label: 'Error'})
    });
  });

  it('prefix_suffix', async () => {
    await testScreenshot({
      title: 'Prefix and suffix',
      goldenName: 'prefix_suffix',
      templates:
          templates.all({prefixText: '$', suffixText: '.00', label: 'Label'})
    });
  });

  it('end_aligned', async () => {
    await testScreenshot({
      title: 'End-aligned',
      goldenName: 'end_aligned',
      templates: templates.all({label: 'End-aligned'}),
      classes: 'end-aligned',
    });
  });

  it('placeholder', async () => {
    const testTemplates = [
      templates.variant('filled', {placeholder: 'Placeholder', label: 'Label'}),
      templates.variant('filled', {placeholder: 'Placeholder'}),
      templates.variant(
          'outlined', {placeholder: 'Placeholder', label: 'Label'}),
      templates.variant('outlined', {placeholder: 'Placeholder'}),
    ];

    await testScreenshot({
      title: 'Placeholder',
      goldenName: 'placeholder',
      templates: testTemplates,
    });
  });

  it('icons', async () => {
    await testScreenshot({
      title: 'Icons',
      goldenName: 'icons',
      templates: templates.all({
        label: 'Icons',
        content: html`
          ${LEADING_ICON}
          ${TRAILING_ICON}
        `
      })
    });
  });

  it('icons_error', async () => {
    await testScreenshot({
      title: 'Icons (error)',
      goldenName: 'icons_error',
      templates: templates.all({
        error: true,
        label: 'Icons (error)',
        content: html`
          ${LEADING_ICON}
          ${TRAILING_ICON}
        `
      })
    });
  });

  it('icons_shape', async () => {
    await testScreenshot({
      title: 'Icons (shape)',
      goldenName: 'icons_shape',
      classes: 'shape',
      templates: templates.all({
        label: 'Icons (shape)',
        content: html`
          ${LEADING_ICON}
          ${TRAILING_ICON}
        `
      })
    });
  });

  it('shape', async () => {
    await testScreenshot({
      title: 'Shape',
      goldenName: 'shape',
      classes: 'shape',
      templates: templates.all({label: 'Shape'})
    });
  });

  it('supporting_text', async () => {
    await testScreenshot({
      title: 'Supporting text',
      goldenName: 'supporting_text',
      templates: templates.all({
        label: 'Label',
        supportingText: 'Supporting text',
        errorText: 'Should not be visible',
        maxLength: 42,
      }),
    });
  });

  it('supporting_text_error', async () => {
    await testScreenshot({
      title: 'Supporting text (error)',
      goldenName: 'supporting_text_error',
      templates: templates.all({
        label: 'Label',
        error: true,
        supportingText: 'Supporting text (error)',
        maxLength: 42,
      }),
    });
  });

  it('supporting_text_error_message', async () => {
    await testScreenshot({
      title: 'Supporting text (error message)',
      goldenName: 'supporting_text_error_message',
      templates: templates.all({
        label: 'Label',
        error: true,
        supportingText: 'Should not be visible',
        errorText: 'Error text',
        maxLength: 42,
      }),
    });
  });

  it('text_direction', async () => {
    await testScreenshot({
      title: 'Text direction',
      goldenName: 'text_direction',
      templates: templates.all({label: 'Input text LTR', textDirection: 'ltr'}),
    });
  });
}
