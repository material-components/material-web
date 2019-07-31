import '@material/mwc-icon-button';
import '@material/mwc-icon';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <mwc-icon-button icon="error"></mwc-icon-button>
`);