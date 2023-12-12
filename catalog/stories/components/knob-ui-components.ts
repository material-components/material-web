/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// These imports are resolved by Lit playground's unpkg loader
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/radio/radio.js';
import '@material/web/ripple/ripple.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/filled-text-field.js';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleInfo, styleMap } from 'lit/directives/style-map.js';

import { Knob, KnobUi } from '../knobs.js';

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
              touch-target="none"
              style="margin-inline-end: 16px;"
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
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      margin-inline-end: 16px;
      --md-outlined-button-leading-space: 8px;
      --md-outlined-button-trailing-space: 8px;
      --md-outlined-button-container-height: 32px;
      /* md-checkbox sizes */
      --_component-size: 40px;
      --_color-picker-size: 14px;
      --_color-picker-border-width: 2px;
    }

    input {
      box-sizing: content-box;
      width: var(--_color-picker-size);
      height: var(--_color-picker-size);
      margin: calc(
        (
            var(--_component-size) - var(--_color-picker-size) -
              var(--_color-picker-border-width) * 2
          ) / 2
      );
      padding: 0;
      cursor: pointer;
      border-radius: var(--_color-picker-border-width);
      border: var(--_color-picker-border-width) solid
        var(--md-sys-color-outline);
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

    md-ripple {
      inset: unset;
      width: var(--_component-size);
      height: var(--_component-size);
      border-radius: 50%;
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

  render() {
    return html`<span id="wrapper">
      <span>
        ${this.hasAlpha ? this.renderTextInput() : this.renderColorInput()}
      </span>
      <md-outlined-button
        @click=${() => {
          this.hasAlpha = !this.hasAlpha;
        }}
      >
        ${this.hasAlpha ? 'rgba' : 'rgb'}
      </md-outlined-button>
    </span>`;
  }

  private renderTextInput() {
    return html`<md-filled-text-field
      style=${styleMap(sharedTextFieldStyles)}
      .value=${this.value}
      @change=${this.propagateEvt}
      @input=${this.onInput}
    ></md-filled-text-field>`;
  }

  private renderColorInput() {
    const rippleStyles = styleMap({
      '--md-sys-color-on-surface': this.value || 'black',
    });

    return html`
      <md-ripple for="color-picker" style=${rippleStyles}></md-ripple>
      <input
        type="color"
        id="color-picker"
        .value=${this.value}
        @change=${this.propagateEvt}
        @input=${this.onInput}
      />
    `;
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

  click() {
    const input = this.renderRoot!.querySelector(
      'input,md-filled-text-field'
    ) as HTMLElement;
    input.click();
    input.focus();
  }

  focus() {
    const input = this.renderRoot!.querySelector(
      'input,md-filled-text-field'
    ) as HTMLElement;
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
            ></knob-color-selector>
            ${knob.name}
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
  '--md-filled-field-leading-space': '8px',
  '--md-filled-field-trailing-space': '8px',
  '--md-filled-field-top-space': '4px',
  '--md-filled-field-bottom-space': '4px',
  width: '150px',
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
              style=${styleMap(sharedTextFieldStyles)}
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
        >
          <div slot="headline">${option.label}</div>
        </md-select-option>`;
      });
      return html`
        <label>
          <md-filled-select
            @change="${valueChanged}"
            menu-positioning="fixed"
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
