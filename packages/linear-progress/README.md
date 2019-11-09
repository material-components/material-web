# `<mwc-linear-progress>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-linear-progress.svg)](https://www.npmjs.com/package/@material/mwc-linear-progress)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Progress indicators express an unspecified wait time or display the length of a process.

<img src="images/standard.png" width="397px">

[Material Design Guidelines: Progress Indicators](https://material.io/components/progress-indicators/#circular-progress-indicators)

## Installation

```sh
npm install @material/mwc-linear-progress
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Determinate

<img src="images/determinate.png" height="34px">

```html
<script type="module">
  import '@material/mwc-linear-progress';
</script>
<mwc-linear-progress progress="0.5"></mwc-linear-progress>
```

### Indederminate

<img src="images/indeterminate.gif" height="77px">

```html
<mwc-linear-progress indeterminate></mwc-linear-progress>
```

### Determinate buffer

<img src="images/determinate-buffer.gif" height="45px">

```html
<mwc-linear-progress progress="0.25" buffer="0.5"></mwc-linear-progress>
```

### Reversed

<img src="images/reversed.gif" height="45px">


```html
<mwc-linear-progress
    reverse
    progress="0.25"
    buffer="0.5">
</mwc-linear-progress>
```

### Styled

<img src="images/styled.gif" height="45px">

```html
<style>
  mwc-linear-progress {
    --mdc-theme-primary: red;
    --mdc-theme-secondary: orange;
    --mdc-linear-progress-buffering-dots-image:
        url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='orange'/%3E%3C/svg%3E");
  }
</style>
<mwc-linear-progress progress="0.25" buffer="0.5"></mwc-linear-progress>
```

## API

### Slots

None

### Properties/Attributes

| Name                    | Type      | Description
| ----------------------- | --------- |------------
| `open`                  | `boolean` | Whether the linear-progress should open.
| `hideActions`           | `boolean` | Hides the actions footer of the linear-progress. Needed to remove excess padding when no actions are slotted in.
| `stacked`               | `boolean` | Whether to stack the action buttons.
| `heading`               | `string`  | Heading text of the linear-progress.
| `scrimClickAction`      | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when the linear-progress closes because the scrim was clicked (see [actions section](#actions)).
| `escapeKeyAction`       | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when the linear-progress closes because the excape key was pressed (see [actions section](#actions)).
| `defaultAction`         | `string`  | _Default: 'close'_ – Action to be emitted with the `closing` and `closed` events when `<mwc-linear-progress>.open` is toggled (see [actions section](#actions)).
| `actionAttribute`       | `string`  | _Default: 'linear-progressAction'_ – Attribute to read in light dom of linear-progress for closing action value (see [actions section](#actions)).
| `initialFocusAttribute` | `string`  | _Default: 'linear-progressInitialFocus'_ – Attribute to search for in light dom for initial focus on linear-progress open.

### Methods

| Name     | Description
| -------- | -------------
| `forceLayout() => void` | Forces linear-progress to relayout (animation frame time). May be required if linear-progress size is incorrect or if stacked layout has not been triggered correctly.
| `focus() => void` | Focuses on the initial focus element if defined (see [focus section](#focus)).
| `blur() => void` | Blurs the active element.

### Listeners
| Event Name          | Target       | Description
| ------------------- | ------------ | -----------
| `click`             | root element | Detects if clicked target is a linear-progress action.
| `resize`            | `window `    | Performs linear-progress layout (passive).
| `orientationchange` | `window`     | Performs linear-progress layout (passive).
| `keydown`           | `mwc-linear-progress` | Listens for the enter key to click the default button (passive).
| `keydown`           | `document`   | Listens for the escape key to close the linear-progress (see [`escapeKeyAction`](#properties)).

### Events

| Event Name | Target       | Detail             | Description
| ---------- | ------------ | ------------------ | -----------
| `opening`  | `mwc-linear-progress` | `{}`               | Fired when the linear-progress is beginning to open.
| `opened`   | `mwc-linear-progress` | `{}`               | Fired once the linear-progress is finished opening (after animation).
| `closing`  | `mwc-linear-progress` | `{action: string}` | Fired when the linear-progress is is beginning to close. Detail is the action that closed the linear-progress (see [actions section](#actions)).
| `closed`   | `mwc-linear-progress` | `{action: string}` | Fired once the linear-progress is finished closing (after animation). Detail is the action that closed the linear-progress (see [actions section](#actions)).

### CSS Custom Properties

| Name                                | Default               | Description
| ----------------------------------- | --------------------- |------------
| `--mdc-theme-surface`               | ![](images/color_fff.png) `#fff`                | Color of the linear-progress surface's background.
| `--mdc-linear-progress-scrim-color`          | ![](images/color_0,0,0,32.png) `rgba(0, 0, 0, 0.32)` | Color of the scrim. (**Note:** setting alpha to 0 will still make scrim clickable but transparent).
| `--mdc-linear-progress-heading-ink-color`    | ![](images/color_0,0,0,87.png) `rgba(0, 0, 0, 0.87)` | Color of the heading text.
| `--mdc-linear-progress-content-ink-color`    | ![](images/color_0,0,0,6.png) `rgba(0, 0, 0, 0.6)`  | Color applied to the projected content. (**Note:** it may also be possible to style the content via the light DOM since it is not encapsulated in a shadow root).
| `--mdc-linear-progress-scroll-divider-color` | ![](images/color_0,0,0,12.png) `rgba(0, 0, 0, 0.12)` | Color of the dividers present when linear-progress is scrollable.
| `--mdc-linear-progress-min-width`            | `280px`               | min-width ofthe linear-progress surface.
| `--mdc-linear-progress-max-width`            | `560px`               | max-width of the linear-progress surface. (**Note:** if max-width is < `560px`, there is a visual jank bug that will occur causing the max width to be `560px` when the window is sized to <= than `560px`).
| `--mdc-linear-progress-max-height`           | `calc(100% - 32px)`   | Max height of the linear-progress surface.
| `--mdc-linear-progress-shape-radius`         | `4px`                 | Corner radius of the linear-progress surface.

### Actions

Actions close the linear-progress on click. You can define an action by slotting an
element with the `linear-progressAction="..."` string attribute. The name of the
attribute can be customized by the
[`actionAttribute` property](#propertiesattributes). When a clickable element
with the `linear-progressAction` attribute is clicked, `mwc-linear-progress` will get the value
of the attribute and fire the `closing` and subsequent `closed` events with a
detail of `{action: <clickedElement.getAttribute('linear-progressAction')>}`.

For example:

<img src="images/action.png" width="566px">

```html
<mwc-linear-progress open>
  <div>
    <div>
      This is my content. Here is an actionable button:
      <button linear-progressAction="contentButton">button 1</button>
    </div>
    <div>
      This is my content. Here is a diabled actionable button:
      <button disabled linear-progressAction="disabledContentButton">button 2</button>
    </div>
  </div>
  <mwc-button slot="primaryAction" linear-progressAction="ok">ok</mwc-button>
  <mwc-button slot="secondaryAction">cancel</mwc-button>
</mwc-linear-progress>
```

In this example we have 3 actionable elements:
```html
<button linear-progressAction="contentButton">button 1</button>
```

```html
<button disabled linear-progressAction="disabledContentButton">button 2</button>
```

```html
<mwc-button slot="primaryAction" linear-progressAction="ok">ok</mwc-button>
```

* Clicking button 1 will close the linear-progress and fire a `closing` and subsequently
a `closed` event with a detail of `{action: 'contentButton'}`.
* Clicking button 2 will not close the linear-progress since it is disabled
* Clicking the cancel `mwc-button` will not close the linear-progress as it does not have
a `linear-progressAction` attribute set on it.
* Clicking the ok `mwc-button` will close the linear-progress and fire a `closing` and
subsequently a `closed` event with a detail of `{action: 'ok'}`.
* Setting `document.querySelector('mwc-linear-progress').open = false;` will close the
linear-progress and fire a `closing` and subsequently a `closed` event with a detail of
`{action: 'close'}` (action is configurable via
[`defaultAction` property](#propertiesattributes)).

### Focus

Initial focus can be set on an element with the `linear-progressInitialFocus` boolean
attribute (configurable via the
[`initialFocusAttribute` property](#propertiesattributes)).

For example:

<img src="images/initial-focus.png" width="597px">

```html
<mwc-linear-progress heading="Initial Focus" open>
  <div>
    In this example we set "linear-progressInitialFocus" on the mwc-textfield.
    When this linear-progress opens, it is auto-focused.
  </div>
  <mwc-textfield
      label="i am auto-focused"
      linear-progressInitialFocus>
  </mwc-textfield>
  <mwc-button slot="primaryAction" linear-progressAction="close">
    Primary
  </mwc-button>
  <mwc-button slot="secondaryAction" linear-progressAction="close">
    Secondary
  </mwc-button>
</mwc-linear-progress>
```

In this example we set `linear-progressInitialFocus` on the `mwc-textfield`, so
`mwc-textfield.focus()` will be called on the button. This attribute can also be
set on anything in the light DOM of `mwc-linear-progress` or the light dom of the
flattened, distributed nodes including the primary and secondary actions. Only
one element designated with this attribute will be focused.

Calling `focus()` on the `mwc-linear-progress` itself will call `focus()` on any
`linear-progressInitialFocus` element in the light DOM of `mwc-linear-progress`.

Calling `blur()` on the `mwc-linear-progress` will attempt to blur the
[`activeElement`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/activeElement)
of the shadow root of `mwc-linear-progress` or the
[root node](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode)
of the linear-progress.

## Additional references

- [MDC Web linear-progresss](https://material-components.github.io/material-components-web-catalog/#/component/linear-progress-indicator)
