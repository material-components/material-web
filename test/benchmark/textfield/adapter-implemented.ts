import '@material/mwc-textfield/mwc-textfield-adapter';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-textfield-adapter value="Hello world!"></mwc-textfield-adapter>
`, async () => {}, 1000);