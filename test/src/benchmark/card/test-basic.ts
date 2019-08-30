/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import '@material/mwc-card';
import '@material/mwc-card-media';
import '@material/mwc-card-primary-action';
import {html} from 'lit-html';
import {measureFixtureCreation} from '../../util/helpers';

measureFixtureCreation(html`
<mwc-card>
  <mwc-card-primary-action>
    <mwc-card-media></mwc-card-media>
    Standard
  </mwc-card-primary-action>
  <mwc-button slot="button">Read</mwc-button>
  <mwc-button slot="button">Bookmark</mwc-button>
  <mwc-icon-button slot="icon" icon="favorite"></mwc-icon-button>
  <mwc-icon-button slot="icon" icon="share"></mwc-icon-button>
  <mwc-icon-button slot="icon" icon="more_vert"></mwc-icon-button>
</mwc-card>
`);