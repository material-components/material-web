/** @license Googler-authored internal-only code. */

import '../../icon/icon.js';
import '../../navigationtab/navigation-tab.js';
import '../navigation-bar.js';
// import 'jasmine'; (google3-only)

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {TemplateBuilder} from '../../testing/templates.js';
import {html} from 'lit';

import {NavigationBarHarness} from '../harness.js';

import {createNavigationBarTestCases} from './scuba-test-cases.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/navigationbar/test/scuba_goldens';

describe('<md-navigation-bar>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(NavigationBarHarness).withVariants({
        default(directive) {
          return html`
            <div style="width:300px">
              <md-navigation-bar ${directive}>
                <md-navigation-tab label="Label" showBadge>
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="Label" showBadge badgeValue="9">
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="Label">
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
              </md-navigation-bar>
            </div>
          `;
        },
        hiddenInactiveLabels(directive) {
          return html`
            <div style="width:300px">
              <md-navigation-bar hideInactiveLabels ${directive}>
                <md-navigation-tab label="Label" showBadge badgeValue="99">
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="Label" showBadge>
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab label="Label">
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
              </md-navigation-bar>
            </div>`;
        },
        iconsOnly(directive) {
          return html`
            <div style="width:300px">
              <md-navigation-bar hideInactiveLabels ${directive}>
                <md-navigation-tab showBadge badgeValue="999+">
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab showBadge>
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
                <md-navigation-tab>
                  <md-icon slot="activeIcon">star</md-icon>
                  <md-icon slot="inactiveIcon">star_border</md-icon>
                </md-navigation-tab>
              </md-navigation-bar>
            </div>`;
        },
      });

  createNavigationBarTestCases(env, templates);
});
