import '@material/mwc-textfield/mwc-textfield-bundle';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-textfield-bundle outlined label="this is my label" value="hello"></mwc-textfield-bundle>
`, {numRenders: 500});