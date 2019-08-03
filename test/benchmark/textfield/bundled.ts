import '@material/mwc-textfield/mwc-textfield-bundle';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-textfield-bundle outlined label="my label" value="Hello world!"></mwc-textfield-bundle>
`);