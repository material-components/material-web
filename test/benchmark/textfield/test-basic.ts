import '@material/mwc-textfield';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-textfield value="Hello world!"></mwc-textfield>
`);