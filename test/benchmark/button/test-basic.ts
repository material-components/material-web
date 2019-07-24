import '@material/mwc-button';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-button label="Normal"></mwc-button>
`);