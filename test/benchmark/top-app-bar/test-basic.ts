import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../helpers';

measureFixtureCreation(html`
  <mwc-top-app-bar>
    <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
    <div slot="title" id="title">Standard</div>
    <mwc-icon-button icon="file_download" slot="actionItems"></mwc-icon-button>
    <mwc-icon-button icon="print" slot="actionItems"></mwc-icon-button>
    <mwc-icon-button icon="favorite" slot="actionItems"></mwc-icon-button>
  </mwc-top-app-bar>
`);