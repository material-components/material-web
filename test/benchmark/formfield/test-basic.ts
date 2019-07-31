import '@material/mwc-formfield';
import '@material/mwc-radio';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <mwc-formfield label="This is a radio."></mwc-formfield>
`);