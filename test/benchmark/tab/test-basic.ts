import '@material/mwc-tab';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-tab label="one"></mwc-tab>
`);
