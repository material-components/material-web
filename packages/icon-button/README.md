# `<mwc-icon-button>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-icon-button.svg)](https://www.npmjs.com/package/@material/mwc-icon-button)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Icon buttons allow users to take actions, and make choices, with a single tap.

For the toggling version of this component, see [`<mwc-icon-button-toggle>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button-toggle/)

[Material Design Guidelines: Button](https://material.io/design/components/buttons.html)

## Installation

```sh
npm install @material/mwc-icon-button
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

![](images/standard.png)

```html
<mwc-icon-button icon="code"></mwc-icon-button>
```

### SVG or Image

![](images/svg.png)

```html
<mwc-icon-button>
  <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
</mwc-icon-button>
```

### Disabled

![](images/disabled.png)

```html
<mwc-icon-button icon="code" disabled></mwc-icon-button>
```

### Customize Colors

![](images/custom_color.png)

```css
mwc-icon-button {
  color: tomato;
}
```

## API

### Slots
| Name | Description
| ---- | -----------
| `icon` | Optional `<img>` or `<svg>` to display instead of using an icon font

### Properties/Attributes
| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `icon` | `string` | `''` | Icon to display, and `aria-label` value when `label` is not defined.
| `label` | `string` | `''` | Accessible label for the button, sets `aria-label`.
| `disabled` | `boolean` | `false` | Disabled buttons cannot be interacted with and have no visual interaction effect.

### Methods
*None*

### Events
*None*

### CSS Custom Properties

| Name | Default | Description
| ---- | ------- | -----------
| `--mdc-icon-font` | [`Material Icons`](https://google.github.io/material-design-icons/) | Font to use for the icon.
| `--mdc-theme-text-disabled-on-light` | `rgba(0, 0, 0, 0.38)` | Color of icon when `disabled` is `true`
| `--mdc-icon-button-ripple-opacity` | `0.12` | Opacity of the ripple on the icon button

## Additional references

- [MDC Web: Icon Buttons](https://material.io/develop/web/components/buttons/icon-buttons/)