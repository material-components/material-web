import '@material/mwc-switch';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-switch checked></mwc-switch>
`);