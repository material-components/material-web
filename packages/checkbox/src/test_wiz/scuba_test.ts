import 'jasmine';

import {checkbox} from 'goog:google3.third_party.javascript.material_web_components.checkbox.templates';  // from //third_party/javascript/material_web_components/checkbox:soy_pinto
import IntegrationEnvironment from 'goog:wiz.labs.testing.IntegrationEnvironment'; // from //javascript/apps/wiz/labs/testing
import {customMatchers, Scuba} from 'google3/testing/karma/karma_scuba_framework';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('{template mwc-checkbox-wiz}', () => {
  let scuba: Scuba;
  const env = new IntegrationEnvironment().withJasmine();

  beforeAll(async () => {
    const goldens =
        'third_party/javascript/material_web_components/checkbox/test_wiz/scuba_goldens';
    scuba = new Scuba(goldens);
    jasmine.addMatchers(customMatchers);
  });

  it('unchecked', async () => {
    env.renderTemplate(checkbox, {});
    expect(await scuba.diffElement('unchecked', 'body')).toHavePassed();
  });

  it('checked', async () => {
    env.renderTemplate(checkbox, {checked: true});
    expect(await scuba.diffElement('checked', 'body')).toHavePassed();
  });

  // TODO: The initial generated image is not correct.
  xit('indeterminate', async () => {
    env.renderTemplate(checkbox, {indeterminate: true});
    expect(await scuba.diffElement('indeterminate', 'body')).toHavePassed();
  });

  // TODO: The initial generated image is not correct.
  xit('disabled', async () => {
    env.renderTemplate(checkbox, {disabled: true});
    expect(await scuba.diffElement('disabled', 'body')).toHavePassed();
  });
});
