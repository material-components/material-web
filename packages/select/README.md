# `<mwc-select>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-select.svg)](https://www.npmjs.com/package/@material/mwc-select)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Selects display a list of choices on temporary surfaces.

<img src="images/header.png" width="237px">

[Material Design Guidelines: exposed dropdown menus](https://material.io/components/menus/#exposed-dropdown-menu)

## Installation

```sh
npm install @material/mwc-select
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Basic (filled)

Note, `mwc-select` internally uses
[`mwc-list`](https://github.com/material-components/material-components-web-components/tree/master/packages/list),
so its main slot has the same interface as the main slot of a `mwc-list`.

<img src="images/basic.png" width="200px">
<br>
<img src="images/basic_active.png" width="235px">

```html
<mwc-select label="filled">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>

<script type="module">
  import '@material/mwc-select';
  import '@material/mwc-list/mwc-list-item';
</script>
```

### Outlined

<img src="images/outlined.png" width="200px">
<br>
<img src="images/outlined_active.png" width="236px">

```html
<mwc-select outlined label="outlined">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
```

### Preselected

<img src="images/preselected.png" width="200px">
<br>
<img src="images/preselected_active.png" width="235px">

```html
<mwc-select label="preselected">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item selected value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
```

### Required (error, validation message)

<img src="images/error.png" width="435px">
<br>
<img src="images/error_active.png" width="435px">

```html
<mwc-select
    required
    validationMessage="This Field is Required"
    label="required (error)">
  <mwc-list-item selected></mwc-list-item>
  <mwc-list-item value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
<mwc-select
    required
    validationMessage="This Field is Required"
    outlined
    label="required (error)">
  <mwc-list-item selected></mwc-list-item>
  <mwc-list-item value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
```

### Helper Text

<img src="images/helper.png" width="200px">
<br>
focused:
<br>
<img src="images/helper_focused.png" width="201px">
<br>
<img src="images/helper_active.png" width="235px">

```html
<mwc-select
    label="has helper text"
    helper="Helper Text">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item selected value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
```

### Styled

<img src="images/styled.png" width="445px">
<br>
<img src="images/styled_active.png" width="445px">

```html
<style>
  mwc-select {
    --mdc-theme-primary: blue;
    --mdc-select-fill-color: aliceblue;
    --mdc-select-label-ink-color: rgba(0, 0, 0, 0.75);
    --mdc-select-dropdown-icon-color: blue;

    --mdc-select-idle-line-color: rgba(0, 0, 255, 0.42);
    --mdc-select-hover-line-color: rgba(0, 0, 255, 0.87);

    --mdc-select-outlined-idle-border-color: rgba(0, 0, 255, 0.42);
    --mdc-select-outlined-hover-border-color: rgba(0, 0, 255, 0.87);

    /* inherits the styles of mwc-menu internally */
    --mdc-menu-item-height: 30px;
    --mdc-theme-surface: aliceblue;

    /* inherits the styles of mwc-list internally */
    --mdc-list-vertical-padding: 0px;
    --mdc-list-side-padding: 30px;
  }
</style>
<mwc-select helperPersistent helper="Helper Text" label="styled">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item selected value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
<mwc-select outlined helperPersistent helper="Helper Text" label="styled">
  <mwc-list-item></mwc-list-item>
  <mwc-list-item selected value="0">Item 0</mwc-list-item>
  <mwc-list-item value="1">Item 1</mwc-list-item>
  <mwc-list-item value="2">Item 2</mwc-list-item>
  <mwc-list-item value="3">Item 3</mwc-list-item>
</mwc-select>
```

## API

### Slots

| Name              |	Description
| ----------------- | -------------
| _default_         |	Content to display in the selects internal `<mwc-menu>` element.

`mwc-select` internally uses
[`mwc-list`](https://github.com/material-components/material-components-web-components/tree/master/packages/list),
so the default slot has the same interface as the default slot of `mwc-list`.

### Properties/Attributes

| Name                  | Type           | Default | Description
| --------------------- | -------------- | ------- |------------
| `outlined`                | `boolean`          | `false`  | Whether the select should open and display.
| `label`              | `HTMLElement|null` | `null`   | Determines which element the floating select should anchor to. In the default case, both `mwc-select` and the anchor should share a parent with `position:relative`.
| `corner`              | `Corner`*          | `"TOP_START"` | Corner of the anchor from which the select should position itself.
| `quick`               | `boolean`          | `false`  | Whether to skip the opening animation.
| `absolute`            | `boolean`          | `false`  | Makes the select's position `absolute` which will be relative to whichever ancestor has `position:relative`. Setting `x` and `y` will modify the select's `left` and `top`. Setting `anchor` will attempt to position the select to the `anchor`.
| `fixed`               | `boolean`          | `false`  | Makes the select's position `fixed` which will be relative to the window. Setting `x` and `y` will modify the select's `left` and `top`. Setting `anchor` will attempt to position the select to the `anchor`'s immediate position before opening.
| `x`                   | `number|null`      | `null`   | Modifies `left` on the select. Requires `y` not to be null.
| `y`                   | `number|null`      | `null`   | Modifies `top` on the select. Requires `x` not to be null.
| `forceGroupSelection` | `boolean`          | `false`  | Forces a select group to have a selected item by preventing deselection of select items in select groups via user interaction.
| `defaultFocus`        | `DefaultFocusState`**         | `"LIST_ROOT"` | Item to focus upon select open.
| `fullwidth`           | `boolean`          | `false`  | Sets surface width to 100%.
| `wrapFocus`           | `boolean`          | `false`  | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `wrapFocus` property.
| `innerRole`           | `"select"|"listbox"` | `"select"` | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `innerRole` property.
| `multi`               | `boolean`          | `false`  | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `multi` property.
| `activatable`         | `boolean`          | `false`  | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `activatable` property.
| `items`               | `ListItemBase[]` (readonly)       | `[]` | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `items` property.
| `index`               | `MWCListIndex` (readonly)\*\*\*   | `-1` | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `index` property.
| `selected`            | `SelectedType` (readonly)\*\*\*\* | `null` | Proxies to [`mwc-list`'s](https://github.com/material-components/material-components-web-components/tree/master/packages/list#mwc-list-1) `selected` property.

\* `Corner` is equivalent to type
`"TOP_LEFT"|"TOP_RIGHT"|"BOTTOM_LEFT"|"BOTTOM_RIGHT"|"TOP_START"|"TOP_END" |"BOTTOM_START"|"BOTTOM_END"`

\** `DefaultFocusState` is equivalent to type
`"NONE"|"LIST_ROOT"|"FIRST_ITEM"|"LAST_ITEM"`

\*** `MWCListIndex` is equivalent to type `number|Set<number>`.

\**** `SelectedType` is equivaalent to type `ListItemBase|ListItemBase[]|null`.
`ListItemBase` is the base class of `mwc-list-item` of which both
`mwc-check-list-item` and `mwc-radio-list-item` also inherit from.

### Methods

| Name     | Description
| -------- | -------------
| `show() => void`  | Sets `open` to false.
| `close() => void` | Sets `open` to true.
| `select(index: MWCSelectIndex) => void` | Selects the elements at the given index / indices.

### Events

| Event Name | Target             | Detail             | Description
| ---------- | ------------------ | ------------------ | -----------
| `opened`   | `mwc-select-surface` | none               | Fired when opened.
| `closed`   | `mwc-select-surface` | none               | Fired when closed.
| `action`   | `mwc-list`         | `ActionDetail`*    | Fired when a selection has been made via click or keyboard aciton.
| `selected` | `mwc-list`         | `SelectedDetail`** | Fired when a selection has been made. `index` is the selected index (will be of type `Set<number>` if multi and `number` if single), and `diff` (of type `IndexDiff`**) represents the diff of added and removed indices from previous selection.

\* `ActionDetail` is an interface of the following type:

### CSS Custom Properties

`mwc-select` inherits from `mwc-list`

| Name                     | Default | Description
| ------------------------ | ------- |------------
| `--mdc-select-item-height` | `48px`  | Height of single-line list-items in the select.
| `--mdc-select-min-width`   | `auto`  | Select min-width.
| `--mdc-select-max-width`   | `auto`  | Select max-width.
| `--mdc-theme-surface`    | ![](images/color_fff.png) `#fff` | Color of the select surface.

`mwc-select` internally uses
[`mwc-list`](https://github.com/material-components/material-components-web-components/tree/master/packages/list#css-custom-properties),
see the
[styling documentation](https://github.com/material-components/material-components-web-components/tree/master/packages/list#css-custom-properties)
for further details.

## Additional references

- [MDC Web selects](https://material.io/develop/web/components/selects/)
