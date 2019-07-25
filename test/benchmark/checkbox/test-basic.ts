import '@material/mwc-checkbox';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-checkbox checked></mwc-checkbox>
`);