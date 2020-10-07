/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

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
import {style as elevationStyle} from '@material/mwc-elevation-overlay/mwc-elevation-overlay-css';
import {LitElement, css, html} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';

import '../shared/demo-header';

addEventListener('load', function() {
 document.body.classList.remove('unresolved');
});

class MyElement extends LitElement {
  static get styles() {
    return [
      elevationStyle,
      css`
        :host([elevation='0']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 0;
        }
        :host([elevation='1']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 5%;
        }
        :host([elevation='2']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 7%;
        }
        :host([elevation='3']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 8%;
        }
        :host([elevation='4']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 9%;
        }
        :host([elevation='6']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 11%;
        }
        :host([elevation='8']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 12%;
        }
        :host([elevation='12']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 14%;
        }
        :host([elevation='16']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 15%;
        }
        :host([elevation='24']) .overlay-wrapper {
          --mdc-elevation-overlay-opacity: 16%;
        }

        :host {
          background-color: #212121;
          display: inline-flex;
          padding: 8px;
          min-width: 200px;
          min-height: 200px;
          align-items: center;
          justify-content: center;
          color: #eeeeee;
          flex-direction: column;
          box-sizing: border-box;
        }

        .controls {
          margin-top: 8px;
        }

        .overlay-wrapper{
          width: 150px;
          height: 150px;
          position: relative;
          border-radius: 8px;
          padding: 8px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, .24);
        }
      `,
    ];
  }

  static get properties() {
    return {
      elevation: {
        type: Number,
        reflect: true,
      },
      color: {
        type: String,
      },
      width: {
        type: String,
      },
      height: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.elevation = 0;
    this.color = '#FFFFFF';
    this.width = '100%';
    this.height = '100%';
  }

  render() {
    const styles = {
      '--mdc-elevation-overlay-fill-color': this.color || '',
      '--mdc-elevation-overlay-width': this.width,
      '--mdc-elevation-overlay-height': this.height,
    };
    return html`
      <div class="overlay-wrapper" style=${styleMap(styles)}>
        This surface is in dark mode at elevation ${this.elevation}.
        <div class="mdc-elevation-overlay"></div>
      </div>
      <div class="controls">
        <div>
          <span>elevation:</span>
          <select @change=${this.onChange}>
            <option value="0" selected>0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="24">24</option>
          </select>
        </div>
        <div>
          <span>color:</span>
          <input @input=${this.onColorInput} value=${this.color} type="color">
        </div>
        <div>
          <span>width:</span>
          <input @input=${this.onWidthInput} value=${this.width}>
        </div>
        <div>
          <span>height:</span>
          <input @input=${this.onHeightInput} value=${this.height}>
        </div>
      </div>
    `;
  }

  onChange(e) {
    const elevationSelect = e.target;
    const value = Number(elevationSelect.value);
    this.elevation = Number(value);
  }

  onColorInput(e) {
    const input = e.target;
    this.color = input.value;
  }

  onWidthInput(e) {
    const input = e.target;
    this.width = input.value;
  }

  onHeightInput(e) {
    const input = e.target;
    this.height = input.value;
  }
}

customElements.define('my-element', MyElement);
