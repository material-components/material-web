# Tabs

## Classes

| Class | Applied to | Purpose |
|---|---|---|
| `.tabs` | Container | Tablist container layout and paints the active indicator. |
| `.tabs-secondary` | Container | Secondary variant (applied alongside `.tabs`). |
| `.tab` | Tab element | Tab item layout, typography, and interactive states. |
| `.tab-label` | Label wrapper | Required label element inside `.tab`. Bare text is not supported. |
| `.tab-badge` | Badge element | Optional badge positioning modifier (applied alongside `.badge`). |
| `.focus-ring-inner` | Tab element | Focus ring contract for inner focus indicator styling. |
| `.ripple` | Tab element | Ripple contract for state layer styling. |
| `.selected` | Tab element | Selected tab state. Matches `[aria-selected="true"]` and `:state(selected)`. |

Selected tabs match `:is(.selected, [aria-selected="true"], :state(selected))`.

### Child DOM order

Child elements within a tab must be authored in visual order (`icon`, `label`,
`badge`) to satisfy CSS anchor geometry.

| Element | Baseline DOM | Reference element | Notes |
|---|---|---|---|
| Icon | `<md-gb-icon>` | `<md-gb-icon>` (default slot) | Unclassed child. `.tab` sets `--md-icon-*` metrics and color. |
| Label | `<span class="tab-label">` | `slot="label"` | Required. Bare text is not supported. |
| Badge | `<span class="badge tab-badge">` | `slot="badge"` | Optional badge inside a tab. |

## Baseline DOM

Baseline DOM documents the minimal markup contract (structure, roles, and
attributes) required to represent the component, rather than a feature-complete
widget.

```html
<div class="tabs" role="tablist" focusgroup="tablist inline">
  <button class="tab focus-ring-inner ripple selected" role="tab" aria-selected="true">
    <md-gb-icon>flight</md-gb-icon>
    <span class="tab-label">Flights</span>
    <span class="badge tab-badge">3</span>
  </button>
  <button class="tab focus-ring-inner ripple" role="tab" aria-selected="false">
    <span class="tab-label">Trips</span>
  </button>
</div>
```

Add `class="tabs-secondary"` alongside `.tabs` for the secondary variant. Tabs
scroll when the container overflows; there is no scrollable modifier.

### Overflow scroll setup

Hand-authored baseline DOM does not automatically scroll partially-visible tabs
into view on focus. Consumers must invoke `setupTabs()` on the tablist element
to attach the framework-agnostic focus listener:

```ts
import {setupTabs} from '@material/web/labs/gb/components/tabs/tabs.js';

const tabsElement = document.querySelector('.tabs');
setupTabs(tabsElement);
```

The reference custom element and the `tabs()` Lit directive call `setupTabs()`
automatically.

## Reference implementation

`<md-gb-tabs>` and `<md-gb-tab>` provide a reference custom element
implementation of the tabs contract.

```html
<md-gb-tabs variant="secondary">
  <md-gb-tab selected tabpanel="flights">
    <md-gb-icon>flight</md-gb-icon>
    <span slot="label">Flights</span>
    <span class="badge tab-badge" slot="badge">3</span>
  </md-gb-tab>
  <md-gb-tab tabpanel="trips">
    <span slot="label">Trips</span>
  </md-gb-tab>
</md-gb-tabs>
<md-aria-tabpanel id="flights">...</md-aria-tabpanel>
<md-aria-tabpanel id="trips">...</md-aria-tabpanel>
```

### `<md-gb-tabs>`

| API | Type | Description |
|---|---|---|
| `variant` / `.variant` | `'primary' \| 'secondary'` | Default `'primary'`. Visual variant of the tablist. |
| `autoselect` / `.autoSelect` | `boolean` | Default `false`. Automatically select a tab when focused. |
| `.selectedTab` | `HTMLElement \| null` | Currently selected tab element (or `null` if empty). |
| `selectedtabindex` / `.selectedTabIndex` | `number` | Index of the currently selected tab. |
| `.tabs` | `HTMLElement[]` | Read-only. Array of child tab elements. |
| `@change` | `Event` | Fired when tab selection changes. |
| `[default]` | Slot | Children container for `<md-gb-tab>` elements. |

#### CSS custom properties

| Custom property | Description |
|---|---|
| `--active-indicator-color` | Color of the active indicator bar. |
| `--active-indicator-height` | Height of the active indicator bar. |
| `--active-indicator-inset` | Horizontal inset of the active indicator. |
| `--active-indicator-min-length` | Minimum width of the active indicator container. |
| `--active-indicator-shape` | Border radius shape of the active indicator. |
| `--container-color` | Background color of the container. |
| `--container-height` | Minimum height of the container. |
| `--container-shape` | Border radius shape of the container. |
| `--divider-color` | Color of the bottom divider. |
| `--divider-thickness` | Thickness of the bottom divider. |

### `<md-gb-tab>`

| API | Type | Description |
|---|---|---|
| `selected` / `.selected` | `boolean` | Default `false`. Whether the tab is selected. |
| `tabpanel` / `.tabpanel` | `string` | Default `''`. ID of the associated `md-aria-tabpanel`. |
| `:state(selected)` | CSS state | Applied when the tab is selected. |
| `[default]` | Slot | Leading icon (e.g. `<md-gb-icon>`). |
| `label` | Slot | Tab label element. |
| `badge` | Slot | Optional badge (e.g. `<span class="badge tab-badge">`). |

#### CSS custom properties

| Custom property | Description |
|---|---|
| `--badge-space` | Inline space before the badge. |
| `--focus-indicator-clearance` | Clearance above indicator for focus ring. |
| `--focus-indicator-inset` | Focus ring inset. |
| `--focus-indicator-shape` | Focus ring border radius. |
| `--icon-badge-inset` | Inset for badge anchored to icon. |
| `--icon-color` | Icon color. |
| `--icon-label-space` | Inline space between icon and label. |
| `--icon-size` | Icon size. |
| `--label-text` | Typography shorthand for the label. |
| `--label-text-axes` | Variable font axes settings for the label. |
| `--label-text-color` | Label text color. |
| `--label-text-tracking` | Letter spacing for the label. |
| `--leading-space` | Inline padding at the start of the tab. |
| `--stacked-icon-label-space` | Space between stacked icon and label. |
| `--tab-scroll-margin` | Scroll margin for focus-driven scroll-into-view. |
| `--trailing-space` | Inline padding at the end of the tab. |
