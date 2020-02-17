# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

- `inputMode` to `mwc-textfield` and `mwc-textarea`

### Fixed

- Setting `scrollTarget` on `mwc-top-app-bar` will update listeners

### Changed

- **BREAKING:VISUAL** `mwc-tab`'s default slot now has name `icon`

## [0.13.0] - 2019-02-03

### Added

- End-alignment to `mwc-textfield` and `mwc-textarea`
- Implemented:
  - `mwc-select`
  - `mwc-menu`
  - `mwc-menu-surface`
  - `mwc-list`
  - `mwc-list-item`
- Base / utils.ts
  - `isNodeElement` - performant node -> element checking
  - `deepActiveElementPath` - finds the deepest `activeElement` node
  - `doesElementContainFocus` - determines is ancestor of `activeElement`
- `mwc-radio.global` - groups radios across document rather than shadow root
- Style underline of filled textfield
  - `--mdc-text-field-idle-line-color`
  - `--mdc-text-field-hover-line-color`

### Fixed

- Fixed mwc-dialog not removing keydown event listener on close.

## [0.12.0] - 2019-12-16

### Changed

- **BREAKING:VISUAL** Wrap mwc-button label in a slot
- Remove mwc-button border-radius from ripple
- Make mwc-button internal button overflow none

### Added

- Added custom properties to style `mwc-radio`'s colors
- CSS styling options to `mwc-tab`
- `active` attribute to `mwc-tab` when (de)activated
- Added  custom properties to style `mwc-checkbox`'s colors
- Added `show` and `close` methods to `mwc-dialog`

### Fixed

- **BREAKING:VISUAL** `mwc-tab` will now automatically size slotted images. Also
  slotted image will override icon font.

### Changed

- **BREAKING** `mwc-tab` can now only have slotted content via the
  `hasImageIcon` flag.
- **BREAKING:VISUAL** `mwc-checkbox` default display is changed from inline to inline-block.

## [0.11.1] - 2019-11-26

### Fixed

- Restore removed code in linear progress adapter

## [0.11.0] - 2019-11-26

### Added

- CSS styling options to `mwc-button`
- CSS styling options to `mwc-textfield`
- README for `mwc-drawer`
- README for `mwc-checkbox`
- README for `mwc-formfield`
- Demo for `mwc-drawer` without a header in the drawer
- `--mdc-icon-button-size` and `--mdc-icon-size` to `mwc-icon-button`

### Changed

- **BREAKING** `Dialog.title` renamed to `Dialog.heading` and
  `--mdc-dialog-title-ink-color` renamed to `--mdc-dialog-heading-ink-color` as
  it caused clashes with `HTMLElement.prototype.title`.
- Updated material dependencies to `4.0.0-canary.735147131.0`.
- **BREAKING** `Slider.discrete` removed and `Slider.pin` added.
- `mwc-dialog` will now search its flattened distributed nodes and their trees
  for a focusable element.
- **BREAKING** `mwc-slider` now emits bubbling and composed `input` and `change`
  events instead of `MDCSlider:input` and `MDCSlider:change`.
- **BREAKING:VISUAL** the digits inside the `Slider`'s pin will be rounded to at
  most 3 decimal digits.
- **BREAKING** `LinearProgress.determinate = false` removed in favor of `LinearProgres.indeterminate = false`.
- **BREAKING** `LinearProgress.buffer = 0` default value changed to `1`.
- **BREAKING:VISUAL** `mwc-linear-progress` had `--mdc-theme-secondary` applied
  to its buffer bar's background color. This custom property's name was changed
  to `--mdc-linear-progress-buffer-color`.
- **BREAKING:VISUAL** the digits inside the `Slider`'s pin will be rounded to at
  most 3 decimal digits.
- **BREAKING** `LinearProgress.determinate = false` removed in favor of `LinearProgres.indeterminate = false`.
- **BREAKING** `LinearProgress.buffer = 0` default value changed to `1`.
- **BREAKING:VISUAL** `mwc-linear-progress` had `--mdc-theme-secondary` applied
  to its buffer bar's background color. This custom property's name was changed
  to `--mdc-linear-progress-buffer-color`.
- **BREAKING** `mwc-icon-button` will now use its default slot for `<img>` or
  `<svg>` icons instead of a named "icon" slot.

### Fixed
- Fixed checkbox ripple visibility when focused while being unchecked.
- Fixed app content not being expanded inside drawer.
- Fixed issue where slider when resized or scrolled will not respond to touch
  as expected.
- Fixed issue where `mwc-ripple` would not ripple when parent was a shadow root
- **BREAKING:VISUAL** Fixed sizing of the `mwc-icon-button` in `mwc-snackbar`
- Fixed `mwc-icon-button` icon at end layout.
- `mwc-slider` can now have its pin and markers added and changed
  dynamically.
- Fixed `mwc-icon-button` icon at end layout.
- `mwc-slider` can now have its pin and markers added and changed
  dynamically.
- Fixed `mwc-dialog` race-condition bug with the blocking elements polyfill that
  could occur if the dialog was disconnected before it had finished opening.
- Fixed `mwc-button` alignment issues when some buttons have icons and others do
  not.

## [0.10.0] - 2019-10-11

### Added

- `mwc-textfield` ink and fill css variables

### Changed

- **BREAKING** Removed `mwc-icon-font.js` import. Most users should load the
  Material Icons and Roboto fonts by adding the following to their HTML file:

  ```html
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
  ```

  See the [Fonts](https://github.com/material-components/material-components-web-components#fonts)
  section of the README for more details.

- **BREAKING** Moved `@material/mwc-textfield/character-counter/mwc-character-counter-directive.js`
  to `@material/mwc-textfield/mwc-character-counter-directive.js`.

### Fixed

- Fixed `mwc-dialog`'s issues with working on older browsers.
- `<mwc-radio>` groups are now correctly synchronized when stamped using a
  lit-html `map` or `repeat`, and any other time the radio is not created and
  connected at the same time ([#282](https://github.com/material-components/material-components-web-components/issues/282)).

## [0.9.1] - 2019-09-30

### Fixed

- Fixed missing `@material/mwc-base` dep on `@material/mwc-dialog`.

## [0.9.0] - 2019-09-26

### Added

- Implemented `mwc-dialog`
- `mwc-textfield.layout` method.

### Changed

- **BREAKING:** Added custom `.focus()` and `.blur()` functions to mwc-button
  that cause the button to ripple as when tab focusing.
- **BREAKING:** mwc-textfield's custom `.focus()` function will now call
  `.focus()` on the native internal input causing the caret to appear instead of
  just forcing focus styles to appear.
- **BREAKING:** mwc-textfield's custom `.blur()` function will now call
  `.blur()` on the native internal input instead of just forcing focus styles to
  disapprear.
- **BREAKING** `mwc-base/base-element` no longer exports any of the
  `lit-element` or `lit-html` APIs (e.g. `LitElement`, `customElement`,
  `classMap`). Users should import directly from the `lit-element` and
  `lit-html` modules instead.
- **BREAKING** `mwc-textfield` and `mwc-textarea` will now update their `.value`
  on the native `input`'s `input` event instead of `change`.

### Fixed

- `<mwc-drawer>` can now be used with Rollup (via version bump to pick up
  [WICG/inert#135](https://github.com/WICG/inert/pull/135)).
- `<mwc-textfield>` and `<mwc-textarea>` will now have the same height between
  their filled and outlined variants with helper text on older browsers.
- `mwc-textfield[required]` and `mwc-textarea[required]` will now have their
  required asterisk colored correctly when customized.
- `<mwc-textfield>` and `<mwc-textarea>` can now have basic usability in IE.
- `mwc-textarea[disabled][outlined]` will no longer have a filled-in background
  as is per material spec.
- `mwc-textarea[disabled]label="string!"][value="string!"]` will now float the
  label to the correct spot.


## [0.8.0] - 2019-09-03

### Changed

- Published JavaScript files no longer include inlined TypeScript helpers such
  as `__decorate`. Instead, helpers are now imported from the
  [`tslib`](https://github.com/microsoft/tslib) module dependency. This reduces
  code size by allowing multiple components to share the same helpers, and
  eliminates *"this has been rewritten to undefined"* errors from Rollup.
  ([#439](https://github.com/material-components/material-components-web-components/pull/439))

- **BREAKING** Renamed component *`base`* modules:
  ([#440](https://github.com/material-components/material-components-web-components/pull/440)):
  - `icon-button-toggle-base.ts` → `mwc-icon-button-toggle-base.ts`
  - `icon-button-base.ts` → `mwc-icon-button-base.ts`
  - `top-app-bar-fixed-base.ts` → `mwc-top-app-bar-fixed-base.ts`

## [0.7.1] - 2019-08-27

### Added
- Added "module" field in all packages' `package.json` manifests
  ([#434](https://github.com/material-components/material-components-web-components/pull/434))

## [0.7.0] - 2019-08-27

### Added
- New components:
  - [`<mwc-textfield>`](https://github.com/material-components/material-components-web-components/tree/master/packages/textfield) ([#297](https://github.com/material-components/material-components-web-components/pull/297))
  - [`<mwc-textarea>`](https://github.com/material-components/material-components-web-components/tree/master/packages/textarea) ([#297](https://github.com/material-components/material-components-web-components/pull/297))
  - [`<mwc-icon-button-toggle>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button-toggle) ([#370](https://github.com/material-components/material-components-web-components/pull/370))
  - [`<mwc-top-app-bar-fixed>`](https://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar-fixed) ([#379](https://github.com/material-components/material-components-web-components/pull/379))

- Added support for `<svg>` and `<img>` icons to `<mwc-icon-button>` and
  `<mwc-icon-button-toggle>`.
  ([#358](https://github.com/material-components/material-components-web-components/pull/358))

- Added `--mdc-snackbar-action-color` CSS custom property to `<mwc-snackbar>` to
  override the default action button color
  ([#354](https://github.com/material-components/material-components-web-components/pull/354)).

- Added a default slot to `<mwc-top-app-bar>` and `<mwc-top-app-bar-fixed>`
  which takes page content and automatically applies the correct `padding-top`
  ([#370](https://github.com/material-components/material-components-web-components/pull/370)).

- Added documentation for:
  - [`<mwc-button>`](https://github.com/material-components/material-components-web-components/tree/master/packages/button)
    ([#366](https://github.com/material-components/material-components-web-components/pull/366))
  - [`<mwc-fab>`](https://github.com/material-components/material-components-web-components/tree/master/packages/fab)
    ([#361](https://github.com/material-components/material-components-web-components/pull/361))
  - [`<mwc-icon-button>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button)
    ([#370](https://github.com/material-components/material-components-web-components/pull/370))
  - [`<mwc-radio>`](https://github.com/material-components/material-components-web-components/tree/master/packages/radio)
    ([#377](https://github.com/material-components/material-components-web-components/pull/377))
  - [`<mwc-snackbar>`](https://github.com/material-components/material-components-web-components/tree/master/packages/snackbar)
    ([#355](https://github.com/material-components/material-components-web-components/pull/355))
  - [`<mwc-top-app-bar>`](https://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar)
    ([#379](https://github.com/material-components/material-components-web-components/pull/379))

### Changed
- **BREAKING** The Material Icons font is no longer loaded automatically
  ([#314](https://github.com/material-components/material-components-web-components/pull/314)).
  This allows more control over how fonts are loaded (e.g. serving fonts from a
  different server, or loading multiple fonts with a single request). Most users
  should now add tags like this to their HTML page:

  ```html
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
  ```

- **BREAKING** The *toggling* behavior of `<mwc-icon-button>` has been removed
  (i.e. `offIcon`), and is now instead supported by the dedicated
  [`<mwc-icon-button-toggle>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button-toggle)
  component
  ([#370](https://github.com/material-components/material-components-web-components/pull/370)).


- **BREAKING** The *short* layout for `<mwc-top-app-bar>` has been removed, and
  is no longer supported because it is not part of the Material Design
  specification
  ([#422](https://github.com/material-components/material-components-web-components/pull/422)).


- **BREAKING** The *fixed* layout for `<mwc-top-app-bar>` has been removed, and
  is now instead implemented by the dedicated `<mwc-top-app-bar-fixed>`
  component
  ([#379](https://github.com/material-components/material-components-web-components/pull/379)).

### Fixed

- Fixed bug where `<mwc-snackbar>` `open` method threw if called immediately
  after construction (before `firstUpdated`)
  ([#356](https://github.com/material-components/material-components-web-components/pull/356)).
- Fixed bug where setting the `<mwc-snackbar>` `labelText` property could throw
  an exception and fail to render
  ([#412](https://github.com/material-components/material-components-web-components/pull/412)).
- Buttons slotted into `<mwc-snackbar>` now render with the correct default
  styles
  ([#354](https://github.com/material-components/material-components-web-components/pull/354)).
- Fixed layout issue affecting scrolling `<mwc-tab-bar>` in Firefox
  ([#349](https://github.com/material-components/material-components-web-components/pull/349)).
- Fixed bug where `<mwc-icon>` icons did not render in IE11
  ([#353](https://github.com/material-components/material-components-web-components/pull/353)).
- Fixed bug where setting the `checked` property on an `<mwc-radio>` did not
  result in the other radios in the group becoming unchecked
  ([#373](https://github.com/material-components/material-components-web-components/pull/373)).
- Fixed bug where `<mwc-drawer>` did not work in IE
  ([WICG/inert#129](https://github.com/WICG/inert/pull/129)).
- Fixed `dense` and `prominent` styling bugs in `<mwc-top-app-bar>`
  ([#379](https://github.com/material-components/material-components-web-components/pull/379)).

## [0.6.0] - 2019-06-05
- Upgrade lerna to 3.x
- Upgrade typescript to 3.4, add config for tsbuildinfo files needed for incremental compilation mode
- Add README notes that component set is in experimental status.
- Remove draft components, simplify package listing.
- Prepare drawer, icon-button, linear-progress, slider, snackbar, tab components, and top-app-bar for release.
- Fix typing for event listeners in adapters due to typescript update.
- Add wicg-inert and blocking-elements dependencies to mwc-drawer

## [0.5.0] - 2019-03-26
- Update to mdc 1.0
- Rewrite Adapters and Foundations with Typescript types
- Disable pointer-events on disabled buttons

## [0.4.0] - 2019-03-11
- Update to mdc 0.44
- fix button label issues

## [0.3.6] - 2019-02-05
- Use `static get styles()` on all components
- Clean up dependencies
- Implement drawer focus trapping
- Add tests
- Setup travis CI
- Update to lit-html 1.0

## [0.3.5] - 2019-01-11
- Update lit and lit-element dependencies
- Publish mwc-drawer

## [0.3.4] - 2018-12-13
- Update to lit-element 0.6.5 and lit-html 1.0.0-rc.1

## [0.3.3] - 2018-12-03
- Fix ripple directive for lit-html 0.13

## [0.3.2] - 2018-11-16
- Move event listeners to the class with lit-element 0.6.2
- Add `@eventOptions({passive: true})` to event handlers in tab-bar-scroller
  - More efficient scrolling behavior, as `preventDefault` is never called
- Implement icon-button in typescript

## [0.3.1] - 2018-10-08
- Fix demo publishing
- Update to lit-element 0.6.2
- Add dependencies to lit-html where necessary
- Add explicit `.js` endings to imports, where necessary
- Fill in CHANGELOG

## [0.3.0] - 2018-10-04
- Rewrite elements in typescript
- Add `ripple` lit directive to add a material ripple to any component
- Add `@observe` decorator to tie data changes into base MDC Foundation handlers
- Add a watcher for styling and typescript changes

## [0.2.1] - 2018-09-21
- Update to lit-element 0.6.1

## [0.2.0] - 2018-09-13
- Use lit-element 0.6

## [0.1.2] - 2018-06-14
- Use lit-element 0.5

## [0.1.1] - 2018-05-09
- Add READMEs and examples

## [0.1.0] - 2018-05-08
- Initial WIP of components
