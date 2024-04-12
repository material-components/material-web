/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Slimmed down version of Lit stories story file */

import {CSSResult, html, nothing, render, TemplateResult} from 'lit';

import {Knob, KnobValues, PolymorphicArrayOfKnobs} from './knobs.js';

export {Knob, PolymorphicArrayOfKnobs} from './knobs.js';

/** Metadata all stories share. */
export interface BaseStoryInit {
  /** A short name, unique to the containing collection. */
  readonly name: string;
  readonly id?: string;
  readonly description?: string;
}

// Type variable to help clang-format.
type GenericKnobValues = KnobValues<PolymorphicArrayOfKnobs>;

/** A story with an arbitrary render function. */
export interface StoryInit<KV extends GenericKnobValues = GenericKnobValues>
  extends BaseStoryInit {
  render(container: HTMLElement | DocumentFragment, knobs: KV): Promise<void>;
  styles?: CSSStyleSheet[];
}

class StoryImpl<
  Knobs extends PolymorphicArrayOfKnobs = PolymorphicArrayOfKnobs,
> {
  readonly name: string;
  readonly id: string;
  readonly description: string | undefined;
  readonly render: (container: HTMLElement | DocumentFragment) => Promise<void>;
  readonly dispose: (container: HTMLElement | DocumentFragment) => void;
  readonly knobs: KnobValues<Knobs>;

  private readonly initStyles: CSSStyleSheet[] | undefined;

  get styles() {
    let styles = [...this.collection.customStyles];
    if (this.initStyles) {
      styles = styles.concat(this.initStyles);
    }
    return styles;
  }

  constructor(init: StoryInit, private readonly collection: Collection) {
    this.name = init.name;
    this.description = init.description;
    this.id = init.id || this.name.replace(/ /g, '_').replace(/,/g, '');
    if (this.id.includes('/')) {
      const message =
        `A story id can't contain a '/' character. ` +
        `The name can, but if so you have to give an ` +
        `explicit id that doesn't.`;
      throw new Error(message);
    }
    const wrapperDivMap = new WeakMap<
      HTMLElement | DocumentFragment,
      HTMLDivElement
    >();

    this.initStyles = init.styles;

    this.knobs = collection.knobs;

    this.render = async (container: HTMLElement | DocumentFragment) => {
      let wrapperDiv = wrapperDivMap.get(container);
      if (wrapperDiv === undefined) {
        wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'storyWrapper';
        wrapperDivMap.set(container, wrapperDiv);
      }
      render(html` ${wrapperDiv} `, container);
      await init.render(wrapperDiv, this.knobs);
    };

    this.dispose = (container: HTMLElement | DocumentFragment) => {
      wrapperDivMap.delete(container);
      render(nothing, container);
    };
  }
}

/**
 * A function that can render some HTML, combined with that metadata.
 *
 * A Story typically depicts a configuration of a UI component or group of
 * components. A Story is always a member of a collection.
 *
 * The type is exposed here, but the implementation isn't, because a Story
 * must be constructed via a Collection.
 */
export type Story<
  Knobs extends PolymorphicArrayOfKnobs = PolymorphicArrayOfKnobs,
> = StoryImpl<Knobs>;

/**
 * A tree of related stories and sub-collections.
 *
 * The stories and sub-collections are stored in the order that they are
 * added to the collection.
 *
 * Every Story is a member of exactly one collection. Every collection is
 * either a toplevel collection for a named component, or it is a member of
 * exactly one collection.
 */
export class Collection<
  T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>,
> {
  private readonly children = new Map<string, Story | Collection>();
  readonly customStyles: CSSStyleSheet[] = [];
  private static readonly collectionsByName = new Map<string, Collection>();
  readonly knobs: KnobValues<T>;

  constructor(readonly name: string, knobs: T = [] as unknown as T) {
    Collection.collectionsByName.set(name, this);
    this.knobs = new KnobValues(knobs);
  }

  /**
   * Get an array of all stories in this collection.
   *
   * Exported for mwc's compiled tests.
   * @export
   */
  get stories(): Array<Story<T>> {
    const stories = [];
    for (const child of this.children.values()) {
      if (child instanceof StoryImpl) {
        stories.push(child);
      } else {
        stories.push(...child.stories);
      }
    }
    return stories;
  }

  get tree(): ReadonlyMap<string, Story<T> | Collection<T>> {
    return this.children;
  }

  static get byName(): ReadonlyMap<string, Collection> {
    return Collection.collectionsByName;
  }

  addStories(...inits: ReadonlyArray<StoryInit<KnobValues<T>>>) {
    for (const init of inits) {
      const story = new StoryImpl(init, this);
      if (this.children.has(story.id)) {
        const message = `A story or subcollection already exists with the id ${JSON.stringify(
          story.id,
        )}`;
        // Don't throw an error, as that will disrupt live_reload / hot reload,
        // by halting this module's initialization.
        console.error(message);
        continue;
      }
      this.children.set(story.id, story);
    }
  }

  applyStyle(customStyle: CSSResult) {
    this.customStyles.push(customStyle.styleSheet!);
  }
}

/**
 * Describes a single configuration of a specific web UI component.
 */
export interface LitStoryInit<
  KV extends KnobValues<PolymorphicArrayOfKnobs> = KnobValues<PolymorphicArrayOfKnobs>,
> extends BaseStoryInit {
  renderLit(knobs: KV): TemplateResult | Promise<TemplateResult>;
  litStyles?: CSSResult | CSSResult[];
}

function isLitStoryInit(init: Partial<LitStoryInit>): init is LitStoryInit {
  return !!init.renderLit;
}

/**
 * A collection with convenience methods for rendering lit-html templates.
 */
export class LitCollection<
  T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>,
> extends Collection<T> {
  override addStories(
    ...inits: Array<StoryInit<KnobValues<T>> | LitStoryInit<KnobValues<T>>>
  ) {
    const simpleInits: StoryInit[] = [];
    for (const init of inits) {
      if (isLitStoryInit(init)) {
        let styles: CSSStyleSheet[] = [];
        if (init.litStyles) {
          styles =
            init.litStyles instanceof Array
              ? init.litStyles.map((s) => s.styleSheet!)
              : [init.litStyles.styleSheet!];
        }
        simpleInits.push({
          ...init,
          async render(container, knobValues) {
            const templateResult = await init.renderLit(knobValues);
            render(templateResult, container);
          },
          styles,
        });
      } else {
        simpleInits.push(init);
      }
    }
    super.addStories(...simpleInits);
  }
}
