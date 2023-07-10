// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdTonalButton} from './tonal-button.js';

describe('<md-tonal-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdTonalButton.styles);
  });
});
