# `<mwc-top-app-bar-short>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-top-app-bar-short.svg)](https://www.npmjs.com/package/@material/mwc-top-app-bar-short)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Short Top App Bars are a container for items such as application title, navigation icon, and an action item that shrinks into the corner.

For a fixed position version of this component, see [`<mwc-top-app-bar-fixed>`](http://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar-fixed)

For a scrollable version of this component, see [`<mwc-top-app-bar>`](http://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar)

[Material Design Guidelines: App Bars: Top](https://material.io/design/components/app-bars-top.html)

## Installation

```sh
npm install @material/mwc-top-app-bar-short
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

<img src="images/standard.png" height="542px">

```html
<mwc-top-app-bar-short>
    <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
    <div slot="title">Title</div>
    <mwc-icon-button icon="print" slot="actionItems"></mwc-icon-button>
    <div><!-- content --></div>
</mwc-top-app-bar-short>
```

### Always Collapsed

<img src="images/collapsed.png" height="542px">

```html
<mwc-top-app-bar-short alwaysCollapsed>
    <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
    <div slot="title">Title</div>
    <mwc-icon-button icon="print" slot="actionItems"></mwc-icon-button>
    <div><!-- content --></div>
</mwc-top-app-bar-short>
```

### Customize Colors

<img src="images/custom_colors.png" height="542px">

```css
mwc-top-app-bar-short {
  --mdc-theme-primary: orange;
  --mdc-theme-on-primary: black;
}
```

## API

### Slots
| Name | Description
| ---- | -----------
| `actionItems` | One `<mwc-icon-button>` elements to use for action icons on the right side.
| `navigationIcon` | One `<mwc-icon-button>` element to use for the left icon.
| `title` | A `<div>` or `<span>` that will be used as the title text.
| _default_ | Scrollable content to display under the bar. This may be the entire application.

### Properties/Attributes
| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `alwaysCollapsed` | `boolean` | `false` | Whether the short top app bar should always be collapsed.
| `collapsed` | `boolean` (read-only) | `false` | Whether the short top app bar is currently collapsed.
| `scrollTarget` | `HTMLElement` \| `Window` | `window` | Element used to listen for `scroll` events.

### Methods
*None*

### Events

| Name | Detail | Description
| ---- | ------ | -----------
| `MDCTopAppBar:nav` | `{}` | Fired when the `navigationIcon` is clicked.

### CSS Custom Properties

| Name | Default | Description
| ---- | ------- | -----------
| `--mdc-theme-primary` | ![](images/color_6200ee.png) `#6200ee` | Background color of the bar
| `--mdc-theme-on-primary` | ![](images/color_ffffff.png) `#ffffff` | Text color of the title, and icon colors

## Additional references

- [MDC Web: Top App Bar](https://material.io/develop/web/components/top-app-bar/)