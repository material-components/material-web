import '@material/mwc-fab';
import '@material/mwc-icon';
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';

measureFixtureCreation(html`
  <mwc-fab icon="explore" label="Explore the world. (This is an example label.)"></mwc-fab>
`);