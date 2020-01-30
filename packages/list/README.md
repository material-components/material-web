# `<mwc-list>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-list.svg)](https://www.npmjs.com/package/@material/mwc-list)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Lists are continuous, vertical indexes of text or images.

<img src="images/header.png" width="402px">

[Material Design Guidelines: lists](https://material.io/design/components/lists.html)

## Installation

```sh
npm install @material/mwc-list
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

<img src="images/basic.png" width="402px">

```html
<mwc-list>
  <mwc-list-item>Item 0</mwc-list-item>
  <mwc-list-item>Item 1</mwc-list-item>
  <mwc-list-item>Item 2</mwc-list-item>
  <mwc-list-item>Item 3</mwc-list-item>
</mwc-list>

<script type="module">
  import '@material/mwc-list/mwc-list.js';
  import '@material/mwc-list/mwc-list-item.js';
</script>
```

### Activatable

<img src="images/activatable.png" width="402px">

```html
<mwc-list activatable>
  <mwc-list-item>Item 0</mwc-list-item>
  <mwc-list-item selected activated>Item 1</mwc-list-item>
  <mwc-list-item>Item 2</mwc-list-item>
  <mwc-list-item>Item 3</mwc-list-item>
</mwc-list>
```

### Multi-selectable (activatable)

<img src="images/multi.png" width="402px">

```html
<mwc-list activatable multi>
  <mwc-list-item>Item 0</mwc-list-item>
  <mwc-list-item selected activated>Item 1</mwc-list-item>
  <mwc-list-item>Item 2</mwc-list-item>
  <mwc-list-item selected activated>Item 3</mwc-list-item>
</mwc-list>
```

### Leading Graphic

_Note_: it is not recommended to mix graphic sizes in the same list.

<img src="images/leading_graphic.png" width="402px">

```html
<style>
  /* invert icon color */
  mwc-icon {
    background-color: gray;
    color: white;
  }
</style>

<mwc-list>
  <mwc-list-item graphic="avatar">
    <span>Avatar graphic</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
  <mwc-list-item graphic="icon">
    <span>Icon graphic</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
  <mwc-list-item graphic="medium">
    <span>medium graphic</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
  <mwc-list-item graphic="large">
    <span>large graphic</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
</mwc-list>

<script type="module">
  import '@material/mwc-list/mwc-list-item.js';
  import '@material/mwc-list/mwc-list.js';
  import '@material/mwc-icon';
</script>
```

### Meta Icon

<img src="images/meta_icon.png" width="402px">

```html
<mwc-list>
  <mwc-list-item hasMeta>
    <span>Location A</span>
    <mwc-icon slot="meta">info</mwc-icon>
  </mwc-list-item>
  <mwc-list-item hasMeta>
    <span>Location B</span>
    <mwc-icon slot="meta">info</mwc-icon>
  </mwc-list-item>
  <mwc-list-item hasMeta>
    <span>Location C</span>
    <mwc-icon slot="meta">info</mwc-icon>
  </mwc-list-item>
  <mwc-list-item hasMeta>
    <span>Location D</span>
    <mwc-icon slot="meta">info</mwc-icon>
  </mwc-list-item>
</mwc-list>
```

### Two-Line

<img src="images/two_line.png" width="402px">

```html
<mwc-list>
  <mwc-list-item twoline>
    <span>Item 0</span>
    <span slot="secondary">Secondary line</span>
  </mwc-list-item>
  <mwc-list-item twoline>
    <span>Item 1</span>
    <span slot="secondary">Secondary line</span>
  </mwc-list-item>
  <mwc-list-item twoline>
    <span>Item 2</span>
    <span slot="secondary">Secondary line</span>
  </mwc-list-item>
  <mwc-list-item twoline>
    <span>Item 3</span>
    <span slot="secondary">Secondary line</span>
  </mwc-list-item>
</mwc-list>
```

### Dividers

Dividers must have the `divider` attribute and it is recommended to add
`role="separator"` for screen readers. There are 3 variants of dividers,
full-width (default), padded (respects list padding), and inset (left-padding
respects avatar and icon paddding). These variants can be mixed.

<img src="images/dividers.png" width="402px">

```html
<mwc-list>
  <mwc-list-item>Item 0</mwc-list-item>
  <li divider role="separator"></li>
  <mwc-list-item>Item 1</mwc-list-item>
  <li divider padded role="separator"></li>
  <mwc-list-item>Item 2</mwc-list-item>
  <li divider padded role="separator"></li>
  <mwc-list-item>Item 3</mwc-list-item>
  <li divider padded role="separator"></li>
  <mwc-list-item graphic="avatar">
    <span>avatar item</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
  <li divider inset padded role="separator"></li>
  <mwc-list-item graphic="avatar">
    <span>avatar item</span>
    <mwc-icon slot="graphic">folder</mwc-icon>
  </mwc-list-item>
</mwc-list>
```

### Checklist

`mwc-check-list-item` inherits from `mwc-list-item`, so it will share a similar
API to `mwc-list-item`. e.g. you can still add graphics and make them
activatable but not two-lined.

<img src="images/check_list.png" width="402px">

```html
<mwc-list multi>
  <mwc-check-list-item selected>Item 0</mwc-check-list-item>
  <mwc-check-list-item selected>Item 1</mwc-check-list-item>
  <li divider role="separator" padded></li>
  <mwc-check-list-item left selected>Item 2 (left)</mwc-check-list-item>
  <mwc-check-list-item left>Item 3 (left)</mwc-check-list-item>
</mwc-list>

<script type="module">
  import '@material/mwc-list/mwc-check-list-item.js';
  import '@material/mwc-list/mwc-list.js';
</script>
```

### Radio List

`mwc-radio-list-item` inherits from `mwc-list-item`, so it will share a similar
API to `mwc-list-item`. e.g. you can still add graphics and make them
activatable but not two-lined.

Setting `group` on the `radio-list-item` will group those `mwc-radio`s together
across the same Document.

<img src="images/radio_list.png" width="402px">

```html
<mwc-list>
  <mwc-radio-list-item group="a" seslected>Item 0</mwc-radio-list-item>
  <mwc-radio-list-item group="a">Item 1</mwc-radio-list-item>
  <li divider padded role="separator"></li>
  <mwc-radio-list-item left group="a">Item 2 (left)</mwc-radio-list-item>
  <mwc-radio-list-item left group="a">Item 3 (left)</mwc-radio-list-item>
</mwc-list>
```

### Multi Radio List

A radio list can also have `multi`.

<img src="images/multi_radio_list.png" width="402px">

```html
<mwc-list multi>
  <mwc-radio-list-item group="b">Item 0</mwc-radio-list-item>
  <mwc-radio-list-item group="b" selected>Item 1</mwc-radio-list-item>
  <li divider role="separator"></li>
  <mwc-radio-list-item group="c" selected>Item 2</mwc-radio-list-item>
  <mwc-radio-list-item group="c">Item 3</mwc-radio-list-item>
</mwc-list>
<script type="module">
  import '@material/mwc-list/mwc-radio-list-item.js';
  import '@material/mwc-list/mwc-list.js';
</script>
```

### Item Noninteractive

Setting a list-item to non-interactive will disable focus and pointer events on
the item, and it will no longer be considered for selection.

<img src="images/noninteractive.png" width="402px">

```html
<style>
  .inverted {
    background-color: gray;
    color: white;
  }
</style>
<mwc-list>
  <mwc-list-item twoline graphic="avatar" noninteractive>
    <span>User Name</span>
    <span slot="secondary">user@domain.tld</span>
    <mwc-icon slot="graphic" class="inverted">tag_faces</mwc-icon>
  </mwc-list-item>
  <li divider role="separator"></li>
  <mwc-list-item graphic="icon">
    <slot>FAQ</slot>
    <mwc-icon slot="graphic">help_outline</mwc-icon>
  </mwc-list-item>
  <mwc-list-item graphic="icon">
    <slot>Sign out</slot>
    <mwc-icon slot="graphic">exit_to_app</mwc-icon>
  </mwc-list-item>
</mwc-list>
```

### Styled

<img src="images/styled.png" width="402px">

```html
<style>
  #styled {
    --mdc-theme-primary: red;
    --mdc-list-vertical-padding: 0px;
    --mdc-list-side-padding: 30px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
<mwc-list activatable id="styled">
  <mwc-list-item selected>Item 0</mwc-list-item>
  <mwc-list-item>Item 1</mwc-list-item>
  <mwc-list-item>Item 2</mwc-list-item>
  <mwc-list-item>Item 3</mwc-list-item>
</mwc-list>
```

### Styled No-ripple

For more-control on styling, you may want to disable the ripple which is set on
`mwc-list-item`'s `::before` and `::after` pseudo-elements.

<img src="images/styled_no_ripple.png" width="402px">

```html
<style>
  /* disable ripple */
  #styledr > *::before,
  #styledr > *::after {
    display: none;
  }

  #styledr > * {
    transition: background-color .2s, color .2s;
  }

  #styledr [selected] {
    background-color: rgb(33, 33, 33);
    color: white;
  }

  #styledr [mwc-list-item]:not([selected]):hover,
  #styledr [mwc-list-item]:not([selected]):focus {
    background-color: rgba(33, 33, 33, 0.3);
  }

  #styledr [mwc-list-item]:not([selected]):active {
    background-color: rgba(33, 33, 33, 0.4);
  }

  #styledr [mwc-list-item][selected]:hover,
  #styledr [mwc-list-item][selected]:focus {
    background-color: rgba(33, 33, 33, 0.9);
  }

  #styledr [mwc-list-item][selected]:active {
    background-color: rgba(33, 33, 33, 0.8);
  }
</style>

<mwc-list id="styledr">
  <mwc-list-item selected>Item 0</mwc-list-item>
  <mwc-list-item>Item 1</mwc-list-item>
  <mwc-list-item>Item 2</mwc-list-item>
  <mwc-list-item>Item 3</mwc-list-item>
</mwc-list>
```

## API

### Slots

| Name              |	Description
| ----------------- | -------------
| `primaryAction`   |	A focusable and clickable target. Typically a button such as  `<mwc-button>`. Placed on the bottom right of the list (LTR) and above the secondary action when stacked. Automatically clicked when `Enter` key is pressed in the list.
| `secondaryAction` |	A focusable and clickable target. Typically a button such as  `<mwc-button>`. Placed immediately to the left of the `primaryAction` (LTR) or below when stacked.
| _default_         |	Content to display in the list's content area.

### Properties/Attributes

| Name                    | Type      | Description
| ----------------------- | --------- |------------
| `open`                  | `boolean` | Whether the list should open.
| `hideActions`           | `boolean` | Hides the actions footer of the list. Needed to remove excess padding when no actions are slotted in.
| `stacked`               | `boolean` | Whether to stack the action buttons.
| `heading`               | `string`  | Heading text of the list.
| `scrimClickAction`      | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when the list closes because the scrim was clicked (see [actions section](#actions)).
| `escapeKeyAction`       | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when the list closes because the excape key was pressed (see [actions section](#actions)).
| `defaultAction`         | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when `<mwc-list>.open` is toggled (see [actions section](#actions)).
| `actionAttribute`       | `string`  | _Default: 'listAction'_ – Attribute to read in light dom of list for closing action value (see [actions section](#actions)).
| `initialFocusAttribute` | `string`  | _Default: 'listInitialFocus'_ – Attribute to search for in light dom for initial focus on list open.

### Methods

| Name     | Description
| -------- | -------------
| `forceLayout() => void` | Forces list to relayout (animation frame time). May be required if list size is incorrect or if stacked layout has not been triggered correctly.
| `focus() => void` | Focuses on the initial focus element if defined (see [focus section](#focus)).
| `blur() => void`  | Blurs the active element.
| `show() => void`  | Opens the list.
| `close() => void` | Closes the list.

### Listeners
| Event Name          | Target       | Description
| ------------------- | ------------ | -----------
| `click`             | root element | Detects if clicked target is a list action.
| `resize`            | `window `    | Performs list layout (passive).
| `orientationchange` | `window`     | Performs list layout (passive).
| `keydown`           | `mwc-list` | Listens for the enter key to click the default button (passive).
| `keydown`           | `document`   | Listens for the escape key to close the list (see [`escapeKeyAction`](#properties)).

### Events

| Event Name | Target       | Detail             | Description
| ---------- | ------------ | ------------------ | -----------
| `opening`  | `mwc-list` | `{}`               | Fired when the list is beginning to open.
| `opened`   | `mwc-list` | `{}`               | Fired once the list is finished opening (after animation).
| `closing`  | `mwc-list` | `{action: string}` | Fired when the list is is beginning to close. Detail is the action that closed the list (see [actions section](#actions)).
| `closed`   | `mwc-list` | `{action: string}` | Fired once the list is finished closing (after animation). Detail is the action that closed the list (see [actions section](#actions)).

### CSS Custom Properties

| Name                                | Default               | Description
| ----------------------------------- | --------------------- |------------
| `--mdc-theme-surface`               | ![](images/color_fff.png) `#fff`                | Color of the list surface's background.
| `--mdc-list-scrim-color`          | ![](images/color_0,0,0,32.png) `rgba(0, 0, 0, 0.32)` | Color of the scrim. (**Note:** setting alpha to 0 will still make scrim clickable but transparent).
| `--mdc-list-heading-ink-color`    | ![](images/color_0,0,0,87.png) `rgba(0, 0, 0, 0.87)` | Color of the heading text.
| `--mdc-list-content-ink-color`    | ![](images/color_0,0,0,6.png) `rgba(0, 0, 0, 0.6)`  | Color applied to the projected content. (**Note:** it may also be possible to style the content via the light DOM since it is not encapsulated in a shadow root).
| `--mdc-list-scroll-divider-color` | ![](images/color_0,0,0,12.png) `rgba(0, 0, 0, 0.12)` | Color of the dividers present when list is scrollable.
| `--mdc-list-min-width`            | `280px`               | min-width ofthe list surface.
| `--mdc-list-max-width`            | `560px`               | max-width of the list surface. (**Note:** if max-width is < `560px`, there is a visual jank bug that will occur causing the max width to be `560px` when the window is sized to <= than `560px`).
| `--mdc-list-max-height`           | `calc(100% - 32px)`   | Max height of the list surface.
| `--mdc-list-shape-radius`         | `4px`                 | Corner radius of the list surface.
| `--mdc-list-box-shadow`           | mdc elevation 24      | Sets the box shadow of the list.

#### Elevation values

| Elevation Level | CSS Value
| -- | -
`24` | `0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)`

### Actions

Actions close the list on click. You can define an action by slotting an
element with the `listAction="..."` string attribute. The name of the
attribute can be customized by the
[`actionAttribute` property](#propertiesattributes). When a clickable element
with the `listAction` attribute is clicked, `mwc-list` will get the value
of the attribute and fire the `closing` and subsequent `closed` events with a
detail of `{action: <clickedElement.getAttribute('listAction')>}`.

For example:

<img src="images/action.png" width="566px">

```html
<mwc-list open>
  <div>
    <div>
      This is my content. Here is an actionable button:
      <button listAction="contentButton">button 1</button>
    </div>
    <div>
      This is my content. Here is a diabled actionable button:
      <button disabled listAction="disabledContentButton">button 2</button>
    </div>
  </div>
  <mwc-button slot="primaryAction" listAction="ok">ok</mwc-button>
  <mwc-button slot="secondaryAction">cancel</mwc-button>
</mwc-list>
```

In this example we have 3 actionable elements:
```html
<button listAction="contentButton">button 1</button>
```

```html
<button disabled listAction="disabledContentButton">button 2</button>
```

```html
<mwc-button slot="primaryAction" listAction="ok">ok</mwc-button>
```

* Clicking button 1 will close the list and fire a `closing` and subsequently
a `closed` event with a detail of `{action: 'contentButton'}`.
* Clicking button 2 will not close the list since it is disabled
* Clicking the cancel `mwc-button` will not close the list as it does not have
a `listAction` attribute set on it.
* Clicking the ok `mwc-button` will close the list and fire a `closing` and
subsequently a `closed` event with a detail of `{action: 'ok'}`.
* Setting `document.querySelector('mwc-list').open = false;` will close the
list and fire a `closing` and subsequently a `closed` event with a detail of
`{action: 'close'}` (action is configurable via
[`defaultAction` property](#propertiesattributes)).

### Focus

Initial focus can be set on an element with the `listInitialFocus` boolean
attribute (configurable via the
[`initialFocusAttribute` property](#propertiesattributes)).

For example:

<img src="images/initial-focus.png" width="597px">

```html
<mwc-list heading="Initial Focus" open>
  <div>
    In this example we set "listInitialFocus" on the mwc-textfield.
    When this list opens, it is auto-focused.
  </div>
  <mwc-textfield
      label="i am auto-focused"
      listInitialFocus>
  </mwc-textfield>
  <mwc-button slot="primaryAction" listAction="close">
    Primary
  </mwc-button>
  <mwc-button slot="secondaryAction" listAction="close">
    Secondary
  </mwc-button>
</mwc-list>
```

In this example we set `listInitialFocus` on the `mwc-textfield`, so
`mwc-textfield.focus()` will be called on the button. This attribute can also be
set on anything in the light DOM of `mwc-list` or the light dom of the
flattened, distributed nodes including the primary and secondary actions. Only
one element designated with this attribute will be focused.

Calling `focus()` on the `mwc-list` itself will call `focus()` on any
`listInitialFocus` element in the light DOM of `mwc-list`.

Calling `blur()` on the `mwc-list` will attempt to blur the
[`activeElement`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/activeElement)
of the shadow root of `mwc-list` or the
[root node](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode)
of the list.

## Additional references

- [MDC Web lists](https://material.io/develop/web/components/lists/)
