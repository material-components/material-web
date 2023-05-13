export { LitCollection as MaterialCollection } from './story.js';
import { CSSResult, TemplateResult, css, html } from 'lit';
import { Knob, KnobUi, KnobValues } from './knobs.js';
import { LitStoryInit, LitCollection } from './story.js';

export type KnobTypesToKnobs<
  T extends { [name: string]: any },
  U extends Extract<keyof T, string> = Extract<keyof T, string>
> = ReadonlyArray<U extends any ? Knob<T[U], U> : never>;

export interface MaterialStoryInit<T extends { [name: string]: any }> {
  name: string;
  render: (knobs: T) => TemplateResult | Promise<TemplateResult>;
  styles?: CSSResult | CSSResult[];
}

export function materialInitsToStoryInits<T extends { [name: string]: any }>(
  inits: MaterialStoryInit<T>[]
): LitStoryInit<KnobValues<KnobTypesToKnobs<T>>>[] {
  return inits.map((init) => {
    return {
      name: init.name,
      litStyles: init.styles,
      renderLit(knobMap) {
        const knobKeys = knobMap.keys();
        const knobs = {} as T;
        for (const key of knobKeys) {
          knobs[key] = knobMap.get(key)! as (typeof knobs)[typeof key];
        }
        return init.render(knobs);
      },
    };
  });
}

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
 * A subtitble knob for labelling sections in the knob UI.
 */
export function title(): KnobUi<void> {
  return {
    render(knob) {
      return html` <h3 style="font-family: sans-serif;">${knob.name}</h3> `;
    },
  };
}

/**
 * Initializes the theme element for the theming knobs and renders the stories.
 */
export function setUpDemo(collection: LitCollection): void {
  const renderer = document.createElement('stories-renderer');
  renderer.collection = collection;
  document.body.appendChild(renderer);
}
