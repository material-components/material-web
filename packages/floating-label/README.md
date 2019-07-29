# mwc-floating-label

> :warning: These components are a work in progress. They are pre-release and should be considered experimental, as they may undergo major changes before release. We are experimenting with alternate architectures and approaches with the goal of allowing us to bring the most correct and optimal implementation of Material components to the widest possible audiences. Visible progress may be slow, as this research is across teams and repositories so is not consistently reflected in commits to this codebase. :warning:

A [Material Components](https://material.io/components/) icon implementation using [Web Components](https://www.webcomponents.org/introduction)

## Getting started

 * The easiest way to try out mwc-floating-label is to use one of these online tools:

    * Runs in all [supported](#supported-browsers) browsers: [StackBlitz](https://stackblitz.com/edit/mwc-floating-label-example?file=index.js), [Glitch](https://glitch.com/edit/#!/mwc-floating-label-example?path=index.html)

    * Runs in browsers with [JavaScript Modules](https://caniuse.com/#search=modules): [JSBin](https://jsbin.com/qobefic/edit?html,output),
    [CodePen](https://codepen.io/jcrestel/pen/KGWBLd).

* You can also copy <!-- TODO(elephants@google.com):update link -->[this HTML file](https://gist.githubusercontent.com/JCrestel/9ed0acbd4d372a174b89cd6c58457636/raw/eadc711e5c4b89d9de3dea0d89e1d3797e0eaba3/index.html) into a local file and run it in any browser that supports [JavaScript Modules]((https://caniuse.com/#search=modules)).

* When you're ready to use mwc-floating-label in a project, install it via [npm](https://www.npmjs.com/). To run the project in the browser, a module-compatible toolctain is required. We recommend installing the [Polymer CLI](https://github.com/Polymer/polymer-cli) and using its development server as follows.

  1. Ensure the webcomponents polyfills are included in your HTML page

      - Install webcomponents polyfills

          ```npm i @webcomponents/webcomponentsjs```

      - Add webcomponents polyfills to your HTML page

          ```<script src="@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>```

  1. Add mwc-floating-label to your project:

      ```npm i @material/mwc-floating-label```

  1. Import the mwc-floating-label definition and styles into your module script:

      ```ts
      import {LitElement, html} from "@material/mwc-floating-label"
      import {floatingLabel} from "@material/mwc-floating-label"
      import {style} from '@material/mwc-floating-label/mwc-floating-label-css.js';
      ```

  1. Apply the floating label directive.

      ```ts
      class MyElement extends LitElement {
        static get styles() {
          return style;
        }

        render() {
          html`
            <input id="my-input"></input>
            <label for="my-input" .foundation=${floatingLabel()}>my label</label>
          `
        }

        floatLabel(shouldFloat) {
          const label = this.shadowRoot.querySelector('label');
          label.foundation.float(shouldFloat);
        }
      }

      customElements.define('my-element', MyElement);
      ```

  1. Install the Polymer CLI:

      ```npm i -g polymer-cli```

  1. Run the development server and open a browser pointing to its URL:

      ```polymer serve```

  > mwc-floating-label is published on [npm](https://www.npmjs.com/package/@material/mwc-floating-label) using JavaScript Modules.
  This means it can take advantage of the standard native JavaScript module loader available in all current major browsers.
  >
  > However, since mwc-floating-label uses npm convention to reference dependencies by name, a light transform to rewrite specifiers to URLs is required to get it to run in the browser. The polymer-cli's development server `polymer serve` automatically handles this transform.

  Tools like [WebPack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/) can also be used to serve and/or bundle mwc-floating-label.

## Supported Browsers

The last 2 versions of all modern browsers are supported, including
Chrome, Safari, Opera, Firefox, Edge. In addition, Internet Explorer 11 is also supported.