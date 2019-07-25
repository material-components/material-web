import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-tab-bar>
        <mwc-tab label="one"></mwc-tab>
        <mwc-tab label="two"></mwc-tab>
        <mwc-tab label="three"></mwc-tab>
      </mwc-tab-bar>
`);