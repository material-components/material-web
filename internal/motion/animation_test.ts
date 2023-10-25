/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {
  AnimationSignal,
  createAnimationSignal,
  createThrottle,
  msFromTimeCSSValue,
} from './animation.js';

describe('createAnimationSignal()', () => {
  let task: AnimationSignal;

  beforeEach(() => {
    task = createAnimationSignal();
  });

  describe('start()', () => {
    it('should return an AbortSignal', () => {
      const signal = task.start();
      expect(signal).toBeInstanceOf(AbortSignal);
    });

    it('should abort previous signal on subsequent calls', () => {
      const firstSignal = task.start();
      expect(firstSignal.aborted)
        .withContext('first signal should not be aborted by default')
        .toBeFalse();
      const secondSignal = task.start();
      expect(firstSignal.aborted)
        .withContext('first signal should abort after start is called again')
        .toBeTrue();
      expect(secondSignal.aborted)
        .withContext('second signal should not be aborted by default')
        .toBeFalse();
    });
  });

  describe('finish()', () => {
    it('should not abort the AbortSignal', () => {
      const signal = task.start();
      task.finish();
      expect(signal.aborted)
        .withContext('finishing a task should not signal an abort')
        .toBeFalse();
    });

    it('should not abort previous tasks when starting after finishing', () => {
      const firstSignal = task.start();
      task.finish();
      task.start();
      expect(firstSignal.aborted)
        .withContext('starting a new task should not finished tasks')
        .toBeFalse();
    });
  });
});

describe('createThrottle()', () => {
  it('throttles calls', async () => {
    const throttle = createThrottle();
    const key = 'foo';
    const fn = jasmine.createSpy();
    let timeoutResolver: Function | null = null;
    const timeout = new Promise((r) => {
      timeoutResolver = r;
    });
    const timeoutFn = async () => {
      await timeout;
    };
    const t1 = throttle(key, fn, timeoutFn);
    const t2 = throttle(key, fn, timeoutFn);
    const t3 = throttle(key, fn, timeoutFn);
    expect(fn).not.toHaveBeenCalled();
    timeoutResolver!();
    await Promise.all([t1, t2, t3]);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('msFromTimeCSSValue()', () => {
  it('parses values in ms', () => {
    const n = msFromTimeCSSValue('57ms');
    expect(n).toBe(57);
  });

  it('parses values in s', () => {
    const n = msFromTimeCSSValue('1.23s');
    expect(n).toBe(1230);
  });
});
