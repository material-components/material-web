# `<mwc-switch>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-switch.svg)](https://www.npmjs.com/package/@material/mwc-switch)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Switches toggle the state of a single setting on or off. They are the preferred
way to adjust settings on mobile.

[Material Design Guidelines: Switch](https://material.io/components/selection-controls/#switches)

## Installation

```sh
npm install @material/mwc-switch
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example Usage

### Standard

<img src="images/standard.png" width="68px">

```html
<mwc-switch></mwc-switch>
```

### Checked by default

<img src="images/on.png" width="68px">

```html
<mwc-switch checked></mwc-switch>
```

### Disabled

<img src="images/disabled.png" width="116px">

```html
<mwc-switch disabled></mwc-switch>
<mwc-switch checked disabled></mwc-switch>
```

### Styled

<img src="images/styled.png" width="68px">

```html
<style>
  mwc-switch {
    --mdc-theme-secondary: red;
  }
</style>
<mwc-switch checked></mwc-switch>
```

## API

### Slots
*None*

### Properties/Attributes
| Name       | Type      | Default | Description
| ---------- | --------- | ------- | -----------
| `checked`  | `boolean` | `false` | Whether or not the switch should be checked / activated.
| `disabled` | `boolean` | `false` | Disables the input and sets the disabled styles.

### Methods
*None*

### Events
*None*

### CSS Custom Properties

| Name | Default | Description
| ----------------------- | -------------------------------------- | ---
| `--mdc-theme-secondary` | ![](images/color_018786.png) `#018786` | Fill color of the thumb head and a lightened fill of the track.

Also inherits styles from [ripple](../ripple/README.md)

## Additional references

- [MDC Web: Switch](https://github.com/material-components/material-components-web/tree/master/packages/mdc-switch)
