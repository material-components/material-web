/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {LitElement, html, css} from 'lit-element/lit-element.js';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-icon-button';
import '@material/mwc-button';

class DemoHeader extends LitElement {
  static get styles() {
    return [
      css`
        a {
          text-decoration: none;
        }
        [slot="title"] {
          font-family: "Roboto Mono", monospace;
          -webkit-font-smoothing: antialiased;
          font-size: 1.25rem;
          line-height: 2rem;
          letter-spacing: 0.4px;
        }
        .white {
          --mdc-theme-primary: white;
          color: white;
        }`,
    ];
  }

  static get properties() {
    return {
      component: {type: String},
      package: {type: String},
    };
  }

  render() {
    let pkg = this.package || '';

    if (pkg.length && pkg[pkg.length -1]) {
      pkg = pkg + '/';
    }

    return html`
      <mwc-top-app-bar-fixed>
        <a href="../" slot="navigationIcon">
          <mwc-icon-button class="white" icon="arrow_back"></mwc-icon-button>
        </a>
        <span slot="title">${this.component}</span>
        <a href="https://github.com/material-components/material-components-web-components/tree/master/demos/${pkg}index.html" slot="actionItems">
          <mwc-button outlined label="View Source" class="white"></mwc-button>
        </a>
      </mwc-top-app-bar-fixed>
    `;
  }
}

customElements.define('demo-header', DemoHeader);
