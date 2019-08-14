# `<mwc-notched-outline>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-notched-outline.svg)](https://www.npmjs.com/package/@material/mwc-notched-outline)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

> IMPORTANT: This element is not meant to be consumed outside of our input
> control elements and without mwc-floating-label-directive.

Notched outline is a subcomponent to our input controls that have floating text and outlines.

## Installation

```sh
npm install @material/mwc-notched-outline
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### In a LitElement

```ts
import '@material/mwc-notched-outline';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {customElement, property, query, html, css, LitElement, PropertyValues} from 'lit-element';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {style as floatingLabelStyles} from '@material/mwc-floating-label/mwc-floating-label-css.js';

@customElement('my-outlined-input')
class MyOutlinedInput extends LitElement {
  @property() protected notchOpen = false;
  @property() protected notchWidth = 0;

  @query('mwc-notched-outline') protected notchedOutlineElement: NotchedOutline!;
  @query('label') protected labelElement: FloatingLabel!;

  static get styles() {
    return [floatingLabelStyles, css`
      :host {
        position: relative;
      }
    `];
  }

  floatLabel(shouldFloat: boolean) {
    this.notchWidth = this.labelElement.foundation.getLabelWidth();
    this.notchOpen = shouldFloat;
    this.labelElement.foundation.float(shouldFloat);
  }

  render() {
    return html`
      <input id="myInput">
      <mwc-notched-outline
          .width=${this.notchWidth}
          .open=${this.notchOpen}>
        <label .foundation=${floatingLabel()} for="myInput">My Label</label>
      </mwc-notched-outline>
    `;
  }
}
```

## API

### Slots

| Name      | Description
| --------- | -----------
| `[default]`  | Optional [`FloatingLabel`](https://github.com/material-components/material-components-web-components/tree/master/packages/floating-label) which is the label to be floated into the notch.

### Properties/Attributes

| Name    | Type      | Description
| ------- | --------- |------------
| `width` | `number`  | Width of the notch in pixels.
| `open`  | `boolean` | Whether the notch should be opened or not.

### CSS Custom Properties

| Name                                           | Default       | Description
| ---------------------------------------------- | ------------- |------------
| `--mdc-theme-primary`                          | `#6200ee`     | Color of a floating, slotted `FloatingLabel`.
| `--mdc-notched-outline-leading-width`          | `12px`        | Width of the leading section of the outline (left of notch in LTR).
| `--mdc-notched-outline-leading-border-radius`  | `4px 0 0 4px` | Radius of the border on the leading end. **May require setting `--mdc-notched-outline-leading-width` to accomodate for the new radius**
| `--mdc-notched-outline-trailing-border-radius` | `0 4px 4px 0` | Radius of the border on the trailing end.
| `--mdc-notched-outline-stroke-width`           | `1px`         | Outline width.