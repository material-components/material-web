# `<mwc-slider>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-slider.svg)](https://www.npmjs.com/package/@material/mwc-slider)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Sliders allow users to make selections from a range of values.

**Note: vertical sliders and range (multi-thumb) sliders are not supported, due to their absence from the material design spec.**

<img src="images/standard.png" width="397px">

[Material Design Guidelines: sliders](https://material.io/design/components/sliders.html)

## Installation

```sh
npm install @material/mwc-slider
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Continuous

<img src="images/basic.png" width="140px">

```html
<script type="module">
  import '@material/mwc-slider';
</script>

<mwc-slider value="25" min="10" max="50"></mwc-slider>
```

### Discrete

<img src="images/discrete.gif" width="250px">

```html
<mwc-slider
    step="5"
    pin
    markers
    max="50"
    value="10">
</mwc-slider>
```

### Styled

<img src="images/discrete.gif" width="250px">

```html
<mwc-slider
    step="5"
    pin
    markers
    max="50"
    value="10">
</mwc-slider>
```

## API


### Properties/Attributes

| Name      | Type      | Default | Description
| --------- | --------- |-------- | -----------
| `value`   | `number`  | `0`     | Current value of the slider.
| `min`     | `number`  | `0`     | Minimum value of the slider.
| `max`     | `number`  | `100`   | Maximum value of the slider.
| `step`    | `number`  | `0`     | Sets the step of the slider making it discrete. Set to 0 to make continuous. Note: if `step` is greater than 0 but less than 1, it will be rounded up to 1.
| `pin`     | `bookean` | `false` | Shows the thumb pin on a discrete slider.
| `markers` | `bookean` | `false` | Shows the marker on the slider's track of a discrete slider.

### Methods

| Name     | Description
| -------- | -------------
| `layout() => void` | Updates the internal size model. May be required if the slider is resized or repositioned horizontally.

### Listeners
| Event Name    | Target   | Description
| ------------- | -------- | -----------
| `resize`      | `window` | Performs slider layout (passive).
| `mousemove`   | `body`   | Move the slider thumb and set value after initial interaction (passive).
| `mouseup`     | `body`   | Move the slider thumb and set value after initial interaction (passive).
| `pointermove` | `body`   | Move the slider thumb and set value after initial interaction (passive).
| `pointerup`   | `body`   | Move the slider thumb and set value after initial interaction (passive).
| `touchmove`   | `body`   | Move the slider thumb and set value after initial interaction (passive).
| `touchend`    | `body`   | Move the slider thumb and set value after initial interaction (passive).

### Events

| Event Name | Target       | Detail             | Description
| ---------- | ------------ | ------------------ | -----------
| `input`    | `mwc-slider` | `Slider`           | Fired when the slider is beginning to open.
| `change`   | `mwc-slider` | `Slider`           | Fired once the slider is finished opening (after animation).

### CSS Custom Properties

| Name                                     | Default | Description
| ---------------------------------------- | ------- |------------
| `--mdc-theme-secondary`                  | ![](images/color_fff.png) `#018786` | Sets the color of the knob and filled track when slider is active.
| `--mdc-theme-text-primary-on-dark`       | ![](images/color_fff.png) `white`   | Sets the color of the text in the pin.
| `--mdc-slider-bg-color-behind-component` | ![](images/color_fff.png) `white`   | Sets the color of the circle around the knob on the disabled slider to make it seem cut-out. May be necessary when placing a disabled slider on a different-colored background.

## Additional references

- [MDC Web sliders](https://material-components.github.io/material-components-web-catalog/#/component/slider)
