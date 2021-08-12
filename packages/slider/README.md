# `<mwc-slider>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-slider.svg)](https://www.npmjs.com/package/@material/mwc-slider)
> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Sliders allow users to make selections from a range of values.

[Material Design Guidelines: sliders](https://material.io/design/components/sliders.html)

[Demo](https://material-components.github.io/material-web/demos/slider/)

## Installation

```sh
npm install @material/mwc-slider
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## ⚠️🚧  MWC Slider is currently under active development 🚧⚠️

work still to be done:

* enabling theme custom properties
* component testing (and any subsequent changes that result from testing)

## Example usage

### Continuous

```html
<script type="module">
  import '@material/mwc-slider';
</script>

<mwc-slider value="25" min="10" max="50"></mwc-slider>
```

### Discrete

```html
<mwc-slider
    discrete
    withTickMarks
    step="5"
    max="50"
    value="10">
</mwc-slider>
```

### Range Continuous

```html
<script type="module">
  import '@material/mwc-slider/slider-range.js';
</script>

<mwc-slider-range
    min="-20"
    max="20"
    valueStart="-10"
    valueEnd="5">
</mwc-slider-range>
```

### Range Discrete

```html
<mwc-slider-range
    discrete
    withTickMarks
    step="1.5"
    min="3"
    max="12"
    valueStart="4.5"
    valueEnd="9">
</mwc-slider-range>
```

## API

### Properties/Attributes

#### &lt;mwc-slider>

| Name            | Type      | Default | Description
| --------------- | --------- |-------- | -----------
| `value`         | `number`  | `0`     | Current value of the slider.
| `valueEnd`      | `number`  | `0`     | Proxy of `value`.
| `min`           | `number`  | `0`     | Value representing the minimum allowed value.
| `max`           | `number`  | `0`     | Value representing the maximum allowed value.
| `disabled`      | `boolean` | `false` | Disables the slider, preventing interaction.
| `step`          | `number`  | `1`     | Step for value quantization.
| `discrete`      | `boolean` | `false` | Displays a numeric value label upon pressing the thumb which allows the user to select an exact value.
| `withTickMarks` | `number`  | `0`     | Displays tick marks which represent predetermind values to which the user can move the slider. **NOTE:** the slider must be `discrete` to display tick marks, and to function correctly, there must be an integer amount of total steps within the range. i.e. `(max - min) % step === 0`

#### &lt;mwc-slider-range>

| Name            | Type      | Default | Description
| --------------- | --------- |-------- | -----------
| `valueStart`    | `number`  | `0`     | Current value of the start thumb handle.
| `valueEnd`      | `number`  | `0`     | Current value of the end thumb handle.
| `min`           | `number`  | `0`     | Value representing the minimum allowed value.
| `max`           | `number`  | `0`     | Value representing the maximum allowed value.
| `disabled`      | `boolean` | `false` | Disables the slider, preventing interaction.
| `step`          | `number`  | `1`     | Step for value quantization.
| `discrete`      | `boolean` | `false` | Displays a numeric value label upon pressing the thumb which allows the user to select an exact value.
| `withTickMarks` | `number`  | `0`     | Displays tick marks which represent predetermind values to which the user can move the slider. **NOTE:** the slider must be `discrete` to display tick marks, and to function correctly, there must be an integer amount of total steps within the range. i.e. `(max - min) % step === 0`

### Methods

| Name     | Description
| -------- | -------------
| `valueToValueIndicatorTransform(value: number) => string` | Override this method to transform the value of a given knob to the text that should be displayed in the value indicator of a discrete slider. Additionally, this will set the `aria-valuetext`.
| `layout(skipUpdateUI = false) => Promise<void>` | Recomputes the dimensions and re-lays out the component. This should be called if the dimensions of the slider itself or any of its parent elements change programmatically (it is called automatically on pointerdown). The skipUpdateUI parameter determines whether the UI should be updated alongside the internal clientRect model.

### Events

| Event Name | Detail             | Description
| ---------- | ------------------ | -----------
| `input`    | `{value: number, thumb: Thumb}`* | Fired when the value changes due to user input. Similar to the [`input` event of the native `<input type="range">` element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event), the `input` event will not fire when `value` is modified via JavaScript.
| `change`   | `{value: number, thumb: Thumb}`* | Fired when the value changes and the user has finished interacting with the slider. Similar to the [`change` event of the native `<input type="range">` element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event), the `change` event will not fire when `value` is modified via JavaScript.

\* `Thumb` is a TypeScript enum exported by this component with types `START` and `END`

### CSS Custom Properties

⚠️🚧  In Progress 🚧⚠️

| Name                                     | Default | Description
| ---------------------------------------- | ------- |------------

#### Global Custom Properties

⚠️🚧  In Progress and subject to change soon 🚧⚠️

This component exposes the following global [theming](https://github.com/material-components/material-components-web-components/blob/master/docs/theming.md)
custom properties.

| Name                       | Description
| -------------------------- | -----------
| `--mdc-theme-primary`      | Sets the color of the knob and filled track when slider is active.
| `--mdc-theme-on-primary`   | Sets the color of the text in the pin.
| `--mdc-theme-on-surface`   | Sets the color of the knob and filled track when slider is disabled.
| `--mdc-typography-subtitle2-<PROPERTY>` | Styles the typography of slider's value indicators.


## Additional references

- [MDC Web sliders](https://material-components.github.io/material-components-web-catalog/#/component/slider)
