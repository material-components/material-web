import '@material/mwc-textfield/mwc-textfield';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-textfield outlined label="this is my label" value="hello"></mwc-textfield>
`, {numRenders: 500});