// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilledButton} from './filled-button.js';

describe('<md-filled-button>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledButton.styles);
  });
});
