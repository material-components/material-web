/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../slider';

// import * as hanbi from 'hanbi';
import {html} from 'lit';

import {fixture, TestFixture} from '../../../test/src/util/helpers';
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {Slider} from '../slider';

const basic = html`
  <mwc-slider></mwc-slider>
`;

// TODO(emarquez): add tests for slider
describe('mwc-slider', () => {
  let fixt: TestFixture;
  let element: Slider;

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(basic);
      element = fixt.root.querySelector('mwc-slider')!;
    });

    afterEach(() => {
      fixt.remove();
    });

    it('initializes as an mwc-slider', () => {
      expect(element).toBeInstanceOf(Slider);
    });
  });
});
