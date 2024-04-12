/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Slimmed down version of material-collection */

import {css, CSSResult, html, TemplateResult} from 'lit';

import {Knob, KnobUi, KnobValues} from './knobs.js';
import {LitCollection, LitStoryInit} from './story.js';

export {LitCollection as MaterialCollection} from './story.js';

/**
 * Material styling for labels.
 */
export const labelStyles = css`
  label {
    display: inline-flex;
    place-items: center;
    gap: 8px;
    font-family: Roboto, system-ui;
    color: var(--md-sys-color-on-background, #000);
  }
`;

/**
 * A subtitle knob for labelling sections in the knob UI.
 */
export function title(): KnobUi<void> {
  return {
    render(knob) {
      return html` <h3 style="font-family: system-ui;">${knob.name}</h3> `;
    },
  };
}

/**
 * Converts an interface of `{[knobName: string]: unknown}` to something
 * ingestable by MaterialCollection.
 *
 * @example
 * ```ts
 * // demo.ts
 * import {StoryKnobs} from './stories.js';
 * import {MaterialCollection, KnobTypesToKnobs} from
 * '@material/web/internal/demo/stories/material-collection';
 *
 * const stories = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(...);
 * ```
 */
export type KnobTypesToKnobs<
  // tslint:disable-next-line:no-any No way to represent this type clearly.
  T extends {[name: string]: any},
  Names extends Extract<keyof T, string> = Extract<keyof T, string>,
  // tslint:disable-next-line:no-any We need to "map" the union type to knobs.
> = ReadonlyArray<Names extends any ? Knob<T[Names], Names> : never>;

/**
 * An init object for Material Stories. This should be exposed to the user.
 *
 * @example
 * ```ts
 * import {MaterialStoryInit} from
 * '@material/web/internal/demo/stories/material-collection';
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
  styles?: CSSResult | CSSResult[];
}

/**
 * Converts an array of `MaterialStoryInit`s to a `LitStoryInit`.
 */
// tslint:disable-next-line:no-any No way to represent this type clearly.
export function materialInitsToStoryInits<T extends {[name: string]: any}>(
  inits: Array<MaterialStoryInit<T>>,
): Array<LitStoryInit<KnobValues<KnobTypesToKnobs<T>>>> {
  return inits.map((init) => {
    return {
      name: init.name,
      litStyles: init.styles,
      renderLit(knobMap) {
        const knobNames = knobMap.names();
        const knobs: T = {} as unknown as T;
        for (const name of knobNames) {
          knobs[name] = knobMap.get(name)! as (typeof knobs)[typeof name];
        }
        return init.render(knobs);
      },
    };
  });
}

/**
 * Initializes the theme element for the theming knobs and renders the stories.
 */
export function setUpDemo(collection: LitCollection): void {
  const renderer = document.createElement('stories-renderer');
  renderer.collection = collection;
  document.body.appendChild(renderer);
}
