# mwc-notched-outline

> :warning: These components are a work in progress. They are pre-release and should be considered experimental, as they may undergo major changes before release. We are experimenting with alternate architectures and approaches with the goal of allowing us to bring the most correct and optimal implementation of Material components to the widest possible audiences. Visible progress may be slow, as this research is across teams and repositories so is not consistently reflected in commits to this codebase. :warning:

A [Material Components](https://material.io/components/) icon implementation using [Web Components](https://www.webcomponents.org/introduction)

## Getting started

 * The easiest way to try out mwc-notched-outline is to use one of these online tools:

    * Runs in all [supported](#supported-browsers) browsers: [StackBlitz](https://stackblitz.com/edit/mwc-notched-outline-example?file=index.js), [Glitch](https://glitch.com/edit/#!/mwc-notched-outline-example?path=index.html)

    * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSBin](https://jsbin.com/qobefic/edit?html,output),
    [CodePen](https://codepen.io/jcrestel/pen/KGWBLd).

* You can also copy [this HTML file](https://gist.githubusercontent.com/JCrestel/9ed0acbd4d372a174b89cd6c58457636/raw/eadc711e5c4b89d9de3dea0d89e1d3797e0eaba3/index.html) into a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

* When you're ready to use mwc-notched-outline in a project, install it via [npm](https://www.npmjs.com/). To run the project in the browser, a module-compatible toolctain is required. We recommend installing the [Polymer CLI](https://github.com/Polymer/polymer-cli) and using its development server as follows.

  1. Ensure the webcomponents polyfills are included in your HTML page

      - Install webcomponents polyfills

          ```npm i @webcomponents/webcomponentsjs```

      - Add webcomponents polyfills to your HTML page

          ```<script src="@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>```

  1. Add mwc-notched-outline to your project:

      ```npm i @material/mwc-notched-outline```

  1. Import the mwc-notched-outline definition into your HTML page:

      ```<script type="module" src="@material/mwc-notched-outline/index.js"></script>```

      Or into your module script:

      ```import {NotchedOutline} from "@material/mwc-notched-outline"```

  1. Create an instance of mwc-notched-outline in your HTML page, or via any framework that [supports rendering Custom Elements](https://custom-elements-everywhere.com/):

      ```
      <mwc-notched-outline
          .width=${widthOfNotch}
          .open=${shouldOpen}
          class="mdc-notched-outline">
        <label .foundation=${floatingLabel()} for="text-field">
          This is my label that floats in my notched outline!
        </label>
      </mwc-notched-outline>
      ```

  1. Install the Polymer CLI:

      ```npm i -g polymer-cli```

  1. Run the development server and open a browser pointing to its URL:

      ```polymer serve```

  > mwc-notched-outline is published on [npm](https://www.npmjs.com/package/@material/mwc-notched-outline) using JavaScript Modules.
  This means it can take advantage of the standard native JavaScript module loader available in all current major browsers.
  >
  > However, since mwc-notched-outline uses npm convention to reference dependencies by name, a light transform to rewrite specifiers to URLs is required to get it to run in the browser. The polymer-cli's development server `polymer serve` automatically handles this transform.

  Tools like [WebPack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/) can also be used to serve and/or bundle mwc-notched-outline.

## Supported Browsers

The last 2 versions of all modern browsers are supported, including
Chrome, Safari, Opera, Firefox, Edge. In addition, Internet Explorer 11 is also supported.