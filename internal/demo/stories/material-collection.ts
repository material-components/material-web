/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-formfield.js';
import '@material/web/internal/demo/stories/md-theme.js';

import {GOOGLE_SANS_FONT_URL, loadCssUrl, MATERIAL_ICONS_URL, MATERIAL_SYMBOLS_URL, ROBOTO_FONT_URL} from '@material/web/internal/demo/resources.js';
import {boolInput, colorPicker, Knob, KnobUi, KnobValues, LitCollection, LitStoryInit, PolymorphicArrayOfKnobs, StoryInit} from 'google3/javascript/lit/stories.js';
import {css, CSSResult, html, TemplateResult} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

/**
 * A simple textarea knob
 */
export function textarea(): KnobUi<string> {
  return {
    render(knob: Knob<string>, onChange: (val: string) => void) {
      const valueChanged = (e: Event) => {
        const rawVal = (e.target as HTMLTextAreaElement).value;

        onChange(rawVal as unknown as string);
      };
      return html`
      <div>
        <mwc-formfield label="${knob.name}">
          <textarea
            .value="${(knob.latestValue ?? '')}"
            @input="${valueChanged}"></textarea>
        </mwc-formfield>
      </div>
    `;
    },
    deserialize(value) {
      return value as unknown as string;
    },
    serialize(value) {
      return String(value);
    }
  };
}

/**
 * Knobs built into material-collection by default.
 */
const defaultBuiltInKnobs: MaterialKnobs = {
  /**
   * Knob that sets the theme color on the stories.
   */
  themeKnob: new Knob('theme color', {
    ui: colorPicker(),
    defaultValue: '#6750a4',
    wiring: (knob) => {
      const value =
          knob.latestValue === undefined ? knob.defaultValue : knob.latestValue;
      const themeEl = document.querySelector('md-theme') as HTMLElement &
          {color: string | undefined};
      if (!themeEl) return;
      themeEl.color = value;
    }
  }),
  /**
   * Knob that toggles dark mode
   */
  darkModeKnob: new Knob('dark mode', {
    ui: boolInput(),
    defaultValue: false,
    wiring: (knob) => {
      const value =
          knob.latestValue === undefined ? knob.defaultValue : knob.latestValue;
      const themeEl =
          document.querySelector('md-theme') as HTMLElement & {dark: boolean};
      if (!themeEl) return;
      themeEl.dark = value ?? false;
    }
  }),
  /**
   * Knob that sets inline styles to override the theme. These are applied to
   * inline styles.
   */
  overrideThemeKnob:
      new Knob('override theme', {ui: textarea(), defaultValue: ''}),
  /**
   * Knob that toggles RTL
   */
  rtlKnob: new Knob('[dir=rtl]', {ui: boolInput(), defaultValue: false}),
};

/**
 * Material-specific knobs for MaterialCollection
 */
export interface MaterialKnobs {
  themeKnob: Knob<string, 'theme color'>|null;
  darkModeKnob: Knob<boolean, 'dark mode'>|null;
  overrideThemeKnob: Knob<string, 'override theme'>|null;
  rtlKnob: Knob<boolean, '[dir=rtl]'>|null;
}

/**
 * Converts a string of CSS styles into a Lit styleMap.
 * @example
 * ```ts
 * stringToStyleMap('--md-sys-color-primary: red;\npadding: 24px;');
 * ```
 *
 * @param styleString A stringified set of CSSStyles.
 * @return An object compatible with a Lit styleMap.
 */
function stringToStyleMap(styleString: string) {
  // get each rule
  const rules = styleString.split(';');
  const styles: {[key: string]: string} = {};

  for (const rule of rules) {
    // remove any newlines
    const withoutNewlines = rule.replace(/[\n\r]/g, '');
    // split rule between property and value
    const splitRule = withoutNewlines.split(':');

    // If there was no split, skip.
    if (splitRule.length !== 2) continue;
    styles[splitRule[0].trim()] = splitRule[1].trim();
  }

  return styles;
}

/**
 * A LitStories collection specifically for Material Demos. It allows for
 * automatic lib monet theming and controls for overriding those themes.
 */
export class MaterialCollection<
    T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>> extends
    LitCollection<T> {
  /**
   * @param name The name of the collection
   * @param knobs The knobs for this collection
   * @param materialKnobs
   *    The default material knobs. Each knob can be nullified to omit them.
   *    Default: {
   *      themeKnob: Knob<string, 'theme color'>,
   *      darkModeKnob: Knob<boolean, 'dark mode'>,
   *      overrideThemeKnob: Knob<string, 'override theme'>,
   *      rtlKnob: Knob<boolean, '[dir=rtl]'>,
   *    }
   */
  constructor(
      override readonly name: string,
      knobs: T = [] as unknown as T,
      materialKnobs?: Partial<MaterialKnobs>,
  ) {
    materialKnobs = {...defaultBuiltInKnobs, ...materialKnobs};
    const newKnobs: unknown[] = [];

    if (materialKnobs.themeKnob) {
      newKnobs.push(materialKnobs.themeKnob);
    }
    if (materialKnobs.darkModeKnob) {
      newKnobs.push(materialKnobs.darkModeKnob);
    }
    if (materialKnobs.rtlKnob) {
      newKnobs.push(materialKnobs.rtlKnob);
    }
    if (materialKnobs.overrideThemeKnob) {
      newKnobs.push(materialKnobs.overrideThemeKnob);
    }

    super(name, newKnobs.concat(knobs) as unknown as T);
  }

  override addStories(
      ...inits: Array<StoryInit<KnobValues<T>>|LitStoryInit<KnobValues<T>>>) {
    for (const init of inits) {
      // Expect a LitStoryInit
      if (!('renderLit' in init)) continue;

      const oldRender = init.renderLit;

      // Inject the background colors and the override-theme knobs
      init.renderLit = (knobs) => {
        const styleRaw = knobs.get('override theme') as string ?? '';
        const styles = stringToStyleMap(styleRaw);
        return html`
          <section
              class="md-stories-bg-override"
              style="${styleMap(styles)}"
              dir=${
            // TODO(https://bugs.webkit.org/show_bug.cgi?id=255568):
            // using `auto` to workaround Safari bug
            knobs.get('[dir=rtl]') ? 'rtl' : 'auto'}
            >
            ${oldRender(knobs)}
          </section>
        `;
      };


      const oldLitStyles = [init.litStyles ?? []].flat(1);
      // Inject the background color custom prop into the styles. User can
      // override these styles with their own CSSResult style that selects for
      // `.md-stories-bg-override { background-color: ...; }`
      init.litStyles = [
        css`
        .md-stories-bg-override {
          background-color: var(--md-sys-color-background);
        }
      `,
        ...oldLitStyles
      ];
    }
    super.addStories(...inits);
  }
}

/**
 * Material styling for labels.
 */
export const labelStyles = css`label {
  display: inline-flex;
  place-items: center;
  gap: 8px;
  font-family: Roboto, system-ui;
  color: var(--md-sys-color-on-background, #000);
}`;

/**
 * A subtitble knob for labelling sections in the knob UI.
 */
export function title(): KnobUi<void> {
  return {
    render(knob) {
      return html`
      <h3 style="font-family: sans-serif;">${knob.name}</h3>
    `;
    },
    deserialize() {},
    serialize() {
      return '';
    }
  };
}

/**
 * Converts an interface of {[knobName: string]: unknown} to something
 * ingestable by MaterialCollection.
 *
 * @example
 * ```ts
 * // demo.ts
 * import {StoryKnobs} from './stories.js';
 * import {MaterialCollection, KnobTypesToKnobs} from
 * 'google3/third_party/javascript/material/web/internal/demo/stories/material-collection';
 *
 * const stories = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(...);
 * ```
 */
export type KnobTypesToKnobs<
    // tslint:disable-next-line:no-any No way to represent this type clearly.
    T extends {[name: string]: any},
              Names extends Extract<keyof T, string> = Extract<keyof T, string>,
    // tslint:disable-next-line:no-any We need to "map" the union type to knobs.
    > = ReadonlyArray<Names extends any ? Knob<T[Names], Names>: never>;

/**
 * An init object for Material Stories. This should be exposed to the user.
 *
 * @example
 * ```ts
 * import {MaterialStoryInit} from
 * 'google3/third_party/javascript/material/web/internal/demo/stories/material-collection';
 * // stories.ts
 * export interface StoryKnobs {
 *   checked: boolean;
 *   disabled: boolean;
 * }
 *
 * export const stories: Array<MaterialStoryInit<StoryKnobs>> = [
 *   {
 *     name: Checkbox,
 *     styles: css`...`,
 *     render: ({checked, disabled}) => {
 *       return html`...`;
 *     }
 *   }
 * ]
 * ```
 */
// tslint:disable-next-line:no-any No way to represent this type clearly.
export interface MaterialStoryInit<T extends {[name: string]: any}> {
  name: string;
  render: (knobs: T) => TemplateResult | Promise<TemplateResult>;
  styles?: CSSResult|CSSResult[];
}

/**
 * Converts an array of `MaterialStoryInit`s to a `LitStoryInit`.
 */
// tslint:disable-next-line:no-any No way to represent this type clearly.
export function materialInitsToStoryInits<T extends {[name: string]: any}>(
    inits: Array<MaterialStoryInit<T>>):
    Array<LitStoryInit<KnobValues<KnobTypesToKnobs<T>>>> {
  return inits.map((init) => {
    return {
      name: init.name,
      litStyles: init.styles,
      renderLit(knobMap) {
        const knobKeys = knobMap.names();
        const knobs: T = {} as unknown as T;
        for (const key of knobKeys) {
          knobs[key] = knobMap.get(key)! as (typeof knobs)[typeof key];
        }
        return init.render(knobs);
      },
    };
  });
}

const defaultSetupDemoOptions = {
  fonts: 'roboto' as 'roboto' | 'google-sans',
  icons: 'material-symbols' as 'material-symbols' | 'material-icons',
};

/** The resource loader options that can be passed to setUpDemo. */
export type SetupDemoOptions = typeof defaultSetupDemoOptions;

/**
 * Initializes the theme element for the theming knobs and renders the stories.
 */
export function
setUpDemo<T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>>(
    collection: LitCollection<T>,
    options: Partial<SetupDemoOptions> = defaultSetupDemoOptions,
    ): void {
  const opts = {...defaultSetupDemoOptions, ...options};

  switch (opts.fonts) {
    case 'roboto':
      loadCssUrl(ROBOTO_FONT_URL);
      break;
    case 'google-sans':
      loadCssUrl(GOOGLE_SANS_FONT_URL);
      break;
    default:
      break;
  }

  switch (opts.icons) {
    case 'material-symbols':
      loadCssUrl(MATERIAL_SYMBOLS_URL);
      break;
    case 'material-icons':
      loadCssUrl(MATERIAL_ICONS_URL);
      break;
    default:
      break;
  }

  const themeEl = document.createElement('md-theme');

  if (document.body) {
    // In debug mode
    document.body.appendChild(themeEl);

    const renderer = document.createElement('stories-renderer');
    renderer.collection = collection;
    document.body.appendChild(renderer);

  } else {
    // in the catalog mode – catalog creates renderer
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(themeEl);
    });
  }
}
