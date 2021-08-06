# `<mwc-switch>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-switch.svg)](https://www.npmjs.com/package/@material/mwc-switch)
> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Switches toggle the state of a single setting on or off. They are the preferred
way to adjust settings on mobile.

[Material Design Guidelines: Switch](https://material.io/components/selection-controls/#switches)

[Demo](https://material-components.github.io/material-components-web-components/demos/switch/)

## Installation

```sh
npm install @material/mwc-switch
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example Usage

### Standard

<img src="images/standard.png" width="68px">

```html
<mwc-switch></mwc-switch>
```

### Selected by default

<img src="images/on.png" width="68px">

```html
<mwc-switch selected></mwc-switch>
```

### Disabled

<img src="images/disabled.png" width="116px">

```html
<mwc-switch disabled></mwc-switch>
<mwc-switch selected disabled></mwc-switch>
```

### Styled

<img src="images/styled.png" width="116px">

```html
<style>
  mwc-switch {
    --mdc-switch-selected-handle-color: teal;
    --mdc-switch-selected-track-color: lightseagreen;
    /* ... additional states (hover/focus/pressed) + state-layer element */
    --mdc-switch-unselected-handle-color: goldenrod;
    --mdc-switch-unselected-track-color: palegoldenrod;
    --mdc-switch-unselected-icon-color: black;
    /* ... additional states (hover/focus/pressed) + state-layer element */
  }
</style>
<mwc-switch></mwc-switch>
<mwc-switch selected></mwc-switch>
```

### With Form Field

Most applications should use
[`<mwc-formfield>`](https://github.com/material-components/material-components-web-components/tree/master/packages/formfield)
to associate an interactive label with the switch.

<img src="images/formfield.png" width="160px" height="48px">

```html
<mwc-formfield label="Airplane mode">
  <mwc-switch selected></mwc-switch>
</mwc-formfield>

<script type="module">
  import '@material/mwc-switch';
  import '@material/mwc-formfield';
</script>
```

## API

### Slots

*None*

### Properties/Attributes
| Name       | Type      | Default | Description
| ---------- | --------- | ------- | -----------
| `selected` | `boolean` | `false` | If true, the switch is on. If false, the switch is off.
| `disabled` | `boolean` | `false` | Indicates whether or not the switch is disabled.
| `name` | `string` | `""` | The form name of the switch.
| `value` | `string` | `"on"` | The value of the switch to submit in a form when selected.

### Methods

*None*

### Events

*None*

### CSS Custom Properties

The switch may be customized using the `theme()` mixin to emit custom
properties. The `theme()` mixin can be used for simple and complex theming,
such as density.

```scss
@use '@material/mwc-switch';

mwc-switch {
  @include mwc-switch.theme((
    selected-handle-color: #00897b,
    selected-track-color: #4db6ac,
  ));
}

mwc-switch.dense {
  @include mwc-switch.theme(mwc-switch.density(-1));
}
```

```css
mwc-switch {
  --mdc-switch-selected-handle-color: #00897b;
  --mdc-switch-selected-track-color: #4db6ac;
}

mwc-switch.dense {
  --mdc-switch-state-layer-size: 44px;
}
```

View the [MDC switch theme file](https://github.com/material-components/material-components-web/blob/master/packages/mdc-switch/_switch-theme.scss)
for a list of theme keys and available built-in themes.

#### Global Custom Properties

This component exposes the following global [theming](https://github.com/material-components/material-components-web-components/blob/master/docs/theming.md)
custom properties.

| Name                                 | Description
| ------------------------------------ | -----------
| `--mdc-theme-primary`                | Selected handle and ripple color.
| `--mdc-theme-on-primary`             | Selected and unselected icon colors.

## Additional references

- [MDC Web: Switch](https://github.com/material-components/material-components-web/tree/master/packages/mdc-switch)
