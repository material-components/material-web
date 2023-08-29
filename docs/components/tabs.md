<!-- catalog-only-start --><!-- ---
name: Tabs
dirname: tabs
-----><!-- catalog-only-end -->

<catalog-component-header image-align="start">
<catalog-component-header-title slot="title">

# Tabs

<!-- no-catalog-start -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: {
  owner: 'lizmitchell'
  owner: 'ajakubowicz'
  reviewed: '2023-08-25'
}
tag: 'docType:reference'
*-->

<!-- go/md-tabs -->

<!-- [TOC] -->

<!-- external-only-start -->
**This documentation is fully rendered on the
[Material Web catalog](https://material-web.dev/components/tabs/)**
<!-- external-only-end -->

<!-- no-catalog-end -->

[Tabs](https://m3.material.io/components/tabs)<!-- {.external} --> organize groups of
related content that are at the same level of hierarchy.

</catalog-component-header-title>

<img
  class="hero"
  src="images/tabs/hero.png"
  alt="Media gallery screen with tabs labeled 'Video', 'Photos', and 'Audio'.">

</catalog-component-header>

*   [Design article](https://m3.material.io/components/tabs) <!-- {.external} -->
*   API Documentation (*coming soon*)
*   [Source code](https://github.com/material-components/material-web/tree/main/tabs)
    <!-- {.external} -->

## Types

1.  [Primary tabs](#primary-tabs)
1.  [Secondary tabs](#secondary-tabs)

<!-- catalog-only-start -->

<!--

## Interactive Demo

{% playgroundexample dirname=dirname %}

-->

<!-- catalog-only-end -->

## Usage

Tabs contain multiple primary or secondary tab children. Use the same type of
tab in a tab bar.

<!-- no-catalog-start -->
<!-- TODO: add image -->
<!-- no-catalog-end -->
<!-- TODO: catalog-include "figures/<component>/usage.html" -->

```html
<md-tabs>
  <md-primary-tab>Video</md-primary-tab>
  <md-primary-tab>Photos</md-primary-tab>
  <md-primary-tab>Audio</md-primary-tab>
</md-tabs>

<md-tabs>
  <md-secondary-tab>Birds</md-secondary-tab>
  <md-secondary-tab>Cats</md-secondary-tab>
  <md-secondary-tab>Dogs</md-secondary-tab>
</md-tabs>
```

### Selection

To observe changes to tab selections, add an event listener to `<md-tabs>`,
listening for the `change` event.

```ts
tabs.addEventListener('change', (event: Event) => {
  if (event.target.selected === 2) {
    // ... perform logic only if index of selected item is 2.
  }
});
```

### Icons

Tabs may optionally show an icon.

Icons communicate the type of content within a tab. Icons should be simple and
recognizable.

<!-- no-catalog-start -->
<!-- TODO: add image -->
<!-- no-catalog-end -->
<!-- TODO: catalog-include "figures/<component>/usage.html" -->

```html
<md-tabs>
  <md-primary-tab>
    <md-icon slot="icon">piano</md-icon>
    Keyboard
  </md-primary-tab>
  <md-primary-tab>
    <md-icon slot="icon">tune</md-icon>
    Guitar
  </md-primary-tab>
</md-tabs>
```

## Primary tabs

<!-- go/md-primary-tab -->

Primary tabs are placed at the top of the content pane under a top app bar. They
display the main content destinations.

<!-- no-catalog-start -->
<!-- TODO: add image -->
<!-- no-catalog-end -->
<!-- TODO: catalog-include "figures/<component>/usage.html" -->

```html
<md-tabs>
  <md-primary-tab>
    <md-icon slot="icon">piano</md-icon>
    Keyboard
  </md-primary-tab>
  <md-primary-tab>
    <md-icon slot="icon">tune</md-icon>
    Guitar
  </md-primary-tab>
</md-tabs>
```

## Secondary tabs

<!-- go/md-secondary-tab -->

Secondary tabs are used within a content area to further separate related
content and establish hierarchy.

<!-- no-catalog-start -->
<!-- TODO: add image -->
<!-- no-catalog-end -->
<!-- TODO: catalog-include "figures/<component>/usage.html" -->

```html
<md-tabs>
  <md-secondary-tab inline-icon>
    <md-icon slot="icon">flight</md-icon>
    Travel
  </md-secondary-tab>
  <md-secondary-tab inline-icon>
    <md-icon slot="icon">hotel</md-icon>
    Hotel
  </md-secondary-tab>
  <md-secondary-tab inline-icon>
    <md-icon slot="icon">hiking</md-icon>
    Activities
  </md-secondary-tab>
</md-tabs>
```

<!-- TODO: ## Accessibility -->

## Theming

Tabs supports [Material theming](../theming.md) and can be customized in terms
of color, typography, and shape.

### Primary tab tokens

Token                                     | Default value
----------------------------------------- | -----------------------------------
`--md-primary-tab-container-color`        | `--md-sys-color-surface`
`--md-primary-tab-label-text-type`        | `500 0.875rem/1.25rem Roboto`
`--md-primary-tab-active-indicator-color` | `--md-sys-color-primary`
`--md-primary-tab-icon-color`             | `--md-sys-color-on-surface-variant`
`--md-primary-tab-container-shape`        | `0px`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-primary-tab.scss)
    <!-- {.external} -->

### Primary tab example

<!-- no-catalog-start -->

![Image of tabs with a different theme applied](images/tabs/theming.png "Tab theming example.")

<!-- no-catalog-end -->

```html
<style>
:root {
  /* System tokens */
  --md-sys-color-surface: #f7faf9;
  --md-sys-color-primary: #005353;

  /* Component tokens */
  --md-primary-tab-label-text-type: 0.8em cursive, system-ui;
}
</style>

<md-tabs>
  <md-primary-tab>Tab 1</md-primary-tab>
  <md-primary-tab>Tab 2</md-primary-tab>
  <md-primary-tab>Tab 3</md-primary-tab>
</md-tabs>
```

### Secondary tab tokens

Token                                       | Default value
------------------------------------------- | -------------
`--md-secondary-tab-container-color`        | `--md-sys-color-surface`
`--md-secondary-tab-label-text-type`        | `500 0.875rem/1.25rem Roboto`
`--md-secondary-tab-active-indicator-color` | `--md-sys-color-primary`
`--md-secondary-tab-icon-color`             | `--md-sys-color-on-surface-variant`
`--md-secondary-tab-container-shape`        | `0px`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-secondary-tab.scss)
    <!-- {.external} -->

### Secondary tab example

<!-- no-catalog-start -->
<!-- TODO: add image -->
<!-- no-catalog-end -->

```html
<style>
:root {
  /* System tokens */
  --md-sys-color-surface: #f7faf9;
  --md-sys-color-primary: #005353;

  /* Component tokens */
  --md-secondary-tab-label-text-type: 0.8em cursive, system-ui;
}
</style>

<md-tabs>
  <md-secondary-tab>Tab 1</md-secondary-tab>
  <md-secondary-tab>Tab 2</md-secondary-tab>
  <md-secondary-tab>Tab 3</md-secondary-tab>
</md-tabs>
```
