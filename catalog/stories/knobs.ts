/**
 * @fileoverview Defines a facility for runtime customization of a story.
 */

import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/radio/radio.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/filled-text-field.js';

import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';

interface KnobInit<T> {
  defaultValue?: T;
  ui: KnobUi<T>;
  wiring?: KnobWiring<T>;
}

class ExtendableEventTarget implements EventTarget {
  private readonly target: EventTarget = document.createDocumentFragment();

  addEventListener(eventName: string, cb: (ev: Event) => void) {
    this.target.addEventListener(eventName, cb);
  }

  removeEventListener(eventName: string, cb: (ev: Event) => void) {
    this.target.removeEventListener(eventName, cb);
  }

  dispatchEvent(event: Event) {
    return this.target.dispatchEvent(event);
  }
}

/**
 * A parameter that may be customized at runtime for a story.
 *
 * Has two parts: a UI which may be displayed to the user for them to set the
 * knob's value, and an optional bit of wiring that, if given, may automatically
 * apply the value to the rendered story.
 *
 * The story will also be notified when a knob's value changes.
 *
 * @template {Name} We capture the name of the knob here as a string literal
 *     type so that we can provide type safe access to the current value of a
 *     knob from within a story's render function.
 */
export class Knob<
  T,
  Name extends string = string
> extends ExtendableEventTarget {
  readonly defaultValue?: T;
  latestValue?: T;

  /**
   * True iff the knob has had a value set, so that we know to apply any
   * wiring to any new stories we're informed of.
   */
  private dirty = false;
  private readonly uiFn: KnobUi<T>;
  private readonly wiring?: KnobWiring<T>;
  private readonly onChange = (updatedVal: T, resetting = false) => {
    this.latestValue = updatedVal;
    this.dirty = !resetting;
    this.dispatchEvent(new CustomEvent<T>('changed', { detail: updatedVal }));
    if (this.wiring !== undefined) {
      for (const container of this.renderedStoryContainers) {
        this.wiring(this, updatedVal, container);
      }
    }
  };
  private readonly onReset = () => {
    this.reset();
  };
  private readonly renderedStoryContainers = new Set<
    HTMLElement | DocumentFragment
  >();

  constructor(readonly name: Name, init: KnobInit<T>) {
    super();
    this.defaultValue = init.defaultValue;
    this.latestValue = this.defaultValue;
    this.wiring = init.wiring;
    this.uiFn = init.ui;
  }

  get isUnset() {
    return !this.dirty;
  }

  get uiTemplate(): TemplateResult {
    return this.uiFn.render(this, this.onChange, this.onReset);
  }

  getKnobUiTemplate(): TemplateResult {
    return this.uiTemplate;
  }

  /**
   * Connect the knob's wiring, if any, up to a container of a rendered story.
   * This is fast and idempotent, so it's fine to call frequently.
   */
  connectWiring(containerOfRenderedStory: HTMLElement | DocumentFragment) {
    // Fast path the common case where we have no wiring.
    if (!this.wiring) {
      return;
    }
    const alreadyWired = this.renderedStoryContainers.has(
      containerOfRenderedStory
    );
    if (!alreadyWired) {
      this.renderedStoryContainers.add(containerOfRenderedStory);
      // Ensure default values are wired correctly.
      if (
        this.dirty ||
        (this.latestValue !== undefined &&
          this.latestValue === this.defaultValue)
      ) {
        this.wiring?.(this, this.latestValue!, containerOfRenderedStory);
      }
    }
  }

  disconnectWiring(containerOfRenderedStory: HTMLElement | DocumentFragment) {
    return this.renderedStoryContainers.delete(containerOfRenderedStory);
  }

  imperativelySet(newValue: T) {
    this.dirty = true;
    if (this.latestValue !== newValue) {
      this.onChange(newValue);
    }
  }

  reset() {
    if (this.dirty === true) {
      this.onChange(this.defaultValue!, true);
    }
  }
}

/** NOTE: This must only be used in an extends clause for a type variable. */
export type PolymorphicArrayOfKnobs =
  // tslint:disable-next-line:no-any Necessary for type operators.
  ReadonlyArray<Knob<any>>;

/**
 * Given an array of Knobs, return their names.
 *
 * So given
 *   Knobs = `[Knob<string, 'label'>, Knob<number, 'count'>]`
 *
 * This type operator would return 'label' | 'count'
 */
type KnobKeys<Knobs extends PolymorphicArrayOfKnobs> = Knobs[number]['name'];

/**
 * Given an array of Knobs, and the name of one of those knobs,
 * returns the value of the knob.
 *
 * So given:
 *   Knobs = `[Knob<string, 'label'>, Knob<number, 'count'>]` and
 *   SearchName = `'count'`
 *
 * This type operator would return `number`.
 */
type TypeOfKnobWithName<
  Knobs extends PolymorphicArrayOfKnobs,
  SearchName extends string
> = Extract<Knobs[number], { name: SearchName }> extends Knob<infer U>
  ? U | undefined
  : never;

/** A helper class for getting the latest value for a knob by name. */
export class KnobValues<
  Knobs extends PolymorphicArrayOfKnobs
> extends ExtendableEventTarget {
  private readonly byName: ReadonlyMap<string, Knob<unknown>>;

  constructor(knobsArray: PolymorphicArrayOfKnobs) {
    super();
    const byName = new Map<string, Knob<unknown>>();
    for (const knob of knobsArray) {
      if (byName.has(knob.name)) {
        throw new Error(
          `More than one knob with name '${knob.name}' given to a story.`
        );
      }
      byName.set(knob.name, knob);
      knob.addEventListener('changed', (e) => {
        this.dispatchEvent(
          new CustomEvent('changed', { detail: { knobName: knob.name } })
        );
      });
    }
    this.byName = byName;
  }

  get<SearchName extends KnobKeys<Knobs>>(
    knobName: SearchName
  ): TypeOfKnobWithName<Knobs, SearchName> {
    return this.byName.get(knobName)?.latestValue as TypeOfKnobWithName<
      Knobs,
      SearchName
    >;
  }

  set<SearchName extends KnobKeys<Knobs>>(
    knobName: SearchName,
    newValue: TypeOfKnobWithName<Knobs, SearchName>
  ) {
    const knob = this.byName.get(knobName);
    if (knob === undefined) {
      throw new Error(`No knob with name ${knobName}`);
    }
    knob.imperativelySet(newValue);
  }

  keys<SearchName extends KnobKeys<Knobs>>(): IterableIterator<SearchName> {
    return this.byName.keys() as IterableIterator<SearchName>;
  }

  /**
   * Reset all knob values back to their initial values.
   */
  reset() {
    for (const knob of this.byName.values()) {
      knob.reset();
    }
  }

  /** True if empty, false if it contains knobs. */
  get empty(): boolean {
    return this.byName.size === 0;
  }

  /**
   * Connect the knobs' wiring up to this container where a story will be
   * rendered.
   *
   * Unlikely that any code outside of the stories system internals would
   * call this.
   */
  connectWiring(container: HTMLElement | DocumentFragment) {
    for (const knob of this.byName.values()) {
      knob.connectWiring(container);
    }
  }

  /**
   * The inverse of connectWiring, so that discarded story renderers can be
   * garbage collected.
   *
   * Returns false if the container wasn't actually connected.
   */
  disconnectWiring(container: HTMLElement | DocumentFragment) {
    let disconnected = false;
    for (const knob of this.byName.values()) {
      disconnected = knob.disconnectWiring(container) || disconnected;
    }
    return disconnected;
  }

  /**
   * Renders the UIs of the knobs.
   */
  renderUI(): TemplateResult {
    const uiTemplates = [];
    for (const knob of this.byName.values()) {
      uiTemplates.push(knob.getKnobUiTemplate());
    }
    return html`${uiTemplates}`;
  }
}

/**
 * Displays a user interface for someone browsing a catalog or demo for an
 * element to set the knob to different values.
 */
export interface KnobUi<T> {
  /**
   * @param knob Info about the knob that this UI is being rendered for.
   * @param container The element to render the UI into.
   * @param onChange Call this function every time a new value for the knob
   *     has been selected by the user.
   * @param onReset Call this function when the user has indicated that they
   *     want to unset a knob completely. This is similar to calling onChange
   *     with knob.defaultValue, but it will clear the knob from the URL
   *     and wiring may treat this case differently (e.g. restoring a value
   *     to the value it had before the wiring set it the first time).
   */
  render(
    knob: Knob<T>,
    onChange: (val: T) => void,
    onReset: () => void
  ): TemplateResult;
}

/**
 * Takes updated values for a knob and interacts with a rendered story in order
 * to automatically apply the knob's value.
 *
 * Not all knobs can be automatically wired up in this way, so the knobs are
 * also made available to the stories themselves.
 *
 * For example, a knob that updates a css custom property can be automatically
 * wired up by just applying styles to the containerOfRenderedStory.
 */
export interface KnobWiring<T> {
  (
    knob: Knob<T>,
    val: T,
    containerOfRenderedStory: HTMLElement | DocumentFragment
  ): void;
}

/**
 * A boolean Knob UI.
 */
export function boolInput(): KnobUi<boolean> {
  return {
    render(knob: Knob<boolean>, onChange: (val: boolean) => void) {
      const valueChanged = (e: Event) => {
        onChange((e.target as HTMLInputElement).checked);
      };

      return html`
        <div>
          <label>
            <md-checkbox
              reducedTouchTarget
              .checked=${!!knob.latestValue}
              @change="${valueChanged}"
            >
            </md-checkbox>
            ${knob.name}
          </label>
        </div>
      `;
    },
  };
}

/**
 * Color selector for knob UI
 */
@customElement('knob-color-selector')
export class KnobColorSelector extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }
    input:not(.alpha) {
      box-sizing: content-box;
      width: 14px;
      height: 14px;
      margin: 11px;
      padding: 0;
      cursor: pointer;
      border-radius: 2px;
      border: 2px solid rgba(0, 0, 0, 0.54);
      outline: none;
    }

    input::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    input::-webkit-color-swatch {
      border: 0;
    }

    span {
      position: relative;
      display: inline-block;
    }

    :host(:hover) input:not(.alpha)::before,
    input:not(.alpha):focus::before,
    :host(:hover) input:not(.alpha)::after,
    input:not(.alpha):focus::after {
      background-color: var(--mdc-ripple-color, black);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      border-radius: 50%;
      opacity: 0.04;
    }

    :host(:hover) input:not(.alpha)::after,
    input:not(.alpha):focus::after {
      background-color: transparent;
      border: 1px solid black;
      opacity: 0.12;
    }

    input:not(.alpha):focus::before {
      opacity: 0.12;
    }

    #wrapper {
      display: flex;
      align-items: center;
    }
  `;

  private internalValue = '';

  @property({ type: Boolean }) hasAlpha = false;

  set value(val: string) {
    const oldVal = this.internalValue;
    this.internalValue = val;
    this.requestUpdate('value', oldVal);
  }

  @property({ type: String, reflect: true })
  get value() {
    return this.internalValue;
  }

  override render() {
    const inputStyles = styleMap({
      '--mdc-ripple-color': this.value ?? 'black',
    });

    const value = (this.value ?? null) as string;
    return html` <span id="wrapper">
      <span>
        <input
          class="${classMap({
            alpha: this.hasAlpha,
          })}"
          type="${this.hasAlpha ? 'text' : 'color'}"
          style=${inputStyles}
          .value="${value}"
          @change=${this.propagateEvt}
          @input=${this.onInput}
        />
      </span>
      <button
        @click=${() => {
          this.hasAlpha = !this.hasAlpha;
        }}
      >
        ${this.hasAlpha ? 'rgba' : 'rgb'}
      </button>
    </span>`;
  }

  private onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.value = val;
    this.propagateEvt(e);
  }

  private propagateEvt(e: Event) {
    const newEvt = new Event(e.type, {
      bubbles: e.bubbles,
      composed: e.composed,
    });
    this.dispatchEvent(newEvt);
  }

  override click() {
    const input = this.shadowRoot!.querySelector('input')!;
    input.click();
    input.focus();
  }

  override focus() {
    const input = this.shadowRoot!.querySelector('input')!;
    input.focus();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'knob-color-selector': KnobColorSelector;
  }
}

const defaultColorPickerOpts = {
  hasAlpha: false,
};

/**
 * Options for ColorPicker knob.
 */
export type ColorPickerOpts = Partial<typeof defaultColorPickerOpts>;

/**
 * A color picker Knob UI.
 */
export function colorPicker(opts?: ColorPickerOpts): KnobUi<string> {
  const config: typeof defaultColorPickerOpts = {
    ...defaultColorPickerOpts,
    ...opts,
  };
  return {
    render(knob: Knob<string>, onChange: (val: string) => void) {
      const valueChanged = (e: Event) => {
        onChange((e.target as KnobColorSelector).value);
      };
      return html`
        <div>
          <label>
            <knob-color-selector
              .value="${knob.latestValue ?? ''}"
              .hasAlpha="${config.hasAlpha}"
              @input=${valueChanged}
            >
              ${knob.name}
            </knob-color-selector>
          </label>
        </div>
      `;
    },
  };
}

interface TextInputOptions<T> {
  transform(val: string): T;
}

const sharedTextFieldStyles: StyleInfo = {
  'margin-inline-end': '16px',
  '--md-filled-field-container-padding-horizontal': '8px',
  '--md-filled-field-container-padding-vertical': '4px',
  'width': '150px',
  'min-width': '150px',
};

/**
 * A simple, one line text input Knob UI.
 */
export function textInput<T>(): KnobUi<string>;
export function textInput<T>(options: TextInputOptions<T>): KnobUi<T>;
export function textInput<T>(options?: TextInputOptions<T>): KnobUi<T> {
  return {
    render(knob: Knob<T>, onChange: (val: T) => void) {
      const valueChanged = (e: Event) => {
        const rawVal = (e.target as HTMLInputElement).value;

        if (options) {
          onChange(options.transform(rawVal));
        } else {
          onChange(rawVal as unknown as T);
        }
      };
      return html`
        <div>
          <label>
            <md-filled-text-field
              style=${styleMap(sharedTextFieldStyles)}
              .value="${(knob.latestValue ?? '') as unknown as string}"
              @input="${valueChanged}"
            ></md-filled-text-field>
            ${knob.name}
          </label>
        </div>
      `;
    },
  };
}

const defaultNumberInputOpts = {
  step: 1,
};

/**
 * Options for NumberInput knob.
 */
export type NumberInputOpts = Partial<typeof defaultNumberInputOpts>;

/**
 * A simple, one line text input Knob UI.
 */
export function numberInput(opts?: NumberInputOpts): KnobUi<number> {
  const config: typeof defaultNumberInputOpts = {
    ...defaultNumberInputOpts,
    ...opts,
  };

  return {
    render(knob, onChange, onReset) {
      const valueChanged = (e: Event) => {
        const rawVal = (e.target as HTMLInputElement).value;
        onChange(Number(rawVal));
      };
      return html`
        <div>
          <label>
            <md-filled-text-field
              style="margin-inline-end:16px;--md-filled-field-container-padding-horizontal:8px;--md-filled-field-container-padding-vertical:4px;width:150px;min-width:150px;"
              type="number"
              step="${config.step}"
              .value="${knob.latestValue ? knob.latestValue.toString() : '0'}"
              @input="${valueChanged}"
            ></md-filled-text-field>
            ${knob.name}
          </label>
        </div>
      `;
    },
  };
}

/**
 * A Knob UI that's just a button that triggers a rerender which it's clicked.
 * The value keeps track of the number of times it's been clicked.
 */
export function button(): KnobUi<number> {
  return {
    render(knob, onChange) {
      const onClick = () => {
        const count = knob.latestValue ?? 0;
        onChange(count + 1);
      };
      const styles = styleMap({ display: 'inline-block' });
      return html`
        <md-outlined-button outlined @click=${onClick} style=${styles}>
          ${knob.name}
        </md-outlined-button>
      `;
    },
  };
}

interface RadioSelectorConfig<T extends string> {
  readonly options: ReadonlyArray<{
    readonly value: T;
    readonly label: string;
  }>;
  readonly name: string;
}

/** A radio button Knob UI. */
export function radioSelector<T extends string>({
  options,
  name,
}: RadioSelectorConfig<T>): KnobUi<T> {
  return {
    render(knob: Knob<T>, onChange: (val: T) => void) {
      const valueChanged = (e: Event) => {
        onChange((e.target as HTMLInputElement).value as T);
      };
      const radioOptions = options.map((option, index) => {
        const value: string = option.value;
        return html` <label>
          <md-radio
            name="${name}"
            value="${value}"
            @change="${valueChanged}"
            ?checked="${knob.latestValue === option.value}"
          ></md-radio>
        ${option.label}
        </label>`;
      });
      return html` <div>${radioOptions}</div> `;
    },
  };
}

interface SelectDropdownConfig<T extends string> {
  readonly options: ReadonlyArray<{
    readonly value: T;
    readonly label: string;
  }>;
}

/** A select dropdown Knob UI. */
export function selectDropdown<T extends string>({
  options,
}: SelectDropdownConfig<T>): KnobUi<T | undefined> {
  return {
    render(knob: Knob<T | undefined>, onChange: (val: T) => void) {
      const valueChanged = (e: Event) => {
        onChange((e.target as HTMLInputElement).value as T);
      };
      const listItems = options.map((option, index) => {
        return html`<md-select-option
          ?selected="${knob.latestValue === option.value}"
          .value="${option.value}"
          .headline=${option.label}
        ></md-select-option>`;
      });
      return html`
        <label>
          <md-filled-select
              @change="${valueChanged}"
              menuFixed
              style=${styleMap(sharedTextFieldStyles)}
              >
            ${listItems}
          </md-filled-select>
          ${knob.name}
        </label>
      `;
    },
  };
}

/**
 * Knob wiring that updates the CSS custom property with the knob's name
 * to the updated value.
 */
export function cssCustomProperty(
  knob: Knob<string>,
  val: string,
  containerOfRenderedStory: HTMLElement
) {
  const value = knob.isUnset ? knob.defaultValue : val;
  if (value) {
    containerOfRenderedStory.style.setProperty(knob.name, value);
  } else {
    containerOfRenderedStory.style.removeProperty(knob.name);
  }
}

const setPropDefaults = new WeakMap<Knob<unknown>, WeakMap<Element, unknown>>();
/**
 * Knob wiring that updates the CSS properties on a given querySelector's
 * targets.
 */
export function setProp(selector: string) {
  // In the common case, where selector is keyof ElementTagNameMap, can we
  // actually type check this?
  // tslint:disable-next-line:no-any No way to represent this type clearly.
  return (knob: Knob<any>, val: unknown, container: HTMLElement) => {
    let defaults = setPropDefaults.get(knob);
    if (defaults === undefined) {
      defaults = new WeakMap();
      setPropDefaults.set(knob, defaults);
    }
    const elements = Array.from(container.querySelectorAll(selector));
    if (knob.isUnset === true) {
      for (const element of elements) {
        if (defaults.has(element)) {
          const defaultVal = defaults.get(element);
          // tslint:disable-next-line:no-any Necessary
          (element as any)[knob.name] = defaultVal;
          defaults.delete(element);
        }
      }
      return;
    }
    for (const element of elements) {
      if (!defaults.has(element)) {
        // tslint:disable-next-line:no-any Necessary for setting arbitrary props
        defaults.set(element, (element as any)[knob.name]);
      }
      // tslint:disable-next-line:no-any Necessary for setting arbitrary props
      (element as any)[knob.name] = val;
    }
  };
}
