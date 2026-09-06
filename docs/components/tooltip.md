<!-- catalog-only-start --><!-- ---
name: Tooltip
dirname: tooltip
-----><!-- catalog-only-end -->

# Tooltip

`<md-tooltip>` is an experimental Material 3 tooltip in `labs`. It provides
supplementary text for a trigger on pointer hover or keyboard focus.

> This component is experimental. Its API and visual styling may change
> without a major version bump.

## Usage

Wrap one trigger element and provide its text with the `text` attribute:

```html
<md-tooltip text="Save your changes">
  <md-filled-button>Save</md-filled-button>
</md-tooltip>
```

The trigger receives `aria-describedby` automatically while the tooltip is
connected. Tooltips open on focus immediately and on pointer hover after a
short delay. Pressing Escape hides the tooltip without moving focus.

## API

| Attribute/property | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Tooltip text. |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Position relative to the trigger. |
| `delay` | `number` | `500` | Pointer-hover delay in milliseconds. |
| `open` | `boolean` | `false` | Whether the tooltip is currently visible. |

The `show()` and `hide()` methods can be used for imperative control. Rich
content can be provided with an element using `slot="content"`.
