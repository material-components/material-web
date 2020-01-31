# `<mwc-menu>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-menu.svg)](https://www.npmjs.com/package/@material/mwc-menu)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Menus display a list of choices on temporary surfaces.

<img src="images/header.png" width="240px">

[Material Design Guidelines: menus](https://material.io/design/components/menus.html)

## Installation

```sh
npm install @material/mwc-menu
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Basic

Note, `mwc-menu` internally uses
[`mwc-list`](https://github.com/material-components/material-components-web-components/tree/master/packages/list),
so its main slot has the same interface as the main slot of a `mwc-list`.

<img src="images/basic.png" width="160px">

```html
<div style="position: relative;">
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu id="menu">
    <mwc-list-item>Item 0</mwc-list-item>
    <mwc-list-item>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item>Item 3</mwc-list-item>
  </mwc-menu>
</div>

<script type="module">
  import '@material/mwc-menu';
  import '@material/mwc-list/mwc-list-item';

  // anchor must share a parent with menu that is `position: relative`
  menu.anchor = button;

  button.addEventListener('click', function (e) {
    menu.open = true;
    // alternatively you can use menu.show();
  });
</script>
```

### Activatable

<img src="images/activatable.png" width="152px">

```html
<div style="position: relative;">
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu activatable id="menu">
    <mwc-list-item>Item 0</mwc-list-item>
    <mwc-list-item selected activated>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item>Item 3</mwc-list-item>
  </mwc-menu>
</div>
```

### Multi-selectable (activatable)

<img src="images/multi.png" width="152px">

```html
<div style="position: relative;">
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu activatable multi id="menu">
    <mwc-list-item>Item 0</mwc-list-item>
    <mwc-list-item selected activated>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item selected activated>Item 3</mwc-list-item>
  </mwc-menu>
</div>
```

### Absolute

With an absolute menu, associating an `anchor` with the menu will override the
values of `x` and `y`. If an anchor is not associated with the

<img src="images/absolute.png" width="155px">

```html
<!--
  Note: no position: relative; This will make x and y relative to whatever
  ancestor is position: relative;
-->
<div>
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu absolute x="50" y="100" id="menu">
    <mwc-list-item>Item 0</mwc-list-item>
    <mwc-list-item>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item>Item 3</mwc-list-item>
  </mwc-menu>
</div>
<!-- No anchor associated -->
```

### Fixed

Fixed menus follow a similar pattern to absolute menus as associating an
`anchor` with the menu will override the values of `x` and `y`.

<img src="images/fixed.png" width="154px">

```html
<div>
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu fixed id="menu">
    <mwc-list-item>Item 0</mwc-list-item>
    <mwc-list-item>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item>Item 3</mwc-list-item>
  </mwc-menu>
</div>
<script type="module">
  import '@material/mwc-menu';
  import '@material/mwc-list/mwc-list-item';

  menu.anchor = button;

  button.addEventListener('click', function (e) {
    menu.open = true;
    // alternatively you can use menu.show();
  });
</script>
```

### Selection Groups

Adding a `group` to your `mwc-list-item`s will associate them with other
`[mwc-list-item]`s in the same group and make selection function similarly to
a radio group.

<img src="images/selection_group.png" width="170px">

```html
<style>
  /* Hide the icon of unselected menu items that are in a group */
  #menu > [mwc-list-item][group]:not([selected]) [slot="graphic"] {
    display: none;
  }
</style>
<div style="position:relative;">
  <mwc-button id="button" raised label="Open Menu"></mwc-button>

  <mwc-menu multi id="menu">
    <mwc-list-item group="a" graphic="icon">
      <mwc-icon slot="graphic">check</mwc-icon>
      <span>Item 0</span>
    </mwc-list-item>
    <mwc-list-item group="a" graphic="icon" selected>
      <mwc-icon slot="graphic">check</mwc-icon>
      <span>Item 1</span>
    </mwc-list-item>
    <mwc-list-item group="a" graphic="icon">
      <mwc-icon slot="graphic">check</mwc-icon>
      <span>Item 2</span>
    </mwc-list-item>
    <li divider role="separator"></li>
    <mwc-list-item group="b" graphic="icon" selected>
      <mwc-icon slot="graphic">check</mwc-icon>
      <span>Item 3</span>
    </mwc-list-item>
    <mwc-list-item group="b" graphic="icon">
      <mwc-icon slot="graphic">check</mwc-icon>
      <span>Item 4</span>
    </mwc-list-item>
  </mwc-menu>
</div>
```

### Styled

`mwc-menu` internally uses
[`mwc-list`](https://github.com/material-components/material-components-web-components/tree/master/packages/list),
and all CSS custom properties exposed by `mwc-list` apply here as well.

<img src="images/styled.png" width="234px">

```html
<style>
  #menu {
    --mdc-menu-min-width: 200px;
    --mdc-menu-item-height: 30px;
    --mdc-theme-surface: aliceblue;

    /* inherits the styles of mwc-list internally */
    --mdc-theme-primary: blue;
    --mdc-list-vertical-padding: 0px;
    --mdc-list-side-padding: 30px;
  }
</style>
<div style="position: relative;">
  <mwc-button id="button" raised label="Open Menu"></mwc-button>
  <mwc-menu activatable multi id="menu">
    <mwc-list-item selected activated>Item 0</mwc-list-item>
    <mwc-list-item selected activated>Item 1</mwc-list-item>
    <mwc-list-item>Item 2</mwc-list-item>
    <mwc-list-item>Item 3</mwc-list-item>
  </mwc-menu>
</div>
```

## API

### Slots

| Name              |	Description
| ----------------- | -------------
| _default_         |	Content to display in the menus internal `<mwc-list>` element.

### Properties/Attributes

| Name             | Type           | Default | Description
| ---------------- | -------------- | ------- |------------
| `activatable`    | `boolean`      | `false` | Sets `activated` attribute on selected items which provides a focus-persistent highlight.
| `rootTabbable`   | `boolean`      | `false` | When `true`, sets `tabindex="0"` on the internal menu. Otherwise sets `tabindex="-1"`.
| `multi`          | `boolean`      | `false` | When `true`, enables selection of multiple items. This will result in `index` being of type `Set<number>` and selected returning `MenuItemBase[]`.
| `wrapFocus`      | `boolean`      | `false` | When `true`, pressing `up` on the keyboard when focused on the first item will focus the last item and `down` when focused on the last item will focus the first item.
| `itemRoles`      | `string|null`  | `null`  | Determines what `role` attribute to set on all menu items.
| `innerRole`      | `string|null`  | `null`  | Role of the internal `<ul>` element.
| `noninteractive` | `boolean`      | `false` | When `true`, disables focus and pointer events (thus ripples) on the menu. Used for display-only menus.
| `items`          | `MenuItemBase[]` (readonly)* | `[]` | All menu items that are available for selection. Eligible items have the `[mwc-menu-item]` attribute.
| `selected`       | `MenuItemBase|MenuItemBase[]|null` (readonly)* | `null` | Currently-selected menu item(s). When `multi` is `true`, `selected` is of type `MenuItemBase[]` and when `false`, `selected` is of type `MenuItemBase`. `selected` is `null` when no item is selected.
| `index`          | `MWCMenuIndex` (readonly)**  | `-1` | Index / indices of selected item(s). When `multi` is `true`, `index` is of type `number` and when `false`, `index` is of type `Set<number>`. Unset indicies are `-1` and empty `Set<number>` for single and multi selection respectively.

\* `MenuItemBase` is the base class of `mwc-menu-item` of which both
`mwc-check-menu-item` and `mwc-radio-menu-item` also inherit from.

\** `MWCMenuIndex` is equivalent to type `number|Set<number>`.


### Methods

| Name     | Description
| -------- | -------------
| `select(index: MWCMenuIndex) => void` | Selects the elements at the given index / indices.
| `toggle(index: number, force?: boolean) => void` | Toggles the selected index, and forcibly selects or deselects the value of `force` if attribtue is provided.
| `layout(updateItems = true) => void` | Resets tabindex on all items and will update items model if provided true. It may be required to call layout if selectability of an element is dynamically changed. e.g. `[mwc-menu-item]` attribute is removed from a menu item or `noninteractive` is dynamically set on a menu item.

### Events

| Event Name | Target       | Detail             | Description
| ---------- | ------------ | ------------------ | -----------
| `action`  | `mwc-menu`    | `ActionDetail`*    | Fired when a selection has been made via click or keyboard aciton.
| `selected`  | `mwc-menu` | `SelectedDetail`**   | Fired when a selection has been made. `index` is the selected index (will be of type `Set<number>` if multi and `number` if single), and `diff` (of type `IndexDiff`**) represents the diff of added and removed indices from previous selection.

\* `ActionDetail` is an interface of the following type:

### CSS Custom Properties


| Name                                | Default               | Description
| ----------------------------------- | --------------------- |------------
| `--mdc-theme-text-primary-on-background` | ![](images/color_0,0,0,87.png) `rgba(0, 0, 0, 0.87)` | Color of the primary text.
| `--mdc-menu-vertical-padding` | `8px`    | Padding before and after the first and last menu items.
| `--mdc-menu-side-padding`     | `16px`   | Adjusts the padding of the `[padded]` menu dividers (also propagates to `mwc-menu-item`).
| `--mdc-menu-inset-margin`     | `72px`   | Adjusts the left inset padding of an `[inset]` menu divider. Typically used for dividing menu items with icons.

## Additional references

- [MDC Web menus](https://material.io/develop/web/components/menus/)
