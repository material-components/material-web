# `<mwc-slider>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-slider.svg)](https://www.npmjs.com/package/@material/mwc-slider)
> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Sliders allow users to make selections from a range of values.

[Material Design Guidelines: sliders](https://material.io/design/components/sliders.html)

[Demo](https://material-components.github.io/material-components-web-components/demos/slider/)

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

*   finalizing theme custom properties
*   component testing (and any subsequent changes that result from testing)

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

⚠️🚧 Theming API Finalization In Progress 🚧⚠️

| Name | Default | Description | --mdc-slider-active-track-height | `6px` |
Height of the active track | --mdc-slider-active-track-shape | `3px` | Radius of
the active track | --mdc-slider-inactive-track-height | `4px` | Height of the
inactive track | --mdc-slider-inactive-track-shape | `2px` | Radius of the
inactive track | --mdc-slider-handle-height | `20px` | Height of the slider
handle | --mdc-slider-handle-width | `20px` | Width of the slider handle |
--mdc-slider-handle-shape | `10px` | Radius of the slider handle |
--mdc-slider-handle-color | `--mdc-theme-primary` | Color of the handle |
--mdc-slider-with-overlap-handle-outline-color | `--mdc-theme-on-primary` |
Color of the outline of the handle when it overlaps another handle |
--mdc-slider-with-overlap-handle-outline-width | `1px` | Width of the outline of
the handle when it overlaps another handle | --mdc-slider-active-track-color |
`--mdc-theme-primary` | Color of the active track |
--mdc-slider-inactive-track-color | `#dcc4fb` | Color of the inactive track |
--mdc-slider-with-tick-marks-container-size | `2px` | Height and width of the
tick marks | --mdc-slider-with-tick-marks-container-shape | `1px` | Radius of
the tick marks | --mdc-slider-with-tick-marks-active-container-color |
`--mdc-theme-on-primary` | Color of the tick marks in the active track |
--mdc-slider-with-tick-marks-active-container-opacity | `.6` | Opacity of the
tick marks in the active track |
--mdc-slider-with-tick-marks-inactive-container-color | `--mdc-theme-primary` |
Color of tick marks in the inactive track |
--mdc-slider-with-tick-marks-inactive-container-opacity | `.24` | Opacity of the
tick marks in the inactive track |
--mdc-slider-with-value-label-container-height | `28px` | Height of the value
indicator and width of the small indicator |
--mdc-slider-with-value-label-container-color | `--mdc-theme-primary` |
Background color of the value indicator |
--mdc-slider-with-value-label-label-text-font |
`--mdc-typography-subtitle2-font-family` | Font family of the value indicator |
--mdc-slider-with-value-label-label-text-font-size |
`--mdc-typography-subtitle2-font-size` | Font size of the value indicator |
--mdc-slider-with-value-label-label-text-line-height |
`--mdc-typography-subtitle2-line-height` | Line height of the value indicator |
--mdc-slider-with-value-label-label-text-weight |
`--mdc-typography-subtitle2-font-weight` | Font weight of the value indicator |
--mdc-slider-with-value-label-label-text-tracking |
`--mdc-typography-subtitle2-letter-spacing` | Letter spacing of the value
indicator | --mdc-slider-with-value-label-label-text-color |
`--mdc-theme-on-primary` | Color of the value indicator text |
--mdc-slider-disabled-handle-color | `--mdc-theme-on-surface` | Color of the
handles when disabled | --mdc-slider-disabled-track-active-color |
`--mdc-theme-on-surface` | Color of the active track when disabled |
--mdc-slider-disabled-track-inactive-color | `#bfbfbf` | Color of the inactive
track when disabled |
--mdc-slider-with-tick-marks-disabled-active-container-color |
`--mdc-theme-on-primary` | Color of the tick marks in the active track when
disabled | --mdc-slider-with-tick-marks-disabled-active-container-opacity | `.6`
| Opacity of the tick marks in the active track when disabled |
--mdc-slider-with-tick-marks-disabled-inactive-container-color |
`--mdc-theme-on-surface` | Color of the tick marks in the inactive track when
disabled | --mdc-slider-with-tick-marks-disabled-inactive-container-opacity |
`.6` | Opacity of the tick marks in the inactive track when disabled |
--mdc-slider-hover-handle-color | `--mdc-theme-primary` | Color of the handle
when hovered | --mdc-slider-hover-state-layer-color | `--mdc-theme-primary` |
Color of the handle ripple when hovered | --mdc-slider-hover-state-layer-opacity
| `.04` | Opacity of the handle ripple when hovered |
--mdc-slider-focus-handle-color | `--mdc-theme-primary` | Color of the handle
when focused | --mdc-slider-focus-state-layer-color | `--mdc-theme-primary` |
Color of the handle ripple when focused | --mdc-slider-focus-state-layer-opacity
| `.12` | Opacity of the handle ripple when focused |
--mdc-slider-pressed-handle-color | `--mdc-theme-primary` | Color of the handle
when pressed | --mdc-slider-pressed-state-layer-color | `--mdc-theme-primary` |
Color of the handle ripple when pressed |
--mdc-slider-pressed-state-layer-opacity | `.12` | Opacity of the handle ripple
when pressed

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
