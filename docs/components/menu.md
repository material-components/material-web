<!-- catalog-only-start --><!-- ---
name: Menus
dirname: menu
-----><!-- catalog-only-end -->

<catalog-component-header>
<catalog-component-header-title slot="title">

# Menus

<!-- no-catalog-start -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'emarquez' reviewed: '2023-08-28' }
tag: 'docType:reference'
*-->

<!-- go/md-menu -->

<!-- [TOC] -->

<!-- external-only-start -->
**This documentation is fully rendered on the
[Material Web catalog](https://material-web.dev/components/menu/).**
<!-- external-only-end -->

<!-- no-catalog-end -->

[Menus](https://m3.material.io/components/menus)<!-- {.external} --> display a list of
choices on a temporary surface.

</catalog-component-header-title>

<img
    class="hero"
    alt="A phone showing a vertical threedot, pressed, icon button and a menu floating below it with the following visible items: Revert, Settings, and Send Feedback"
    src="images/menu/hero.webp">

</catalog-component-header>

*   [Design article](https://m3.material.io/components/menus) <!-- {.external} -->
*   [API Documentation](#api)
*   [Source code](https://github.com/material-components/material-web/tree/main/menu)
    <!-- {.external} -->

<!-- catalog-only-start -->

<!--

## Interactive Demo

{% playgroundexample dirname=dirname,previewHeight=1000,editorHeight=700 %}

-->

<!-- catalog-only-end -->

## Usage

When opened, menus position themselves to an anchor. Thus, either `anchor` or
`anchorElement` must be supplied to `md-menu` before opening. Additionally, a
shared parent of `position:relative` should be present around the menu and it's
anchor.

Menus also render menu items such as `md-menu-item` and handle keyboard
navigation between `md-menu-item`s as well as typeahead functionality.
Additionally, `md-menu` interacts with `md-menu-item`s to help you determine how
a menu was closed. Listen for and inspect the `close-menu` custom event's
`details` to determine what action and items closed the menu.

<!-- no-catalog-start -->

!["Two filled buttons next to each other. The first one says set with idref and
the other says set with element ref. There is an opened menu anchored to the
bottom of the right button with the items: Apple, Banana,
Cucumber."](images/menu/usage.webp)

<!-- no-catalog-end -->
<!-- catalog-include "figures/menu/usage.html" -->

```html
<!-- Note the position: relative style -->
<span style="position: relative">
  <md-filled-button id="usage-anchor">Set with idref</md-filled-button>
  <md-menu id="usage-menu" anchor="usage-anchor">
    <md-menu-item>
      <div slot="headline">Apple</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Banana</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Cucumber</div>
    </md-menu-item>
  </md-menu>
</span>

<script type="module">
  // This example uses anchor as an ID reference
  const anchorEl = document.body.querySelector('#usage-anchor');
  const menuEl = document.body.querySelector('#usage-menu');

  anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });
</script>

<span style="position: relative">
  <md-filled-button id="usage-anchor-2">Set with element ref</md-filled-button>
  <md-menu id="usage-menu-2">
    <md-menu-item>
      <div slot="headline">Apple</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Banana</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Cucumber</div>
    </md-menu-item>
  </md-menu>
</span>

<script type="module">
  // This example uses MdMenu.prototype.anchorElement to set the anchor as an
  // HTMLElement reference.
  const anchorEl = document.body.querySelector('#usage-anchor-2');
  const menuEl = document.body.querySelector('#usage-menu-2');
  menuEl.anchorElement = anchorEl;

  anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });
</script>
```

### Submenus

You can compose `<md-menu>`s inside of an `<md-sub-menu>`'s `menu` slot, but
first the `has-overflow` attribute must be set on the root `<md-menu>` to
disable overflow scrolling and display the nested submenus.

<!-- no-catalog-start -->

!["A filled button that says menu with submenus. There is a menu anchored to the
bottom of it with the first item selected that says fruits with A followed by a
right arrow. To the right is anchored a submenu with 3 items, Apricot, Avocado,
Apples. The Apples item is selected and has a left arrow before the text and
another submenu anchored to it on the left. That menu has three items, Fuji,
Granny Smith, and Red Delicious."](images/menu/usage-submenu.webp)

<!-- no-catalog-end -->
<!-- catalog-include "figures/menu/usage-submenu.html" -->

```html
<!-- Note the position: relative style -->
<span style="position: relative">
  <md-filled-button id="usage-submenu-anchor">
    Menu with Submenus
  </md-filled-button>
  <!-- Note the has-overflow attribute -->
  <md-menu has-overflow id="usage-submenu" anchor="usage-submenu-anchor">
    <md-sub-menu>
      <md-menu-item slot="item">
      <div slot="headline">Fruits with A</div>
        <!-- Arrow icons are helpful affordances -->
        <md-icon slot="end">arrow_right</md-icon>
      </md-menu-item>
      <!-- Submenu must be slotted into sub-menu's menu slot -->
      <md-menu slot="menu">
        <md-menu-item>
          <div slot="headline">Apricot</div>
        </md-menu-item>
        <md-menu-item>
          <div slot="headline">Avocado</div>
        </md-menu-item>

        <!-- Nest as many as you want and control menu anchoring -->
        <md-sub-menu
            menu-corner="start-end"
            anchor-corner="start-start">
          <md-menu-item slot="item">
            <div slot="headline">Apples</div>
            <!-- Arrow icons are helpful affordances -->
            <md-icon slot="start">
              arrow_left
            </md-icon>
          </md-menu-item>
          <md-menu slot="menu">
            <md-menu-item>
              <div slot="headline">Fuji</div>
            </md-menu-item>
            <md-menu-item>
              <div slot="headline" style="white-space: nowrap;">Granny Smith</div>
            </md-menu-item>
            <md-menu-item>
              <div slot="headline" style="white-space: nowrap;">Red Delicious</div>
            </md-menu-item>
          </md-menu>

        </md-sub-menu>
      </md-menu>
    </md-sub-menu>

    <md-menu-item>
      <div slot="headline">Banana</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Cucumber</div>
    </md-menu-item>
  </md-menu>
</span>

<script type="module">
  const anchorEl = document.body.querySelector('#usage-submenu-anchor');
  const menuEl = document.body.querySelector('#usage-submenu');

  anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });
</script>
```

### Fixed menus

Internally menu uses `position: absolute` by default. Though there are cases
when the anchor and the node cannot share a common ancestor that is `position:
relative`, or sometimes, menu will render below another item due to limitations
with `position: absolute`. In most of these cases, you would want to use the
`positioning="fixed"` attribute to position the menu relative to the window
instead of relative to the parent.

> Note: Fixed menu positions are positioned relative to the window and not the
> document. This means that the menu will not scroll with the anchor as the page
> is scrolled.

<!-- no-catalog-start -->

!["A filled button that says open fixed menu. There is an open menu anchored to
the bottom of the button with three items, Apple, Banana, and
Cucumber."](images/menu/usage-fixed.webp)

<!-- no-catalog-end -->
<!-- catalog-include "figures/menu/usage-fixed.html" -->

```html
<!-- Note the lack of position: relative parent. -->
<div style="margin: 16px;">
  <md-filled-button id="usage-fixed-anchor">Open fixed menu</md-filled-button>
</div>

<!-- Fixed menus do not require a common ancestor with the anchor. -->
<md-menu positioning="fixed" id="usage-fixed" anchor="usage-fixed-anchor">
  <md-menu-item>
    <div slot="headline">Apple</div>
  </md-menu-item>
  <md-menu-item>
    <div slot="headline">Banana</div>
  </md-menu-item>
  <md-menu-item>
    <div slot="headline">Cucumber</div>
  </md-menu-item>
</md-menu>

<script type="module">
  const anchorEl = document.body.querySelector('#usage-fixed-anchor');
  const menuEl = document.body.querySelector('#usage-fixed');

  anchorEl.addEventListener('click', () => { menuEl.open = !menuEl.open; });
</script>
```

## Accessibility

By default Menu is set up to function as a `role="menu"` with children as
`role="menuitem"`. A common use case for this is the menu button example, where
you would need to add keyboard interactions to the button to open the menu
([see W3C example](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-actions/)<!-- {.external} -->).

Menu can also be adapted for other use cases.

The role of the `md-list` inside the menu can be set with the `type` attribute.
The role of each individual `md-menu-item` can also be set with the `type`
attribute. Anything else slotted into the menu that is not a list item in most
cases should be set to `role="none"`, and `md-divider` should have
`role="separator"`.

```html
<!--
  A simplified example of an autocomplete component – missing javascript logic for interaction.
-->
<md-filled-text-field
    id="textfield"
    type="combobox"
    aria-controls="menu"
    aria-autocomplete="list"
    aria-expanded="true"
    aria-activedescendant="1"
    value="Ala">
</md-filled-textfield>
<md-menu
    id="menu"
    anchor="textfield"
    role="listbox"
    aria-label="states"
    open>
  <md-menu-item type="option" id="0">
    <div slot="headline">Alabama</div>
  </md-menu-item>
  <md-divider role="separator"></md-divider>
  <md-menu-item type="option" id="1" selected aria-selected="true">
    <div slot="headline">Alabama</div>
  </md-menu-item>
</md-menu>
```

## Theming

Menus support [Material theming](../theming/README.md) and can be customized in
terms of color. Additionally, `md-menu` composes `md-list`, and each menu item
extends `md-list-item` ([see theming documentation](./list#theming)), so most
the tokens for those components can also be used for Menu.

### Menu Tokens

Token                                     | Default value
----------------------------------------- | ------------------------------------
`--md-menu-container-color`               | `--md-sys-color-surface-container`
`--md-menu-container-shape`               | `4px`
`--md-menu-item-container-color`          | `--md-sys-color-surface-container`
`--md-menu-item-selected-container-color` | `--md-sys-color-secondary-container`

*   [Menu tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-menu.scss)
    <!-- {.external} -->
*   [Menu item tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-menu-item.scss)
    <!-- {.external} -->
*   [List tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list.scss)
    <!-- {.external} -->
*   [List item tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list-item.scss)
    <!-- {.external} -->

### Example

<!-- no-catalog-start -->

![A filled button with the text Themed menu. Attached is a 3 item menu with the
items Apple, Banana, and Cucumber. They are both in a green hue and the menu has
a sharp 0px border radius.](images/menu/theming.webp)

<!-- no-catalog-end -->
<!-- catalog-include "figures/menu/theming.html" -->

```html
<style>
  :root {
    background-color: #f4fbfa;
    --md-menu-container-color: #f4fbfa;
    --md-menu-container-shape: 0px;
    --md-sys-color-on-surface: #161d1d;
    --md-sys-typescale-body-large-font: system-ui;
  }
  md-menu-item {
    border-radius: 28px;
  }
  md-menu-item::part(focus-ring) {
    border-radius: 28px;
  }
  /* Styles for button and not relevant to menu */
  md-filled-button {
    --md-sys-color-primary: #006a6a;
    --md-sys-color-on-primary: #ffffff;
  }
</style>

<span style="position: relative">
  <md-filled-button id="theming-anchor">Themed menu</md-filled-button>
  <md-menu id="theming-menu" anchor="theming-anchor">
    <md-menu-item>
      <div slot="headline">Apple</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Banana</div>
    </md-menu-item>
    <md-menu-item>
      <div slot="headline">Cucumber</div>
    </md-menu-item>
  </md-menu>
</span>

<script type="module">
  const anchorEl = document.body.querySelector("#theming-anchor");
  const menuEl = document.body.querySelector("#theming-menu");

  anchorEl.addEventListener("click", () => {
    menuEl.show();
  });
</script>
```

<!-- auto-generated API docs start -->

## API

### MdMenu &lt;md-menu&gt;

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`anchor` | `anchor` | `string` | `''` | The ID of the element in the same root node in which the menu should align to. Overrides setting `anchorElement = elementReference`.<br>__NOTE__: anchor or anchorElement must either be an HTMLElement or resolve to an HTMLElement in order for menu to open.
`fixed` | `fixed` | `boolean` | `false` | Makes the element use `position:fixed` instead of `position:absolute`. In most cases, the menu should position itself above most other `position:absolute` or `position:fixed` elements when placed inside of them. e.g. using a menu inside of an `md-dialog`.<br>__NOTE__: Fixed menus will not scroll with the page and will be fixed to the window instead.
`quick` | `quick` | `boolean` | `false` | Skips the opening and closing animations.
`hasOverflow` | `has-overflow` | `boolean` | `false` | Displays overflow content like a submenu.<br>__NOTE__: This may cause adverse effects if you set `md-menu {max-height:...}` and have items overflowing items in the "y" direction.
`open` | `open` | `boolean` | `false` | Opens the menu and makes it visible. Alternative to the `.show()` and `.close()` methods
`xOffset` | `x-offset` | `number` | `0` | Offsets the menu's inline alignment from the anchor by the given number in pixels. This value is direction aware and will follow the LTR / RTL direction.<br>e.g. LTR: positive -> right, negative -> left RTL: positive -> left, negative -> right
`yOffset` | `y-offset` | `number` | `0` | Offsets the menu's block alignment from the anchor by the given number in pixels.<br>e.g. positive -> down, negative -> up
`listTabIndex` | `list-tabindex` | `number` | `-1` | The tabindex of the underlying list element.
`type` | `type` | `string` | `'menu'` | The role of the underlying list element.
`typeaheadDelay` | `typeahead-delay` | `number` | `200` | The max time between the keystrokes of the typeahead menu behavior before it clears the typeahead buffer.
`anchorCorner` | `anchor-corner` | `string` | `Corner.END_START` | The corner of the anchor which to align the menu in the standard logical property style of <block>-<inline> e.g. `'end-start'`.<br>NOTE: This value may not be respected by the menu positioning algorithm if the menu would render outisde the viewport.
`menuCorner` | `menu-corner` | `string` | `Corner.START_START` | The corner of the menu which to align the anchor in the standard logical property style of <block>-<inline> e.g. `'start-start'`.<br>NOTE: This value may not be respected by the menu positioning algorithm if the menu would render outisde the viewport.
`stayOpenOnOutsideClick` | `stay-open-on-outside-click` | `boolean` | `false` | Keeps the user clicks outside the menu.<br>NOTE: clicking outside may still cause focusout to close the menu so see `stayOpenOnFocusout`.
`stayOpenOnFocusout` | `stay-open-on-focusout` | `boolean` | `false` | Keeps the menu open when focus leaves the menu's composed subtree.<br>NOTE: Focusout behavior will stop propagation of the focusout event. Set this property to true to opt-out of menu's focuout handling altogether.
`skipRestoreFocus` | `skip-restore-focus` | `boolean` | `false` | After closing, does not restore focus to the last focused element before the menu was opened.
`defaultFocus` | `default-focus` | `string` | `FocusState.FIRST_ITEM` | The element that should be focused by default once opened.<br>NOTE: When setting default focus to 'LIST_ROOT', remember to change `list-tabindex` to `0` when necessary.
`typeaheadController` |  | `TypeaheadController` | `function { ... }` | Handles typeahead navigation through the menu.
`anchorElement` |  | `HTMLElement & Partial<SurfacePositionTarget>` | `undefined` | 
`items` |  | `MenuItem[]` | `undefined` | 

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Methods

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Method | Parameters | Returns | Description
--- | --- | --- | ---
`close` | _None_ | `void` | 
`show` | _None_ | `void` | 
`activateNextItem` | _None_ | `MenuItem` | Activates the next item in the menu. If at the end of the menu, the first item will be activated.
`activatePreviousItem` | _None_ | `MenuItem` | Activates the previous item in the menu. If at the start of the menu, the last item will be activated.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`opening` | Fired before the opening animation begins
`opened` | Fired once the menu is open, after any animations
`closing` | Fired before the closing animation begins
`closed` | Fired once the menu is closed, after any animations

<!-- mdformat on(autogenerated might break rendering in catalog) -->

### MdMenuItem &lt;md-menu-item&gt;

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`keepOpen` | `keep-open` | `boolean` | `false` | Keeps the menu open if clicked or keyboard selected.
`headline` | `headline` | `string` | `''` | The primary, headline text of the list item.
`supportingText` | `supporting-text` | `string` | `''` | The one-line supporting text below the headline. Set `multiLineSupportingText` to `true` to support multiple lines in the supporting text.
`multiLineSupportingText` | `multi-line-supporting-text` | `boolean` | `false` | Modifies `supportingText` to support multiple lines.
`trailingSupportingText` | `trailing-supporting-text` | `string` | `''` | The supporting text placed at the end of the item. Overridden by elements slotted into the `end` slot.
`disabled` | `disabled` | `boolean` | `false` | Disables the item and makes it non-selectable and non-interactive.
`type` | `type` | `string` | `'listitem'` | Sets the role of the list item. Set to 'nothing' to clear the role. This property will be ignored if `href` is set since the underlying element will be a native anchor tag.
`href` | `href` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
`target` | `target` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `target` attribute when `href` is set.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`close-menu` | 

<!-- mdformat on(autogenerated might break rendering in catalog) -->

### MdSubMenuItem &lt;md-sub-menu-item&gt;

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`anchorCorner` | `anchor-corner` | `string` | `Corner.START_END` | The anchorCorner to set on the submenu.
`menuCorner` | `menu-corner` | `string` | `Corner.START_START` | The menuCorner to set on the submenu.
`hoverOpenDelay` | `hover-open-delay` | `number` | `400` | The delay between mouseenter and submenu opening.
`hoverCloseDelay` | `hover-close-delay` | `number` | `400` | The delay between ponterleave and the submenu closing.
`selected` | `selected` | `boolean` | `false` | Sets the item in the selected visual state when a submenu is opened.
`keepOpen` | `keep-open` | `boolean` | `false` | Keeps the menu open if clicked or keyboard selected.
`headline` | `headline` | `string` | `''` | The primary, headline text of the list item.
`supportingText` | `supporting-text` | `string` | `''` | The one-line supporting text below the headline. Set `multiLineSupportingText` to `true` to support multiple lines in the supporting text.
`multiLineSupportingText` | `multi-line-supporting-text` | `boolean` | `false` | Modifies `supportingText` to support multiple lines.
`trailingSupportingText` | `trailing-supporting-text` | `string` | `''` | The supporting text placed at the end of the item. Overridden by elements slotted into the `end` slot.
`disabled` | `disabled` | `boolean` | `false` | Disables the item and makes it non-selectable and non-interactive.
`type` | `type` | `string` | `'listitem'` | Sets the role of the list item. Set to 'nothing' to clear the role. This property will be ignored if `href` is set since the underlying element will be a native anchor tag.
`href` | `href` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
`target` | `target` | `string` | `''` | Sets the underlying `HTMLAnchorElement`'s `target` attribute when `href` is set.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Methods

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Method | Parameters | Returns | Description
--- | --- | --- | ---
`show` | `onOpened` | `void` | Shows the submenu.
`close` | `onClosed` | `void` | Closes the submenu.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`deactivate-items` | Requests the parent menu to deselect other items when a submenu opens
`request-activation` | Requests the parent make the element focusable and focuses the item.
`deactivate-typeahead` | Requests the parent menu to deactivate the typeahead functionality when a submenu opens
`activate-typeahead` | Requests the parent menu to activate the typeahead functionality when a submenu closes
`close-menu` | 

<!-- mdformat on(autogenerated might break rendering in catalog) -->

<!-- auto-generated API docs end -->
