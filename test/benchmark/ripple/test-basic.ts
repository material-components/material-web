import '@material/mwc-ripple';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <div class="demo-box">Primary<mwc-ripple primary></mwc-ripple></div>
`);