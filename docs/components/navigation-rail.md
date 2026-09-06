<!-- catalog-only-start -->
<!-- ---
name: Navigation rail
title: Navigation rail
order: 19
---->
<!-- catalog-only-end -->

# Navigation rail

Navigation rails provide access to the top-level destinations of an app from
the side of a desktop or tablet layout.

> Navigation rail is currently experimental and is available under `labs`.

## Usage

Import the component and navigation tabs:

```ts
import '@material/web/labs/navigationrail/navigation-rail.js';
import '@material/web/labs/navigationtab/navigation-tab.js';
```

```html
<md-navigation-rail aria-label="Main navigation">
  <md-navigation-tab label="Home">
    <md-icon slot="active-icon">home</md-icon>
    <md-icon slot="inactive-icon">home</md-icon>
  </md-navigation-tab>
  <md-navigation-tab label="Settings">
    <md-icon slot="active-icon">settings</md-icon>
    <md-icon slot="inactive-icon">settings</md-icon>
  </md-navigation-tab>
</md-navigation-rail>
```

The rail uses `active-index` to select a destination. It emits the
`navigation-bar-activated` event when a destination changes. Arrow Up and Arrow
Down move focus between destinations; Home and End move to the first and last
destination.
