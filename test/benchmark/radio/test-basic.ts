import '@material/mwc-radio';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <mwc-radio id="s.1" name="s"></mwc-radio>
  <mwc-radio id="s.2" name="s" checked></mwc-radio>
`);