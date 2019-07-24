import '@material/mwc-slider';
import '@material/mwc-checkbox';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-slider discrete markers max="50" value="10" step="5"></mwc-slider>
`);