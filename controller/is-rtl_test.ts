// import 'jasmine'; (google3-only)

import {isRtl} from './is-rtl.js';

function setDirection(node: HTMLElement, rtl: boolean) {
  node.dir = rtl ? 'rtl' : 'ltr';
}

describe('isRtl', () => {
  let testDiv: HTMLElement;

  beforeEach(() => {
    // reset document direction
    setDirection(document.documentElement, false);
    testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
  });

  afterEach(() => {
    document.body.removeChild(testDiv);
  });

  it('returns the direction of a given node', () => {
    expect(isRtl(testDiv)).toEqual(false);
    setDirection(testDiv, true);
    expect(isRtl(testDiv)).toEqual(true);
  });

  it('does not check direction if `shouldCheck` is false', () => {
    expect(isRtl(testDiv, false)).toEqual(false);
    setDirection(testDiv, true);
    expect(isRtl(testDiv, false)).toEqual(false);
  });
});
