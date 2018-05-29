# Material Web Components

> :warning: These components are still a work in progress. Not all elements are available on NPM yet. We are working on the remaining elements and publish them to the NPM registry once we have a first working version. :warning:

Material Web Components helps developers execute [Material Design](https://www.material.io) using [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

Built on top of the [Material Components Web](https://github.com/material-components/material-components-web) project and [LitElement](https://github.com/polymerlabs/lit-element), the Material Web Components enable a reliable development workflow to build beautiful and functional web projects.

Web Components can be seamlessly incorporated into a wide range of usage contexts. Whether you're already heavily invested in another framework or not, it's easy to incorporate Material Web Components into your site in a lightweight, idiomatic fashion.

<!-- TODO
Insert screenshot of a demo page, including a code snippet.
-->

**[Demos](https://material-components.github.io/material-components-web-components/demos/index.html)**

## Quick start

> Note: This guide assumes you have npm installed locally.

The easiest way to try out the Material Web Components is to use one of these online tools:

  * Runs in all [supported browsers](#browser-support): [Glitch](https://glitch.com/edit/#!/material-web-components)

  * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSBin](http://jsbin.com/gitufet/edit?html,output), [CodePen](https://codepen.io/sorvell/pen/MGrZqp?editors=1000).

Or you can also copy [this HTML file](https://gist.githubusercontent.com/sorvell/2ec11ccde449815bc97edc1026be27a9/raw/8bab65dd5d15f657ae69493851690c5564367d13/index.html) into a local file and run it in any browser that supports JavaScript Modules.

When you're ready to use the Material Web Components in your web application:

1. Ensure the webcomponents polyfills are included in your HTML page

      - Install webcomponents polyfills

          ```npm i @webcomponents/webcomponentsjs```

      - Add webcomponents polyfills to your HTML page

          ```<script src="@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>```

  1. Add one of the MWC elements to your project, for example for icon:

      ```npm i @material/mwc-icon```

  1. Import the element definition into your HTML page:

      ```<script type="module" src="@material/mwc-icon/index.js"></script>```

      Or into your module script:

      ```import {Icon} from "@material/mwc-icon"```

  1. Create an instance of element in your HTML page, or via any framework that [supports rendering Custom Elements](https://custom-elements-everywhere.com/):

      ```<mwc-icon>sentiment_very_satisfied</mwc-icon>```

  1. Install the Polymer CLI:

      ```npm i -g polymer-cli```

  1. Run the development server and open a browser pointing to its URL:

      ```polymer serve```

  > The Material Web Components are published on [npm](https://www.npmjs.com) using JavaScript Modules.
  This means it can take advantage of the standard native JavaScript module loader available in all current major browsers.
  >
  > However, since the Material Web Components use npm convention to reference dependencies by name, a light transform to rewrite specifiers to URLs is required to get it to run in the browser. The polymer-cli's development server `polymer serve` automatically handles this transform.

  Tools like [WebPack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/) can also be used to serve and/or bundle.

## Contributing guide
Below are instructions for setting up project development.

1. `git clone` this repo
1. install dependencies by running `npm run bootstrap`
1. to run a development server: `npm run dev` (view the demos by accessing `<dev server url>`/demos/index.html)
1. to run tests: `npm run test`

### Rebuild CSS for components

Components define their css using [SASS](http://sass-lang.com/). The SASS output is built into a javascript module which exports the component's styling as a [lit-html](https://github.com/Polymer/lit-html) template.

To compile the component SASS run:

  ```
  npm run update-styling
  ```

## Useful Links

- [All Components](packages/)
- [Demos](https://material-components.github.io/material-components-web-components/demos/index.html)
- [Contributing](CONTRIBUTING.md)
- [Material.io](https://www.material.io) (external site)
- [Material Design Guidelines](https://material.io/guidelines) (external site)

## Browser Support

We officially support the last two versions of every major browser. Specifically, we test on the following browsers:

- Chrome
- Safari
- Firefox
- IE 11/Edge
- Opera
- Mobile Safari
- Chrome on Android
