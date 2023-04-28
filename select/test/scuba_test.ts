/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../../icon/icon.js';
import '../filled-select.js';
import '../outlined-select.js';
import '../select-option.js';

import {html, nothing} from 'lit';
import {literal} from 'lit/static-html.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TestTableTemplate} from '../../testing/table/test-table.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {SelectHarness} from '../harness.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/select/test/scuba_goldens';

function createOptions(preselected = false) {
  return html`
        <md-select-option value="apple" headline="Apple"></md-select-option>
        <md-select-option value="apricot" headline="Apricot"></md-select-option>
        <md-select-option value="banana" headline="Banana" ?selected=${
      preselected}></md-select-option>
        <md-select-option value="olive" headline="Olive"></md-select-option>
        <md-select-option value="orange" headline="Orange"></md-select-option>
      `;
}

// TODO(b/227808635): refactor to conform to testing best practices
describe('<md-select>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  describe('default', () => {
    const LEADING_ICON = html`<md-icon slot="leadingicon">search</md-icon>`;
    const TRAILING_ICON = html`<md-icon slot="trailingicon">event</md-icon>`;

    const templates =
        new TemplateBuilder().withHarness(SelectHarness).withVariants({
          'filled': {
            display: 'Filled',
            render: (directive, props, state) => html`
              <md-filled-select
                class="select"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? ''}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions()}
              </md-filled-select>
            `
          },
          'filledSelect': {
            display: literal`Filled<br>(selected)`,
            render: (directive, props, state) => html`
              <md-filled-select
                class="select"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions(true)}
              </md-filled-select>
            `
          },
          'outlined': {
            display: 'Outlined',
            render: (directive, props, state) => html`
              <md-outlined-select
                class="select"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions()}
              </md-outlined-select>
            `
          },
          'outlinedSelect': {
            display: literal`Outlined<br>(selected)`,
            render: (directive, props, state) => html`
              <md-outlined-select
                class="select"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions(true)}
              </md-outlined-select>
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
        <md-test-table
          class=${classes ?? ''}
          title=${title}
          .states=${states}
          .templates=${templates}
        ></md-test-table>
      `);

      expect(await env.diffRootWithRtl(goldenName)).toHaveAllPassed();

      if (!env.isHighContrastMode) {
        env.render(html`
          <md-test-table
            dark
            class="dark ${classes ?? ''}"
            title=${title}
            .states=${states}
            .templates=${templates}
          ></md-test-table>
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

    it('end_aligned', async () => {
      await testScreenshot({
        title: 'End-aligned',
        goldenName: 'end_aligned',
        templates: templates.all({label: 'End-aligned'}),
        classes: 'end-aligned',
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

    it('supporting_text', async () => {
      await testScreenshot({
        title: 'Supporting text',
        goldenName: 'supporting_text',
        templates: templates.all({
          label: 'Label',
          supportingText: 'Supporting text',
          errorText: 'Should not be visible',
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
        }),
      });
    });
  });

  describe('clicked', () => {
    class OpenSelectHarness extends SelectHarness {
      override async getInteractiveElement() {
        const el = await super.getInteractiveElement();
        const menu = this.element.renderRoot.querySelector('md-menu')!;
        menu.stayOpenOnOutsideClick = true;
        menu.addEventListener('focusout', e => {
          // stop select from closing menu on focusout by preventing the
          // listener from activating.
          e.stopPropagation();
        });
        await this.click();
        return el;
      }
    }

    const templates =
        new TemplateBuilder().withHarness(OpenSelectHarness).withVariants({
          'filled': {
            display: 'Filled',
            render: (directive, props, state) => html`
              <md-filled-select
                class="select opened"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions()}
              </md-filled-select>
            `
          },
          'filledSelect': {
            display: literal`Filled<br>(selected)`,
            render: (directive, props, state) => html`
              <md-filled-select
                class="select opened"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions(true)}
              </md-filled-select>
            `
          },
          'outlined': {
            display: 'Outlined',
            render: (directive, props, state) => html`
              <md-outlined-select
                class="select opened"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions()}
              </md-outlined-select>
            `
          },
          'outlinedSelect': {
            display: literal`Outlined<br>(selected)`,
            render: (directive, props, state) => html`
              <md-outlined-select
                class="select opened"
                .label=${props.label ?? nothing}
                ?disabled=${state === State.DISABLED}
                .error=${props.error ?? false}
                .errorText=${props.errorText ?? nothing}
                .required=${props.required ?? false}
                .supportingText=${props.supportingText ?? ''}
                ${directive}
              >
                ${props.content}
                ${createOptions(true)}
              </md-outlined-select>
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
      const states = [State.DEFAULT];

      env.render(html`
        <md-test-table
          class=${classes ?? ''}
          title=${title}
          .states=${states}
          .templates=${templates}
        ></md-test-table>
      `);

      expect(await env.diffRootWithRtl(`opened_${goldenName}`))
          .toHaveAllPassed();

      if (!env.isHighContrastMode) {
        env.render(html`
          <md-test-table
            dark
            class="dark ${classes ?? ''}"
            title=${title}
            .states=${states}
            .templates=${templates}
          ></md-test-table>
        `);

        expect(await env.diffRoot(`${goldenName}+dark`)).toHavePassed();
      }
    }

    it('default', async () => {
      await testScreenshot({
        title: 'Default',
        goldenName: 'opened_default',
        templates: templates.all({label: 'G Label'})
      });
    });

    it('supporting_text_anchor', async () => {
      await testScreenshot({
        title: 'Supporting text',
        goldenName: 'opened_supporting_text_anchor',
        templates: templates.all({
          label: 'Label',
          supportingText: 'Supporting text',
          errorText: 'Should not be visible',
        }),
      });
    });
  });
});
