import '@material/mwc-linear-progress';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <mwc-linear-progress determinate progress="0.5" buffer="1">
  </mwc-linear-progress>
`);