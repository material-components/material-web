# `<mwc-layout-grid>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-icon-button.svg)](https://www.npmjs.com/package/@material/mwc-layout-grid)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Material design’s responsive UI is based on a column-variate grid layout. It has 12 columns on desktop, 8 columns on tablet and 4 columns on phone.

Layout Grid Web Component encapsulates [Layout Grid](https://material.io/develop/web/components/layout-grid/) component.


## Installation

```sh
npm install @material/mwc-layout-grid
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

<img src="images/layout.png" height="88px">

```html
<mwc-layout-grid>
  <div>Content</div>
  <div>Content</div>
  <div>Content...</div>
</mwc-layout-grid>
```

Each element inside of `mwc-layout-grid` will beplaced into a single cell. Default span size for cell is 4 columns.

### Custom span size

```html
<mwc-layout-grid>
  <mwc-layout-grid-cell span="2">Content</mwc-layout-grid-cell>
  <div>Content</div>
  <div>Content...</div>
</mwc-layout-grid>
```
Use `mwc-layout-grid-cell` to define custom value for span size.

### Nested grid

When your contents need extra structure that cannot be supported by single layout grid, you can nest layout grid within each other. To nest layout grid, add a new `mwc-layout-grid` with attribute `inner` to wrap around nested content.

The nested layout grid behaves exactly like when they are not nested, e.g, they have 12 columns on desktop, 8 columns on tablet and 4 columns on phone. They also use the **same gutter size** as their parents, but margins are not re-introduced since they are living within another cell.

However, the Material Design guidelines do not recommend having a deeply nested grid as it might mean an over complicated UX.

```html
<mwc-layout-grid>
  <mwc-layout-grid inner>
    <div>Second level</div>
    <div>Second level</div>
  </mwc-layout-grid>
  <div>First level</div>
  <div>First level</div>
</mwc-layout-grid>
```


## API

### Slots
| Name | Description
| ---- | -----------
| _default_ | Component will place its children into appropriate slots at runtime.

### Properties/Attributes

`mwc-layout-grid`

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `inner` | `boolean` | `false` | Indicates whether `this` component is inner or outer one.
| `fixedColumnWidth` | `boolean` | `false` | You can designate each column to have a certain width. The column width can be specified through sass map $mdc-layout-grid-column-width or css custom properties --mdc-layout-grid-column-width-{screen_size}. The column width is set to 72px on all devices by default.
| `position` | `string` |  | The grid is by default center aligned. You can set values `left` or `right` to change this behavior. Note, these modifiers will have no effect when the grid already fills its container.

`mwc-layout-grid-cell`

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `span` | `object` |  | You can set the cells span by applying `span` attribute, where value is an integer between `1` and `12`. If the chosen span size is larger than the available number of columns at the current screen size, the cell behaves as if its chosen span size were equal to the available number of columns at that screen size. If the span classes are not set, value will fallback to a default span size of 4 columns. It is also possible to set `span` value for a specific type of device (desktop, tablet or phone). In that case value must be specified as an object in the JSON form with attribute names corresponding to device type, e.g. `{"desktop":"12", "tablet":"8", "phone":"4"}`.
| `order` | `number` |  | By default, items are positioned in the source order. However, you can reorder them by using the `order` attributes, where value is an integer between 1 and 12. Please bear in mind that this may have an impact on accessibility, since screen readers and other tools tend to follow source order.
| `align` | `string` |  | Items are defined to stretch, by default, taking up the height of their corresponding row. You can switch to a different behavior by using one of `top`, `middle` or `bottom`.

### Methods
*None*

### Events
*None*

### CSS Custom Properties

| Name | Default | Description
| ---- | ------- | -----------
| `--mdc-layout-grid-margin-desktop` | `24px` | Specifies the space between the edge of the grid and the edge of the first cell for `desktop` device.
| `--mdc-layout-grid-gutter-desktop` | `24px` | Specifies the space between edges of adjacent cells for `desktop` device.
| `--mdc-layout-grid-column-width-desktop` | `72px` | Specifies column width for `desktop` device.
| `--mdc-layout-grid-margin-tablet` | `16px` | Specifies the space between the edge of the grid and the edge of the first cell for `tablet` device.
| `--mdc-layout-grid-gutter-tablet` | `16px` | Specifies the space between edges of adjacent cells for `tablet` device.
| `--mdc-layout-grid-column-width-tablet` | `72px` | Specifies column width for `tablet` device.
| `--mdc-layout-grid-margin-phone` | `16px` | Specifies the space between the edge of the grid and the edge of the first cell for `phone` device.
| `--mdc-layout-grid-gutter-phone` | `16px` | Specifies the space between edges of adjacent cells for `phone` device.
| `--mdc-layout-grid-column-width-phone` | `72px` | Specifies column width for `phone` device.
| `--mwc-layout-grid-background` | `none` | Specifies background of grid.
| `--mwc-layout-grid-border` | `none` | Specifies border of grid.
| `--mwc-layout-grid-min-height` | `none` | Specifies minimal grid height.
| `--mwc-layout-grid-height` | `none` | Specifies grid height.
| `--mwc-layout-grid-max-height` | `none` | Specifies maximum grid height.

## Additional references

- [MDC Web: Layout Grid](https://material.io/develop/web/components/layout-grid/)
