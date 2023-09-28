<!-- catalog-only-start --><!-- ---
name: Quick Start
title: Quick Start
order: 2
-----><!-- catalog-only-end -->

# Quick start

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2023-09-28' }
tag: 'docType:gettingStarted'
*-->

<!-- go/mwc-quick-start -->

<!-- [TOC] -->

## Install

<!--#include file="../googlers/quick-start-install.md" -->

Install Material web components using
[npm and node](https://nodejs.org)<!-- {.external} -->.

```shell
npm install @material/web
```

## Import

Import element definitions from
`@material/web/<component>/<component-variant>.js`.

```js
// index.js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
```

<!--#include file="../googlers/quick-start-import.md" -->

## Usage

Use the `<component-name>` tag in HTML markup. Refer to the
[component docs](components/) for more guidance on using each component.

[Playground](https://lit.dev/playground/#gist=37d28012c5ec6de30809bdf4a6e26cb6)<!-- {.external} -->

```html
<script type="module" src="./index.js"></script>

<label>
  Material 3
  <md-checkbox checked></md-checkbox>
</label>

<md-outlined-button>Back</md-outlined-button>
<md-filled-button>Next</md-filled-button>
```

## Building

<!--#include file="../googlers/quick-start-build.md" -->

Material web components uses bare module specifiers that must be resolved with
tools until [import maps](https://github.com/WICG/import-maps)<!-- {.external} --> are
adopted.

We recommend following
[lit.dev's modern build for production](https://lit.dev/docs/tools/production/#modern-only-build)<!-- {.external} -->
for a more in-depth build guide.

### Rollup quick start

For a quick start, we recommend using [Rollup](https://rollupjs.org/)<!-- {.external} -->
to resolve bare module specifiers into a bundled file.

Install Rollup and a plugin to resolve bare module specifiers.

```shell
npm install rollup @rollup/plugin-node-resolve
```

Create a bundle from an entrypoint `index.js` file and use it in a `<script>`
`"src"` attribute.

```shell
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

```html
<script src="./bundle.js"></script>
```
